#!/bin/bash

SERVICE=$1
TAG=${2:-"latest"}

docker push ashkar2023/crowdspace-${SERVICE}:${TAG}
