#!/bin/bash

SERVICE=$1
TAG=${2:-"latest"}

docker tag crowdspace-${SERVICE}:${TAG} ashkar2023/crowdspace-${SERVICE}:${TAG}
