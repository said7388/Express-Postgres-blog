# Blog Application Backend with PostgreSQL

## Frontend Application

Here you will find the simple frontend application: [https://github.com/said7388/next-blog-app](https://github.com/said7388/next-blog-app)

## Documentation

### Postman

You will find the Postman API's documentation in the following link:
[https://documenter.getpostman.com/view/19954195/2sA2rAyhgB](https://documenter.getpostman.com/view/19954195/2sA2rAyhgB).

In this documentation, you will see the API's payload and response examples.

### DB Diagram

You will find the database diagram design in the following link:
[https://dbdiagram.io/d/Blog-App-65d3128aac844320ae73c436](https://dbdiagram.io/d/Blog-App-65d3128aac844320ae73c436)

## Getting Started

First, Create an `.env` file from `.env.example` and update the environment variables. After successfully creating an account or login update the `JWT_TOKEN` variable for the testing.

```
JWT_SECRTE   =
DB_PORT      =
DB_HOST      =
DB_NAME      =
DB_USER      =
DB_PASS      =
PORT         =
BACKEND_HOST =
JWT_TOKEN    =
```

### Create Database Table

To create all tables in the database run the following command in project root directory.

```bash
node migration/db.ts
```

### Run Project

Install the application dependencies using `npm` or `yarn`:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run server
# or
yarn server
```

## Test the application

After successfully creating an account or login update the `JWT_TOKEN` variable for the testing. Before running the tests you should create data for post, comment, and reaction. Create some data with another user account and use it to run the tests for unauthorised access errors.

Please update variables values in `post.test.ts`, `comment.test.ts` and `reaction.test.ts` file.

```ts
const validPostId = 1; // an existing post
const invalidPostId = 2; // a not existing post
const otherUserPostId = 4; // a post created by another user
const validCommentId = 3; // an existing comment
const invalidCommentId = 5; // a not existing comment
const otherUserCommentId = 4; // a comment created by another user
```

Then, run the following command to test the application:

```bash
npm test
# or
yarn test
```
