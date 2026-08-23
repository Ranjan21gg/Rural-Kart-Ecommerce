#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput
python manage.py migrate django_celery_beat --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Ensuring superuser exists..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
import os

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')

if username and password and not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superuser {username} created.')
else:
    print('Superuser already exists or credentials not provided.')
"

echo "Starting server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000