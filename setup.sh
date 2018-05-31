#!/bin/bash

apt-get update 
apt-get upgrade
apt-get install -y nodejs
apt-get install -y build-essential
npm install jasmine
alias jasmine="node_modules/jasmine/bin/jasmine"
