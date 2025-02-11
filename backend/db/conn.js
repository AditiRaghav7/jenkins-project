const mysql = require("mysql2");

const dbConfig = {
  host: "ip-51-20-129-186",
  user: "root",
  password: "Aditi@1122",
  port: "3306",
  database: "employees_db"
};

function connectWithRetry() {
  const connection = mysql.createConnection(dbConfig);

  connection.connect(error => {
    if (error) {
      console.error("Database connection failed. Retrying in 5 seconds...", error);
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    } else {
      console.log("Successfully connected to the MYSQL database.");
    }
  });

  module.exports = connection;
}

connectWithRetry();
