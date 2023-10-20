.PHONY: build-development
build-development: ## Build the development docker image.
	docker compose -f docker-compose.yml -f docker-compose.dev.yml build

.PHONY: start-development
start-development: ## Start the development docker container.
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

.PHONY: stop-development
stop-development: ## Stop the development docker container.
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

.PHONY: build-production
build-production: ## Build the production docker image.
	docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

.PHONY: start-production
start-production: ## Start the production docker container.
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

.PHONY: stop-production
stop-production: ## Stop the production docker container.
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down
