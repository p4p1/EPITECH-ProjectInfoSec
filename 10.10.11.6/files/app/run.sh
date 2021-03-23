#!/usr/bin/env bash
docker run --rm -d --cap-add net_admin --cap-add sys_module --sysctl net.ipv4.conf.all.src_valid_mark=1 --name=thermostat --hostname=thermostat -e PORT=80 -e MQTT_ADDR=mqtt://10.10.11.7:1883 thermostat
