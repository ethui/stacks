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
    sqlite
    watchman
  ];

  scripts = {
    dev.exec = "cd server && mix phx.server";
    setup.exec = "cd server && mix setup && mix ecto.create && mix ecto.migrate";
  };
}
