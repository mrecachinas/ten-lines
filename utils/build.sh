#!/bin/bash

git pull
npm cache clean
npm install
grunt build
forever restart tenlines
