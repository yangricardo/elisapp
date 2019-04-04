.PHONY: all build push deploy run stop

all: build push deploy

build:
	docker build -t yangricardo/elisapp:latest -f config/app/Dockerfile .

push:
	docker yangricardo/elisapp:latest

deploy:
	eb deploy

run:
	docker-compose up -d

stop:
	docker-compose down