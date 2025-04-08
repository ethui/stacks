defmodule Ethui.Services.Supervisor do
  alias Ethui.Services.HttpPortManager
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, opts, name: opts[:name])
  end

  @impl Supervisor
  def init(opts) do
    children = [
      {HttpPortManager, range: 7000..8000, name: HttpPortManager}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
