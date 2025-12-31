defmodule EthuiWeb.Router do
  use EthuiWeb, :router

  # This pipeline was originally in EthuiWeb.Endpoint
  # but had to be moved here to remove it from the :proxy pipeline
  pipeline :base do
    plug Plug.Parsers,
      parsers: [:urlencoded, :multipart, :json],
      pass: ["*/*"],
      json_decoder: Phoenix.json_library()

    plug Plug.MethodOverride
    plug Plug.Head
    plug Plug.Session, Application.compile_env(:ethui, :session_options)
  end

  pipeline :browser do
    plug :accepts, ["html"]

    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {EthuiWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authenticated_api do
    plug :accepts, ["json"]
    plug EthuiWeb.Plugs.Authenticate
  end

  pipeline :proxy do
    plug EthuiWeb.Plugs.StackSubdomain
    plug EthuiWeb.Plugs.ApiKeyAuth
  end

  scope "/", EthuiWeb, host: "api." do
    pipe_through [:base, :api]

    # Authentication endpoints
    post "/auth/send-code", Api.AuthController, :send_code
    post "/auth/verify-code", Api.AuthController, :verify_code
    get "/healthz", Api.HealthzController, :index
  end

  scope "/", EthuiWeb, host: "api." do
    pipe_through [:base, :authenticated_api]

    resources "/stacks", Api.StackController, param: "slug" do
      # get "/logs", StackController, :logs
      #
      post "/api-keys", ApiKeyController, :create
      get "/api-keys", ApiKeyController, :show
      delete "/api-keys", ApiKeyController, :delete
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
      pipe_through [:base, :browser]

      live_dashboard "/dashboard", metrics: EthuiWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  scope "/", EthuiWeb do
    pipe_through :proxy

    get "/logs", LogController, :show
    match :*, "/*proxied_path", ProxyController, :reverse_proxy
  end
end
