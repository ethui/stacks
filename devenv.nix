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
      # listen_addresses = "0.0.0.0";
      # port = 5499;
      # hbaConf = builtins.readFile ./pg_hba.conf;

      initialDatabases = [
        {
          name = "postgres";
          pass = "postgres";
        }
        {
          name = "ethui_dev";
          pass = "postgres";
        }
        {
          name = "ethui_test";
          pass = "postgres";
        }
      ];
    };
  };

  processes = {
    ipfs.exec = "docker run --rm --network=ethui-stacks --volume=./priv/data/ipfs:/data/ipfs --name ethui-stacks-ipfs ipfs/kubo:v0.34.1";
    # graph-db.exec = "docker run --rm --network=ethui-stacks --volume=./priv/data/postgres:/var/lib/postgresql/data --name ethui-stacks-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=graph-node -e PGDATA=/var/lib/postgresql/data -e POSTGRES_INITDB_ARGS='-E UTF8 --locale=C' --name ethui-stacks-db --expose 5432:5499 postgres";
  };

  env = {
    PGDATABASE = "ethui_dev";
    PGDATABASE_TEST = "ethui_test";
  };
}
