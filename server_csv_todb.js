const express = require("express");
const csvParser = require("csv-parser");

const { Pool } = require("pg");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;
const csvFilePath = "./file.csv"; 
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "demo",
  password: "123",
  port: 5432,
});

app.use(express.json());

app.post("/convert-csv", async (req, res) => {
  try {
    const client = await pool.connect();
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        await Promise.all(
          results.map(async (record) => {
            //   console.log(record);
            const firstName = record["name.firstName"]?.trim();
            const lastName = record["name.lastName"]?.trim();
            const age = parseInt(record["age"]?.trim(), 10);
            const address = {
              line1: record["address.line1"]?.trim(),
              line2: record["address.line2"]?.trim(),
              city: record["address.city"]?.trim(),
              state: record["address.state"]?.trim(),
            };
            const additional_info = { gender: record["gender"]?.trim() };

            const name = `${firstName} ${lastName}`;
            const query = `
                INSERT INTO public.users (name, age, address, additional_info) 
                VALUES ($1, $2, $3, $4)
              `;
            await client.query(query, [
              name,
              age,
              JSON.stringify(address),
              JSON.stringify(additional_info),
            ]);
          })
        );
        client.release();
        res.status(200).send("Data uploaded successfully.");
      });
  } catch (error) {
    // error if something went wrong
    console.error("Error:", error);

    res.status(500).send("server error.");
  }
});

app.listen(port, () => {
  console.log(`port ${port}`);
});
