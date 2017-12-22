# Student Review System (API)

This is the API for the Student Review System, a web system designed for peer review and self-evaluation for students in schools and universities.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Before you can get started running this API, you'll need to have Docker installed. On Windows, install [Docker for Windows](https://www.docker.com/docker-windows). On macOS, install [Docker for Mac](https://www.docker.com/docker-mac). On Linux systems, install the version of [Docker CE](https://www.docker.com/community-edition) that supports your distribution.

You'll also need to install [Docker Compose](https://docs.docker.com/compose/install/).

### Running

To start the API and all of the required dependencies, run `docker-compose up --build` from the project directory in a terminal. The API should be accessible from `localhost:8080`.

The server should automatically restart during development. In case of major changes or modifications to the Docker setup, just run the docker-commpose command again.

## Deployment

Instructions for deployment on production systems are currently in development.

## Built With

* [Docker](https://www.docker.com/) - Container system used for building and running the API
* [Node.js](https://nodejs.org/en/) - A JavaScript runtime for servers
* [Koa](http://koajs.com/) - A lightweight Node web framework
* Other dependencies installed from npm - see [package.json](package.json) for a full list of dependencies

## Authors

This is an open-source project developed by [Orion Computing LLC](https://orioncomputing.net).

* **Kian Moretz** - _Lead project developer_
* **Dr. Jeff Moretz** - _Project direction_

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
