# NC Games: Back-End

Created by Kirsty Richmond

[NC Games: Heroku](https://be-nc-games-app.herokuapp.com/api)
<br/>
[NC Games](https://nc-games-kirsty-richmond.netlify.app)
<br/>
**Download JSON viewer plugin to make the JSON text readable** 

## Description

This is a board game review based API built to imitate a real backend server which will serve the database to the front end architecture of NC Games. The API serves game categories, reviews, users and comments in a JSON format.

Created with:

![image](https://user-images.githubusercontent.com/90627497/158421682-f6d7d6ae-e1eb-4d79-8bc8-0bc83490d113.png)
![image](https://user-images.githubusercontent.com/90627497/158421745-e5543b7a-753d-4464-8667-799d48d0ed38.png)
![image](https://user-images.githubusercontent.com/90627497/158421789-c45f6aaa-995f-4ac0-867d-e9b29b685722.png)

Hosted with:

![image](https://user-images.githubusercontent.com/90627497/158421855-887d123a-7289-4272-a11c-3160d7b122d0.png)

## Installation

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


### Clone repo:

Copy and paste in your terminal:

```
$ git clone https://github.com/kirstyrichmond/be-nc-games.git

$ cd be-nc-games
```

### Install dependencies:

Copy and paste in your terminal:

```
$ npm install
```

### Install dev-dependencies:

```
$ npm i -D jest
$ npm i -D jest-sorted
$ npm i -D supertest
```

## Set Up

### Step 1:

You will need to create two .env files:

- .env.test
- .env.development

### Step 2:

Inside each .env file, you need to add:

```
PGDATABASE=<database_name_here>
```

eg. PGDATABASE=nc_games (development)
eg. PGDATABASE=nc_games_test (test)

Then check that both of the .env files are .gitignored.

### Step 3:

Seed local database:

Inside the db folder, you have been provided with data, a setup.sql file and a seed folder.

Once you have created your .env files, you need to run the scripts provided below to set up the database and seeding run:

```
$ npm run setup-dbs
```

```
$ npm run seed
```

## Testing

Run provided tests:

```
$ npm test
```

Run devlopment environment:

```
$ npm start
```

As the output of this API is in JSON, you can download the following chrome extension to make the JSON text more human-readable.

https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh

## Endpoints

Here is a list of the current endpoints that have been provided:

```
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
