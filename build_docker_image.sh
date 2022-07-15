#!/bin/sh
######################################
# This script builds the docker image
######################################

set -e

PACKAGE_NAME='ripple-integration'

DOCKER_REG_URL=toukir08/${PACKAGE_NAME}-development:latest

# build the docker image
docker build \
    --build-arg PACKAGE_NAME=${PACKAGE_NAME} \
    --tag $PACKAGE_NAME \
    .

# tag the image with revision
docker tag ${DOCKER_REG_URL}

# docker push ${DOCKER_REG_URL}
# docker push ${DOCKER_REG_VER_URL}

