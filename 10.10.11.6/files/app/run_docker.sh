#!/bin/sh

wg-quick up eth1
finish () {
    wg-quick down eth1
    exit 0
}
trap finish TERM INT QUIT
cd server && node index.js &
wait $!
