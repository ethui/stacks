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
      listen_addresses = "0.0.0.0";
      port = 5499;
      hbaConf = builtins.readFile ./pg_hba.conf;

      initialDatabases = [
        {
          name = "ethui_dev";
          pass = "postgres";
        }
        {
          name = "ethui_test";
          pass = "postgres";
        }
      ];

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
