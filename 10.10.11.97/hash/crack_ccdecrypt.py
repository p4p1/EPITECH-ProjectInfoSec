#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Made by papi
# Created on: Wed 17 Mar 2021 03:30:43 PM CET
# crack_ccdecrypt.py
# Description:

from subprocess import Popen, PIPE

fp = open("/opt/wordlists/rockyou.txt", 'r')

line = fp.readline()
while line:
    p1 = Popen(["ccdecrypt", "-k", "-", "./id_rsa.cpt"], stdin=PIPE)
    print(line)
    p1.communicate(bytes(line, 'utf-8'))
    line = fp.readline()
