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
  ];
}
