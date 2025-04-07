import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :anvil_ops, AnvilOpsWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "EqC9N4Pl7Meuq6nCu89kf3qFcuvUgJCsqjiHnJqMSXQHo1rbuy3g11Z9tTn8g/5d",
  server: false

# In test we don't send emails
config :anvil_ops, AnvilOps.Mailer, adapter: Swoosh.Adapters.Test

# Disable swoosh api client as it is only required for production adapters
config :swoosh, :api_client, false

# Print only warnings and errors during test
config :logger, level: :debug

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
