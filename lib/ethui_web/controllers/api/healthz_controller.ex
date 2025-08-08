defmodule EthuiWeb.Api.HealthzController do
  use EthuiWeb, :controller

  def index(conn, _params) do
    json(conn, %{
      status: "success",
      data: %{
        message: "Ah, ha, ha, ha, stayin' alive, stayin' alive !"
      }
    })
  end
end
