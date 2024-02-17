# Phish.it

## Project Structure

`src` - Source code for the application

`scripts` - Scripts to automate tasks

`Dockerfile` - Dockerfile for the application

`Makefile` - Makefile to automate tasks

`package.json` - Node.js package file

`swagger.json` - Swagger file for the application

`src/tests` - Tests for the application

`src/seed` - Seed data for the application

`src/users` - users feature module

`src/auth` - auth feature module

`src/bookings` - bookings feature module

`src/adventures` - adventures feature module

`src/common` - common feature module

`src/common/config` - configuration for the application

`src/backoffice` - admin feature module

## Development Guide

### Prerequisites

- Docker

### Setup

1. Clone the repository

2. Build the docker image

```bash
make build-development
```

3. Start the development server

```bash
make start-development
```

4. Open the browser and navigate to `http://localhost:5000/docs`

Happy Coding.
