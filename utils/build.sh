#!/bin/bash

npm cache clean
npm install
grunt build
forever restart tenlines
