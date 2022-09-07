#!/bin/bash

mkdir -p deploy
cp ./box-breathing.html ./deploy/index.html
cp ./style.css ./deploy/style.css
uglifyjs --compress --mangle -- script.js > ./deploy/script.js
