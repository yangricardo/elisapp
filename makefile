.PHONY: all build push deploy run stop

all: build push deploy

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

notebook:
	docker-compose exec -d app python manage.py shell_plus --notebook

add-jupyter:
	docker-compose exec app pip install jupyter