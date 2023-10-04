RESET=\033[0m
GREEN=\033[0;32m

all: build load-fixtures start

anew: clean all

build:
	docker compose build

clean:
	docker compose down --remove-orphans --rmi all --volumes
	rm -rf dist node_modules

load-fixtures:
	docker compose run node yarn app:load-fixtures

restart: stop start

shell:
	@echo "\n${GREEN}Run 'yarn app:refresh' to check for new offers. Check package.json for more commands.${RESET}\n"
	docker compose exec node sh || docker compose logs

start:
	@if [ ! -f .env ]; then cp .env.dist .env; echo "${GREEN}Created a .env file for you to customize.${RESET}"; fi
	docker compose up --detach
	make shell

stop:
	docker compose down --remove-orphans
