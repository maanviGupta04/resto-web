require('dotenv').config({ path: __dirname + '/.env' });
const app = require("./app");
const multer = require("multer");
const path = require("path");


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

