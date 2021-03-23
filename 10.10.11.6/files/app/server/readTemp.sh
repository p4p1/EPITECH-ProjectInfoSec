#!/usr/bin/env bash

temp=$RANDOM
(("temp %= 100"))
(("temp += 250"))
echo $temp