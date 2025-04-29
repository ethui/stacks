defmodule EthuiWeb.Router do
  use EthuiWeb, :router
  import Backpex.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {EthuiWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Backpex.ThemeSelectorPlug
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :proxy do
    # plug :accepts, ["json"]
    # explicitly empty for clarity
    # we don't want any plugs here since that makes assumptions on the request type,
    # and proxy endpoints should support GET/POST, html/json, etc
    # 
    # Note: a plug :copy_req_body is actually in endpoint.ex.
    # it couldn't be added here since it needs to be called before Plug.Parsers
    plug EthuiWeb.Plugs.StackSubdomain
  end

  scope "/", EthuiWeb, host: "admin." do
    pipe_through :browser

    backpex_routes()

    get "/", RedirectController, :redirect_to_stacks

    live_session :default, on_mount: Backpex.InitAssigns do
      live_resources "/stacks", Live.Admin.StackLive
    end
  end

  scope "/", EthuiWeb, host: "api." do
    pipe_through :api

    resources "/stacks", Api.StackController, param: "slug" do
      # get "/logs", StackController, :logs
    end
  end

  scope "/", EthuiWeb do
    pipe_through :proxy

    match :*, "*proxied_path", ProxyController, :reverse_proxy

    # scope "/:slug" do
    #   get "/log", LogController, :show
    #   match :*, "/", ProxyController, :anvil
    #   match :*, "/subgraph/http/*proxied_path", ProxyController, :subgraph_http
    #   match :*, "/subgraph/jsonrpc/*proxied_path", ProxyController, :subgraph_jsonrpc
    #   match :*, "/subgraph/status/*proxied_path", ProxyController, :subgraph_status
    # end
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:ethui, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: EthuiWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
