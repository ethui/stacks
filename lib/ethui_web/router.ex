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
    plug :accepts, ["json"]
  end

  scope "/", EthuiWeb do
    pipe_through :browser

    get "/", RedirectController, :redirect_to_admin
  end

  scope "/admin", EthuiWeb do
    pipe_through :browser

    backpex_routes()

    get "/", RedirectController, :redirect_to_stacks

    live_session :default, on_mount: Backpex.InitAssigns do
      live_resources "/stacks", Live.Admin.StackLive
    end
  end

  scope "/api", EthuiWeb do
    pipe_through :api

    resources "/stacks", Api.StackController, param: "slug" do
      # get "/logs", StackController, :logs
    end
  end

  scope "/stacks", EthuiWeb do
    pipe_through :proxy

    scope "/:slug" do
      post "/", ProxyController, :anvil
      get "/log", LogController, :show
    end
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
