all: build start shell

anew: clean all

build:
	docker compose build
	docker compose run node yarn install

clean:
	docker compose down --remove-orphans --rmi all --volumes
	rm -rf dist node_modules

restart: stop start

shell:
	@echo "\nRun 'node dist/refresh' to check for new offers. Check the 'dist' directory for more commands.\n"
	docker compose exec node sh

start:
	docker compose up --detach

stop:
	docker compose down
