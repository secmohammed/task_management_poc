#!/bin/bash

git pull

echo "Building server & Client"
docker compose  --env-file ./server/.env up -d --build
