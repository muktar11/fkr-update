#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi


python manage.py makemigrations
python manage.py migrate commerce 

python manage.py collectstatic --no-input
#DJANGO_SUPERUSER_PASSWORD='root#4353' python manage.py createsuperuser --first_name='root' --last_name='last' --email='admin@email.com' --noinput

exec "$@"
