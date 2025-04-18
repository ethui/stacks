defmodule Ethui.DataCase do
  @moduledoc """
  This module defines the setup for tests requiring
  access to the application's data layer.

  You may define functions here to be used as helpers in
  your tests.

  Finally, if the test case interacts with the database,
  we enable the SQL sandbox, so changes done to the database
  are reverted at the end of every test. If you are using
  PostgreSQL, you can even run database tests asynchronously
  by setting `use Ethui.DataCase, async: true`, although
  this option is not recommended for other databases.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      alias Ethui.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import Ethui.DataCase
    end
  end

  setup tags do
    Ethui.DataCase.setup_sandbox(tags)
    :ok
  end

  @doc """
  Sets up the sandbox based on the test tags.
  """
  def setup_sandbox(tags) do
    pid = Ecto.Adapters.SQL.Sandbox.start_owner!(Ethui.Repo, shared: not tags[:async])
    on_exit(fn -> Ecto.Adapters.SQL.Sandbox.stop_owner(pid) end)
  end

  @doc """
  A helper that transforms changeset errors into a map of messages.

      assert {:error, changeset} = Accounts.create_user(%{password: "short"})
      assert "password is too short" in errors_on(changeset).password
      assert %{password: ["password is too short"]} = errors_on(changeset)

  """
  def errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Regex.replace(~r"%{(\w+)}", message, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
  end

  @doc """
  A test helper for asserting that a function will return
  a truthy value eventually within a given time frame.
  """
  def assert_eventually(fun, timeout \\ 500, interval \\ 10)

  def assert_eventually(_fun, timeout, _interval) when timeout <= 0 do
    raise ExUnit.AssertionError,
          "Eventually assertion failed to receive a truthy result before timeout."
  end

  def assert_eventually(fun, timeout, interval) do
    result = fun.()
    ExUnit.Assertions.assert(result)
    result
  rescue
    ExUnit.AssertionError ->
      Process.sleep(interval)
      assert_eventually(fun, timeout - interval, interval)
  end
end
