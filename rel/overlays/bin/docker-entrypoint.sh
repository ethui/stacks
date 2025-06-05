#!/bin/sh

set -eu

if [ -z "${DATA_ROOT:-}" ]; then
  echo "DATA_ROOT not defined. set it to \$HOME/.config/ethui/stacks, where \$HOME"
  exit 1
fi

if [ -z "${SECRET_KEY_BASE:-}" ]; then
  if [ -f $DATA_ROOT/phx.secret.key ]; then
    echo "phx.secret.key detected"
  else
    echo "generating a new phx.secret.key"
    openssl rand -hex 64 >> $DATA_ROOT/phx.secret.key
  fi

  export SECRET_KEY_BASE="$(cat $DATA_ROOT/phx.secret.key)"
fi

if [ -z "${PHX_HOST:-}" ]; then
  export PHX_HOST="local.ethui.dev"
fi

/app/bin/migrate
/app/bin/server
