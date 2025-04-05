const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const Todo = [
  {
    id: 1,
    name: "belajar coding",
    status: false,
    message: "Tugas belum selesai",
  },
  {
    id: 2,
    name: "belajar fetch API",
    status: true,
    message: "Tugas selesai",
  },
  {
    id: 3,
    name: "baca buku",
    status: false,
    message: "Tugas belum selesai",
  },
];

app.get("/", (req, res) => {
  res.redirect("/todos");
});

// GET -> lihat semua todos
app.get("/todos", (req, res) => {
  res.json(Todo);
});
// POST -> tambah todos
app.post("/todos", (req, res) => {
  const { name, status = false } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nama tugas harus diisi!!" });
  }

  if (status !== undefined && typeof status !== "boolean") {
    return res.status(400).json({ message: "Status harus bernilai boolean!" });
  }

  const newTodo = {
    id: Todo.length > 0 ? Todo[Todo.length - 1].id + 1 : 1,
    name,
    status,
    message: status ? "Tugas selesai" : "Tugas belum selesai",
  };

  Todo.push(newTodo);

  res
    .status(201)
    .json({ message: "Tugas berhasil ditambahkan", data: newTodo });
});
// PUT -> edit todos
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, status, message } = req.body;

  const todo = Todo.find((p) => p.id === id);

  if (!todo) {
    return res.status(400).json({ message: "Tugas tidak ditemukan!" });
  }

  if (typeof status !== "undefined" && typeof status !== "boolean") {
    return res.status(400).json({ message: "Status harus bernilai boolean!" });
  }

  todo.name = name || todo.name;
  todo.status = typeof status === "boolean" ? status : todo.status;
  todo.message = status ? "Tugas selesai" : "Tugas belum selesai";

  res.json({ message: "Tugas berhasil diperbarui", data: todo });
});
// DELETE -> hapus todos
app.delete("/todos/:id", (req, res) => {
  const originalLength = Todo.length;
  const id = parseInt(req.params.id);

  const filteredData = Todo.filter((p) => p.id !== id);

  if (filteredData.length === originalLength) {
    return res.status(404).json({ message: "Tugas tidak ditemukan" });
  }

  res.json({ message: "Tugas berhasil dihapus!", data: filteredData });
});

module.exports = app;
module.exports.handler = serverless(app);

app.listen(port, () => {
  console.log(`server listening on port http://localhost:3000`);
});
