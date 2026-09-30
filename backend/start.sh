#!/bin/bash
# Force Google + Cloudflare DNS
echo "nameserver 8.8.8.8" > /etc/resolv.conf
echo "nameserver 1.1.1.1" >> /etc/resolv.conf

# Run Django with Gunicorn
exec poetry run gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
