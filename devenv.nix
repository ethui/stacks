{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:
let
  pkgs-unstable = import inputs.nixpkgs-unstable { system = pkgs.stdenv.system; };
in
{
  languages = {
    nix = {
      enable = true;
    };

    elixir = {
      enable = true;
      package = pkgs-unstable.elixir;
    };
  };

  packages = with pkgs; [
    # needed by daisyui
    watchman
    mprocs
  ];

  services = {
    postgres = {
      enable = true;

      # allow external connections (docker images)
      listen_addresses = "0.0.0.0";

      # choosing a non-standard port to not conflict with pg instances that may be running globally
      # the phoenix app doesn't actually needs this, since it connects through a unix socket,
      # but we need to expose a port for docker images to reach
      port = 5499;
      hbaConf = builtins.readFile ./pg_hba.conf;

      initialDatabases = [
        # for Mix.env == :dev
        {
          name = "ethui_dev";
          pass = "postgres";
        }

        # for Mix.env == :test
        {
          name = "ethui_test";
          pass = "postgres";
        }
      ];

      # creates an additional user for subgraphs, with permission to create their own databases
      initialScript = "CREATE USER graph CREATEDB SUPERUSER PASSWORD 'graph';";
    };
  };

  processes = {
    ipfs.exec = "docker run --rm --network=ethui-stacks --volume=./priv/data/ipfs:/data/ipfs --name ethui-stacks-ipfs ipfs/kubo:v0.34.1";
  };

  env = {
    PGDATABASE = "ethui_dev";
    PGDATABASE_TEST = "ethui_test";
  };
}
