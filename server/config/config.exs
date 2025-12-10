[pool_size: 10, adapter: Ecto.Adapters.SQLite3]
[pool_size: 10, adapter: Ecto.Adapters.Postgres]
# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :ethui,
  ecto_repos: [Ethui.Repo],
  generators: [timestamp_type: :utc_datetime]

config :ethui,
       Ethui.Repo,
       # ssl: true,
       pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
       adapter: Ecto.Adapters.SQLite3

# Configures the endpoint
config :ethui, EthuiWeb.Endpoint,
  # Bandit seems to cause issues under heavy load:
  # https://github.com/mtrudel/bandit/issues/438
  # the default is Cowboy2, so the below setting should stay commented out
  # adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: EthuiWeb.ErrorHTML, json: EthuiWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Ethui.PubSub,
  live_view: [signing_salt: "G8Rh0+AS"]

config :ethui,
  session_options: [
    store: :cookie,
    key: "_ethui_key",
    signing_salt: "kEJ16v2a",
    same_site: "Lax"
  ]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :ethui, Ethui.Mailer, adapter: Swoosh.Adapters.Local

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.25.2",
  ethui: [
    args:
      ~w(assets/js/app.js --bundle --target=es2017 --outdir=priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("..", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "4.0.17",
  ethui: [
    args: ~w(
      --input=assets/css/app.css
      --output=./priv/static/assets/app.css
    ),
    cd: Path.expand(".", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# needed fot the docker image to run
# https://github.com/elixir-sqlite/exqlite/issues/323
config :exqlite, force_build: true

config :ethui, Ethui.Stacks,
  graph_node_image: "graphprotocol/graph-node:f02dfa2",
  ipfs_image: "ipfs/kubo:v0.34.1",
  pg_image: "postgres:17.4",
  anvil_bin: System.get_env("ANVIL_BIN", "anvil"),
  docker_host: System.get_env("DOCKER_HOST", "172.17.0.1"),
  chain_id_prefix: 0x00EE

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
