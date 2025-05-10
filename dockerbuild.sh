#!/bin/bash

GREEN='\e[32m'
RED='\e[31m'
YELLOW='\e[33m'
BLUE='\e[34m'
MAGENTA='\e[35m'
CYAN='\e[36m'
RESET='\e[0m'

if [ -z "$1" ]; then
    echo -e "$RED Error: <package-name> argument is empty! $RESET"
    exit 1
fi

DEV=false
PACKAGE_NAME=$1
BUILD_TARGET=""
shift

while [[ "$#" -gt 0 ]]; do
    case "$1" in
        --dev) 
            DEV=true
            BUILD_TARGET="--target build"
            ;;
        *) 
            echo -e "$RED Unknown argument: $1 $RESET"
            exit 1
            ;;
    esac
    shift
done

VERSION=$(node -p "require('./${PACKAGE_NAME}/package.json').version" 2>/dev/null)

if [ -z "$VERSION" ]; then
    echo -e "$RED Error: Couldn't extract package version for $PACKAGE_NAME! $RESET"
    exit 1
fi

if [ "$DEV" = true ]; then
    TAG="dev-${VERSION}"
    LATEST_TAG="dev-latest"
else
    TAG="${VERSION}"
    LATEST_TAG="latest"
fi

docker build \
    $BUILD_TARGET \
    -t crowdspace-${PACKAGE_NAME}:${LATEST_TAG} \
    --secret id=npmrc,src=.npmrc \
    -f ./${PACKAGE_NAME}/Dockerfile .
    # -t crowdspace-${PACKAGE_NAME}:${TAG} \

if [ $? -ne 0 ]; then
    echo -e "$RED \nDocker build failed! $RESET"
    exit 1
else
    echo -e "${MAGENTA}Build finished${RESET}"
fi

# echo -e "${GREEN}\nDocker image ${BLUE}crowdspace-${PACKAGE_NAME}:${CYAN}${TAG}${GREEN} built successfully!${RESET}"
echo -e "${GREEN}Latest tag: ${BLUE}crowdspace-${PACKAGE_NAME}:${CYAN}${LATEST_TAG}${RESET}"
