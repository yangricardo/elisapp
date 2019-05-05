python manage.py collectstatic

# Create migrations based on django models
python manage.py makemigrations

# Migrate created migrations to database
python manage.py migrate

# Start gunicorn server at port 8000 and keep an eye for app code changes
# If changes occur, kill worker and start a new one
gunicorn    \
    --reload    \
    -b 0.0.0.0:8000 \
    -t 360  \
    --graceful-timeout 180  \
    --workers 3 \
    --threads 3 \
    --worker-class gevent   \
    --worker-connections 1024   \
    backend.wsgi:application  