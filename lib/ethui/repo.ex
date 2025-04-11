defmodule Ethui.Repo do
  use Ecto.Repo,
    otp_app: :ethui,
    adapter: Ecto.Adapters.Postgres
end
