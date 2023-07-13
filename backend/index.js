import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "4wFoQ6",
  database: "test",
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

app.post("/books", (req, res) => {
  const { title, desc, price, cover } = req.body;

  // Check if the price value is provided
  if (!price) {
    return res.status(400).json({ error: "Price is required" });
  }

  const q =
    "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?, ?, ?, ?)";
  const values = [title, desc, price, cover];

  db.query(q, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(result);
  });
});

//endpoint to delete a book
app.delete("/books/:id", (req, res) => {
  const q = "DELETE FROM books WHERE id = ?";
  const id = req.params.id;
  db.query(q, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    return res.json("Book deleted successfully");
  });
});

//endput for updating a book
app.put("/books/:id", (req, res) => {
  const { title, desc, price, cover } = req.body;
  const id = req.params.id;
  const q =
    "UPDATE books SET title = ?, `desc` = ?, price = ?, cover = ? WHERE id = ?";
  const values = [title, desc, price, cover, id];
  db.query(q, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    return res.json("Book updated successfully");
  });
});

app.listen(8800, () => {
  console.log("Backend server is running!");
});
