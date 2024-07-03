#!/usr/bin/env bash

npx prisma generate

npx prisma migrate dev

node .

tail -f /dev/null