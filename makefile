.PHONY: all build push deploy run stop

all: build run

build:
	pipenv run pip freeze > config/app/requirements.txt
	docker build -t yangricardo/elisapp:latest -f config/app/Dockerfile .

push:
	docker push yangricardo/elisapp:latest
	docker push yangricardo/elisdb:latest

deploy:
	eb deploy

run:
	docker-compose up -d

run-prod:
	docker-compose -f docker-compose-prod.yml up -d

stop:
	docker-compose stop

down:
	docker-compose down

prune:
	docker container prune <<< y
	docker image prune <<< y
	docker volume prune <<< y

create-network:
	docker network create --gateway 172.16.1.1 --subnet 172.16.1.0/24 elisapp_network

init-letsencrypt.sh:
	curl -L https://raw.githubusercontent.com/wmnnd/nginx-certbot/master/init-letsencrypt.sh > ./config/nginx/init-letsencrypt.sh

bash:
	docker-compose exec app /bin/bash

pipenv-install:
	pipenv install

pipenv-update:
	pipenv update --outdated
	pipenv update

npm-update:
	docker-compose exec app npm update

npm-install:
	docker-compose exec app npm install

npm-run-dev:
	cd app && npm run dev-watch && cd -

app-logs:
	docker-compose logs app

db-logs:
	docker-compose logs postgres

nginx-logs:
	docker-compose logs nginx

collectstatic:
	docker-compose exec app bash -c 'python manage.py collectstatic <<< yes'

createsuperuser:
	docker-compose exec app python manage.py createsuperuser

migrate:
	docker-compose exec app python manage.py makemigrations api
	docker-compose exec app python manage.py makemigrations frontend
	docker-compose exec app python manage.py makemigrations
	docker-compose exec app python manage.py migrate
	
remigrate:
	docker-compose exec app rm -rf api/migrations
	docker-compose exec app rm -rf frontend/migrations
	docker-compose exec app python manage.py makemigrations api
	docker-compose exec app python manage.py makemigrations frontend
	docker-compose exec app python manage.py migrate

notebook:
	docker-compose exec -d app python manage.py shell_plus --notebook
	docker-compose exec app jupyter notebook list
	
notebook-token:
	docker-compose exec app jupyter notebook list

run-debug:
	docker-compose exec app python manage-debug.py runserver --noreload 0.0.0.0:9000

backup-db:
	make backup-db-schema
	make backup-db-data
	make backup-db-views

backup-full-db:
	docker exec -e PGPASSWORD=elisdbpassword elisapp_postgres pg_dump -U elisdbadmin elisdb > config/db/elisdb.sql

backup-db-data:
	docker exec -e PGPASSWORD=elisdbpassword elisapp_postgres pg_dump -U elisdbadmin --data-only elisdb > config/db/elisdb.1.data.sql

backup-db-schema:
	docker exec -e PGPASSWORD=elisdbpassword elisapp_postgres pg_dump -U elisdbadmin --schema-only elisdb > config/db/elisdb.0.schema.sql

backup-db-views:
	docker exec -e PGPASSWORD=elisdbpassword elisapp_postgres pg_dump -U elisdbadmin -s -t 'api_mview*' elisdb > config/db/elisdb.2.api_mviews.sql
	docker exec -e PGPASSWORD=elisdbpassword elisapp_postgres pg_dump -U elisdbadmin -s -t 'api_view*' elisdb > config/db/elisdb.3.api_views.sql

restore-db:
	docker exec -e PGPASSWORD=elisdbpassword elisapp_postgres pg_dump -U elisdbadmin elisdb < config/db/elisdb.sql

build-db:
	docker build -t yangricardo/elisdb:latest -f config/db/Dockerfile config/db --shm-size=512MB