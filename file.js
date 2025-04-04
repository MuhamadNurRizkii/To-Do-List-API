const fs = require("fs");
const DATA_FILE = "./data.json";

// fungsi untuk membaca file
function readFile() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// fungsi untuk menulis/save file
function saveFile(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readFile, saveFile };
