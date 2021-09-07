const { WOQLClient } = require("@terminusdb/terminusdb-client");

const server = "http://localhost:6363";

const client = new WOQLClient(server, {
  user: "admin",
  organization: "admin",
  key: "root",
});


const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to database...")
    return client;
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
