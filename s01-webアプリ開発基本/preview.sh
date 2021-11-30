#!/bin/bash

cd $(dirname $0)
docker run --rm --name mkdock-preview -it -v ${PWD}:/docs -p 8000:8000 squidfunk/mkdocs-material
