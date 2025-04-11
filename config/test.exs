import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :ethui,
       Ethui.Repo,
       IO.inspect(
         socket_dir: System.get_env("PGHOST"),
         username: System.get_env("USER"),
         password: System.get_env("PGPASSWORD"),
         database: System.get_env("PGDATABASE_TEST", "ethui_test"),
         hostname: System.get_env("PGHOSTNAME", "localhost"),
         pool: Ecto.Adapters.SQL.Sandbox,
         pool_size: System.schedulers_online() * 2
       )

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :ethui, EthuiWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "TSW4teV8sSZ8BDVeSxr5gslO8v5hVPAKmTHyyoKbLuWc5x7MEWp0gTpQ4/pupMuT",
  server: false

# In test we don't send emails
config :ethui, Ethui.Mailer, adapter: Swoosh.Adapters.Test

# Disable swoosh api client as it is only required for production adapters
config :swoosh, :api_client, false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

# Enable helpful, but potentially expensive runtime checks
config :phoenix_live_view,
  enable_expensive_runtime_checks: true

config :mix_test_watch, clear: true
