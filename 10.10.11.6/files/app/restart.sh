#!/bin/sh

./build.sh && docker kill thermostat
sleep 2
./run.sh
