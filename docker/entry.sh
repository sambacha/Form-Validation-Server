#!/bin/sh
set -e

if [ "${1#-}" != "$1" ] || [ -z "$(which $1)" ]; then
	set -- node "$@"
fi

exec "$@"