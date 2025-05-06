defmodule Ethui.Repo do
  use Ecto.Repo,
    otp_app: :ethui,
    adapter: Application.compile_env(:ethui, __MODULE__)[:adapter]
end
