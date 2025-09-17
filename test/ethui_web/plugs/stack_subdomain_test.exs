defmodule EthuiWeb.Plugs.StackSubdomainTest do
  use EthuiWeb.ConnCase, async: false

  alias EthuiWeb.Plugs.StackSubdomain
  alias EthuiWeb.Endpoint
  import Plug.Test

  @opts StackSubdomain.init([])

  describe "localhost behavior" do
    test "assigns no proxy on lvh.me host" do
      conn =
        conn(:get, "/")
        |> Map.put(:host, "my-stack.lvh.me")
        |> StackSubdomain.call(@opts)

      assert conn.assigns.proxy == %{slug: "my-stack", component: nil}
    end

    test "parses component and slug from graph-my-stack.lvh.me" do
      conn =
        conn(:get, "/")
        |> Map.put(:host, "graph-my-stack.lvh.me")
        |> StackSubdomain.call(@opts)

      assert conn.assigns.proxy == %{slug: "my-stack", component: "graph"}
    end
  end

  describe "docker with PHX_HOST configured (non-SaaS)" do
    setup do
      original_endpoint = Application.get_env(:ethui, Endpoint) || []
      original_stacks = Application.get_env(:ethui, Ethui.Stacks) || []

      Application.put_env(:ethui, EthuiWeb.Endpoint, url: [host: "local.ethui.dev"])
      Application.put_env(:ethui, Ethui.Stacks, Keyword.merge(original_stacks, is_saas?: false))

      # Restart endpoint to pick up new config
      :ok = Application.stop(:ethui)
      :ok = Application.start(:ethui)

      on_exit(fn ->
        Application.put_env(:ethui, EthuiWeb.Endpoint, original_endpoint)
        Application.put_env(:ethui, Ethui.Stacks, original_stacks)

        :ok = Application.stop(:ethui)
        :ok = Application.start(:ethui)
      end)

      # :ok
    end

    test "parses slug only from my-stack.local.ethui.dev" do
      conn =
        conn(:get, "/")
        |> Map.put(:host, "my-stack.local.ethui.dev")
        |> StackSubdomain.call(@opts)

      assert conn.assigns.proxy == %{slug: "my-stack", component: nil}
    end

    test "parses component and slug from graph-my-stack.local.ethui.dev" do
      conn =
        conn(:get, "/")
        |> Map.put(:host, "graph-my-stack.local.ethui.dev")
        |> StackSubdomain.call(@opts)

      assert conn.assigns.proxy == %{slug: "my-stack", component: "graph"}
    end
  end

  describe "SaaS mode (ETHUI_STACKS_SAAS)" do
    setup do
      original_endpoint = Application.get_env(:ethui, Endpoint) || []
      original_stacks = Application.get_env(:ethui, Ethui.Stacks) || []

      Application.put_env(:ethui, EthuiWeb.Endpoint, url: [host: "stacks.ethui.dev"])
      Application.put_env(:ethui, Ethui.Stacks, Keyword.merge(original_stacks, is_saas?: true))

      # Restart endpoint to pick up new config
      :ok = Application.stop(:ethui)
      :ok = Application.start(:ethui)

      on_exit(fn ->
        Application.put_env(:ethui, EthuiWeb.Endpoint, original_endpoint)
        Application.put_env(:ethui, Ethui.Stacks, original_stacks)

        :ok = Application.stop(:ethui)
        :ok = Application.start(:ethui)
      end)

      # :ok
    end

    test "parses slug only from my-stack.stacks.ethui.dev" do
      conn =
        conn(:get, "/")
        |> Map.put(:host, "my-stack.stacks.ethui.dev")
        |> StackSubdomain.call(@opts)

      assert conn.assigns.proxy == %{slug: "my-stack", component: nil}
    end

    test "parses component and slug from graph-my-stack.stacks.ethui.dev" do
      conn =
        conn(:get, "/")
        |> Map.put(:host, "graph-my-stack.stacks.ethui.dev")
        |> StackSubdomain.call(@opts)

      assert conn.assigns.proxy == %{slug: "my-stack", component: "graph"}
    end
  end
end
