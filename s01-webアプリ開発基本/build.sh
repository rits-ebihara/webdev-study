#!/bin/bash

cd $(dirname $0);
docker run --rm -it -v ${PWD}:/docs squidfunk/mkdocs-material build