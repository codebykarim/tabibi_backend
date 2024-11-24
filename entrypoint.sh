#!/bin/sh

# Ensure that the /data directory has the right permissions
chmod -R 777 /data

# Start the application
exec "$@"
