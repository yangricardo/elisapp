.PHONY: all build push deploy run stop

all: build run

build:
	pipenv run pip freeze > config/app/requirements.txt
	docker build -t yangricardo/elisapp:latest -f config/app/Dockerfile .

push:
	docker push yangricardo/elisapp:latest

deploy:
	eb deploy

run:
	docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

bash:
	docker-compose exec app /bin/bash

app-logs:
	docker-compose logs app

db-logs:
	docker-compose logs db

nginx-logs:
	docker-compose logs nginx

collectstatic:
	docker-compose exec app python manage.py collectstatic

createsuperuser:
	docker-compose exec app python manage.py createsuperuser

migrate:
	docker-compose exec app python manage.py makemigrations
	docker-compose exec app python manage.py migrate

notebook:
	docker-compose exec -d app python manage.py shell_plus --notebook
	docker-compose exec app jupyter notebook list
	
notebook-token:
	docker-compose exec app jupyter notebook list

run-debug:
	docker-compose exec app python manage-debug.py runserver --noreload 0.0.0.0:9000