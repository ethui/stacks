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

  env = {
    PGDATABASE = "ethui_dev";
    PGDATABASE_TEST = "ethui_test";
  };
}
