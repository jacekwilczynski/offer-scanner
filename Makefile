all: build start

anew: clean all

build:
	docker compose build

clean:
	docker compose down --remove-orphans --rmi all --volumes
	rm -rf dist node_modules

restart: stop start shell

shell:
	@echo "\nRun 'node dist/refresh' to check for new offers. Check the 'dist' directory for more commands.\n"
	docker compose exec node sh

start:
	docker compose up --detach
	make shell

stop:
	docker compose down --remove-orphans
