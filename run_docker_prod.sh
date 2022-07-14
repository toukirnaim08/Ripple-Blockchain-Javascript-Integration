#!/bin/sh
######################################
# This script builds the docker image
######################################

set -e

GIT_REVISION=$(git rev-parse --short  HEAD| tr --delete "\n")
VERSION=$(cat package.json | jq .version | tr --delete "\n\"")
PACKAGE_NAME=$(cat package.json | jq .name| tr --delete "\n\"")
FULL_VERSION=${VERSION}-${GIT_REVISION}
GENERATION_TIMESTAMP=`date --iso-8601=seconds`

DOCKER_REG_URL=pacdocker.azurecr.io/${PACKAGE_NAME}-production:latest
DOCKER_REG_VER_URL=pacdocker.azurecr.io/${PACKAGE_NAME}-production:${GIT_REVISION}

mkdir -p static
echo "{\"version\": \"${FULL_VERSION}\", \"package_name\": \"${PACKAGE_NAME}\", \"generated\": \"${GENERATION_TIMESTAMP}\"}" > static/application_info.json

# build the docker image
docker build \
    --build-arg GIT_REVISION=${GIT_REVISION} \
    --build-arg FULL_VERSION=${FULL_VERSION} \
    --build-arg PACKAGE_NAME=${PACKAGE_NAME} \
    --tag $DOCKER_REG_URL \
    .

# tag the image with revision
docker tag ${DOCKER_REG_URL} ${DOCKER_REG_VER_URL}

docker push ${DOCKER_REG_URL}
docker push ${DOCKER_REG_VER_URL}

