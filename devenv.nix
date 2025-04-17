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
      initialDatabases = [
        { name = "ethui_dev"; }
        { name = "ethui_test"; }
      ];
    };
  };

  processes = {
    ipfs.exec = "docker run --network=ethui-stacks --volume=./priv/data/ipfs:/data/ipfs -p 5001:5001 ipfs/kubo:v0.34.1";
  };

  env = {
    PGDATABASE = "ethui_dev";
    PGDATABASE_TEST = "ethui_test";
  };
}
