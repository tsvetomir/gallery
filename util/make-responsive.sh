#!/bin/bash

RESOLUTIONS=(480 640 960 1100 1600)
RES_ARRAY=$(IFS=, ; echo "${RESOLUTIONS[*]}")

for RES in "${RESOLUTIONS[@]}"
do
    find . -name "*.jpg" -not -name "*-*px.jpg" \
        -exec sh -c 'echo "${0%.*}-${1}px.jpg"' {} $RES \; \
        -exec sh -c 'gm convert "$0" -resize "$1"x -quality 85 "${0%.*}-${1}px.jpg"' {} $RES \;
done

echo "{
  \"enabled\": true,
  \"resolutions\": [${RES_ARRAY}]
}" > responsive.json
