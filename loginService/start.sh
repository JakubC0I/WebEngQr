#!/bin/bash
# Start pocketbase
./pocketbase -serve &

# Start express-server
node express-server.js &
