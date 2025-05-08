defmodule EthuiWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :ethui

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_ethui_key",
    signing_salt: "kEJ16v2a",
    same_site: "Lax"
  ]

  socket "/live", Phoenix.LiveView.Socket,
    websocket: [connect_info: [session: @session_options]],
    longpoll: [connect_info: [session: @session_options]]

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phx.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/",
    from: :ethui,
    gzip: false,
    only: EthuiWeb.static_paths()

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :ethui
  end

  plug Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]


  # copies the entire request body into a private field, for later use
  # necessary because Plug.Parsers consumes the body, and merges and parses it along with query params
  # for proxying needs, we need the *raw* body, *without* including query params
  plug :copy_req_body

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug EthuiWeb.Router

  defp copy_req_body(conn, _) do
    # TODO: only do this on /stacks/* requests, which target the proxy controller
    {:ok, body, _} = Plug.Conn.read_body(conn)

    Plug.Conn.put_private(conn, :raw_body, body)
  end
end
