import Config

# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# system starts, so it is typically used to load production configuration
# and secrets from environment variables or elsewhere. Do not define
# any compile-time configuration in here, as it won't be applied.
# The block below contains prod specific runtime configuration.

# ## Using releases
#
# If you use `mix release`, you need to explicitly enable the server
# by passing the PHX_SERVER=true when you start it:
#
#     PHX_SERVER=true bin/ethui start
#
# Alternatively, you can use `mix phx.gen.release` to generate a `bin/server`
# script that automatically sets the env var above.
if System.get_env("PHX_SERVER") do
  config :ethui, EthuiWeb.Endpoint, server: true
end

# Configure JWT secret from environment variable or use default
if jwt_secret = System.get_env("JWT_SECRET") do
  config :ethui, :jwt_secret, jwt_secret
end

enable_auth? = !!System.get_env("ETHUI_STACKS_ENABLE_AUTH")
config :ethui, EthuiWeb.Plugs.Authenticate, enabled: enable_auth?

if config_env() == :prod do
  data_root =
    System.get_env("DATA_ROOT") || raise("missing env var DATA_ROOT")

  is_dockerized? = !!System.get_env("ETHUI_STACKS_DOCKERIZED")

  config :ethui,
         Ethui.Repo,
         database: Path.join([data_root, "db.sqlite3"])

  config :ethui, Ethui.Repo,
    # ssl: true,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

  # The secret key base is used to sign/encrypt cookies and other secrets.
  # A default value is used in config/dev.exs and config/test.exs but you
  # want to use a different value for prod and you most likely don't want
  # to check this value into version control, so we use an environment
  # variable instead.
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  jwt_secret =
    System.get_env("JWT_SECRET") ||
      raise """
      environment variable JWT_SECRET is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  host = System.get_env("PHX_HOST") || "stacks.ethui.dev"
  port = System.get_env("PHX_PORT") || 4000
  listen_ip = if is_dockerized?, do: {0, 0, 0, 0}, else: {127, 0, 0, 1}

  config :ethui, :dns_cluster_query, System.get_env("DNS_CLUSTER_QUERY")

  config :ethui, EthuiWeb.Endpoint,
    http: [ip: listen_ip, port: port],
    url: [host: host, port: 443, scheme: "https"],
    force_ssl: [rewrite_on: [:x_forwarded_proto]],
    secret_key_base: secret_key_base

  config :ethui, Ethui.Stacks,
    data_dir_root: Path.join([data_root, "stacks"]),
    pg_data_dir: Path.join([data_root, "pg"]),
    ipfs_data_dir: Path.join([data_root, "ipfs"]),
    chain_id_prefix: 0x00EE

  config :ethui, :jwt_secret, jwt_secret

  config :ethui, Ethui.Mailer,
    adapter: Swoosh.Adapters.Mua,
    relay: System.get_env("MAILER_SMTP") || raise("missing env var MAILER_SMTP"),
    port: System.get_env("MAILER_SMTP_PORT") || raise("missing env var MAILER_SMTP_PORT"),
    auth: [
      username:
        System.get_env("MAILER_SMTP_USERNAME") || raise("missing env var MAILER_SMTP_USERNAME"),
      password:
        System.get_env("MAILER_SMTP_PASSWORD") || raise("missing env var MAILER_SMTP_PASSWORD")
    ],
    ssl: false,
    tls: :always
end
