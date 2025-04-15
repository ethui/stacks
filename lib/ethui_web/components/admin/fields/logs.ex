defmodule EthuiWeb.Components.Admin.Fields.Logs do
  @config_schema [
    format: [
      doc: """
      Format string which will be used to format the date time value or function that formats the date time.

      Can also be a function wich receives a `DateTime` and must return a string.
      """,
      type: {:or, [:string, {:fun, 1}]},
      default: "%Y-%m-%d"
    ],
    debounce: [
      doc: "Timeout value (in milliseconds), \"blur\" or function that receives the assigns.",
      type: {:or, [:pos_integer, :string, {:fun, 1}]}
    ],
    throttle: [
      doc: "Timeout value (in milliseconds) or function that receives the assigns.",
      type: {:or, [:pos_integer, {:fun, 1}]}
    ],
    readonly: [
      doc: "Sets the field to readonly. Also see the [panels](/guides/fields/readonly.md) guide.",
      type: {:or, [:boolean, {:fun, 1}]}
    ]
  ]

  def handle_info(msg, socket) do
    IO.inspect(msg)
    {:noreply, socket}
  end

  use Backpex.Field, config_schema: @config_schema

  @impl Backpex.Field
  def render_value(assigns) do
    ~H"""
    <div><.live_component module={EthuiWeb.Components.Admin.LogTailLive} id="logs" foo="bar" /></div>
    """
  end

  @impl Backpex.Field
  def render_form(assigns) do
    {:error, :not_implemented}
  end

  @impl Backpex.Field
  def render_form_readonly(assigns) do
    {:error, :not_implemented}
  end

  @impl Backpex.Field
  def render_index_form(assigns) do
    {:error, :not_implemented}
  end

  @impl Phoenix.LiveComponent
  def handle_event("update-field", %{"index_form" => %{"value" => value}}, socket) do
    {:error, :not_implemented}
  end
end
