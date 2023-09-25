#!/bin/bash

echo $(date) >> logs.txt

docker-compose build --no-cache && docker-compose up -d