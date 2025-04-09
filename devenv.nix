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

  services = {
    postgres = {
      enable = true;
      initialDatabases = [ { name = "db"; } ];
      initialScript = ''
        CREATE USER postgres WITH PASSWORD 'postgres';
        GRANT ALL PRIVILEGES ON DATABASE db TO postgres;
      '';
    };
  };

  env = {
    DATABASE_URL = "postgres://postgres:postgres@localhost:5432/db";
  };
}
