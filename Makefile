RESET=\033[0m
GREEN=\033[0;32m

all: build start

anew: clean all

build:
	docker compose build

clean:
	docker compose down --remove-orphans --rmi all --volumes
	rm -rf dist node_modules

restart: stop start shell

shell:
	@echo "\n${GREEN}Run 'node dist/refresh' to check for new offers. Check the 'dist' directory for more commands.${RESET}\n"
	docker compose exec node sh

start:
	@if [ ! -f .env ]; then cp .env.dist .env; echo "${GREEN}Created a .env file for you to customize.${RESET}"; fi
	docker compose up --detach
	make shell

stop:
	docker compose down --remove-orphans
