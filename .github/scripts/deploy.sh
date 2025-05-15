#!/usr/bin/env bash

set -e

root=$HOME/stacks.ethui.dev
release_path=$root/build
new_release_path=$root/build-new
bin=$root/build/bin/ethui

cd $root

mkdir -p $root/logs

if [[ ! -f env.sh ]]; then
    echo "$root/env.sh not found"
    exit 1
fi

if [[ ! -d $new_release_path ]]; then
    echo "$new_release_path not found"
    exit 1
fi

source env.sh

$bin eval "Ethui.Release.before_release"
set +e
pid=$($bin pid)
if [[ $? -ne 0 ]]; then
    echo "ethui not running. not need to stop"
else
    echo "old pid: $pid"
    $bin stop
fi
set -e

# preserve old logs
mv $release_path/tmp/log $root/logs/$(date +%Y-%m-%d-%H-%M-%S)

rm -rf $release_path
mv $new_release_path $release_path

echo "starting daemon"
$bin daemon
pid=$($bin pid)
echo "new pid: $pid"
