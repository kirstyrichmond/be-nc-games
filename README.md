## be-nc-games-app

## Created by Kirsty Richmond

# Description

This is a Node.js/Express games based API built to access application data programatically. The API serves game categories, reviews, users and comments in a JSON format.

The purpose of this is to imitate a real backend server which will serve the information to the front end architecture.

The database has been built with PostgresSQL and node-postgres is used to interact with this database.

Click the link to access the API: http://be-nc-games-app.herokuapp.com/api

# Install Requirements

- node
- postgreSQL

Dependencies

- dotenv
- express
- pg
- pg-format

Dev-Dependencies

- jest
- jest-sorted
- supertest

Clone:

To git clone:

https://github.com/kirstyrichmond/be-nc-games.git

Move into directory:

cd be-nc-games

Install dependencies:

$ npm install

Install dev-dependencies:

```http
$ npm i -D jest
$ npm i -D jest-sorted
$ npm i -D supertest
```

# Set Up

Step 1:

You will need to create two .env files:

- .env.test
- .env.development

Step 2:

Inside each .env file, you need to add:

```http
PGDATABASE=<database_name_here>
```

eg. PGDATABASE=nc_games (development)
eg. PGDATABASE=nc_games_test (test)

Then check that both of the .env files are .gitignored.

Step 3:

Seed local database:

Inside the db folder, you have been provided with data, a setup.sql file and a seed folder.

Once you have created your .env files, you need to run the scripts provided below to set up the database and seeding run:

```http
$ npm run setup-dbs
```

```http
$ npm run seed
```

# Testing

Run provided tests:

```http
$ npm test
```

Run devlopment environment:

```http
$ npm start
```

As the output of this API is in JSON, you can download the following chrome extension to make the JSON text more huamn-readable.

https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh

# Endpoints

Here is a list of the current endpoints that have been provided:

```http
GET /api
GET /api/categories
GET /api/users
GET /api/users/:username
GET /api/reviews
GET /api/reviews/:review_id
PATCH /api/reviews/:review_id
GET /api/reviews/:review_id/comments
POST /api/reviews/:review_id/comments
PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id
```
