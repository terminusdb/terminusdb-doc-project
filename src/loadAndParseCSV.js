const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

// function to load and parse huge CSV files
const readCsv = () => {
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(
      path.resolve(__dirname, "../data", "2017-fCC-New-Coders-Survey-Data.csv")
    )
      .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
      .on("error", reject)
      .on("data", (row) => data.push(row))
      .on("end", () => {
        console.log(`Parsed ${data.length} rows`);
        resolve(data);
      });
  });
}

module.exports = readCsv;
