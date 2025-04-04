const express = require("express");
const fs = require("fs");
const { readFile, saveFile } = require("./file.js");
const app = express();
const port = 3000;

app.use(express.json());

// GET -> lihat semua todos
app.get("/todos", (req, res) => {
  const data = readFile();

  res.json(data);
});
// POST -> tambah todos
app.post("/todos", (req, res) => {
  const data = readFile();
  const { name, status = false } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nama tugas harus diisi!!" });
  }

  if (status !== undefined && typeof status !== "boolean") {
    return res.status(400).json({ message: "Status harus bernilai boolean!" });
  }

  const newTodo = {
    id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
    name,
    status,
    message: status ? "Tugas selesai" : "Tugas belum selesai",
  };

  data.push(newTodo);
  saveFile(data);

  res
    .status(201)
    .json({ message: "Tugas berhasil ditambahkan", data: newTodo });
});
// PUT -> edit todos
app.put("/todos/:id", (req, res) => {
  const data = readFile();
  const id = parseInt(req.params.id);
  const { name, status, message } = req.body;

  const todo = data.find((p) => p.id === id);

  if (!todo) {
    return res.status(400).json({ message: "Tugas tidak ditemukan!" });
  }

  if (typeof status !== "undefined" && typeof status !== "boolean") {
    return res.status(400).json({ message: "Status harus bernilai boolean!" });
  }

  todo.name = name || todo.name;
  todo.status = typeof status === "boolean" ? status : todo.status;
  todo.message = status ? "Tugas selesai" : "Tugas belum selesai";

  saveFile(data);

  res.json({ message: "Tugas berhasil diperbarui", data: todo });
});
// DELETE -> hapus todos
app.delete("/todos/:id", (req, res) => {
  let data = readFile();
  const originalLength = data.length;
  const id = parseInt(req.params.id);

  const filteredData = data.filter((p) => p.id !== id);

  if (filteredData.length === originalLength) {
    return res.status(404).json({ message: "Tugas tidak ditemukan" });
  }

  saveFile(filteredData);

  res.json({ message: "Tugas berhasil dihapus!", data: filteredData });
});

app.listen(port, () => {
  console.log(`server listening on port http://localhost:3000`);
});
