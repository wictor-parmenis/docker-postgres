// Import the postgres client
const { Client } = require("pg");
const express = require("express");
const app = express();
const port = 8080;

// Connect to our postgres database
// These values like `root` and `postgres` will be
// defined in our `docker-compose-yml` file
const client = new Client({
  password: "root",
  user: "root",
  host: "postgres",
});

// Serves a folder called `public` that we will create
app.use(express.static("public"));

// When a GET request is made to /employees
// Our app will return an array with a list of all
// employees including name and title
// this data is defined in our `database-seed.sql` file
app.get("/employees", async (req, res) => {
  const results = await client
    .query("SELECT * FROM employees")
    .then((payload) => {
      return payload.rows;
    })
    .catch(() => {
      throw new Error("Query failed");
    });
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(JSON.stringify(results));
});

// Our app must connect to the database before it starts, so
// we wrap this in an IIFE (Google it) so that we can wait
// asynchronously for the database connection to establish before listening
(async () => {
  await client.connect();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();

// const myPromise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("foo");
//   }, 300);
//   reject("oops");
// });

// myPromise.then(() => {
//   console.log("hello");
// });
