import { Hono } from "hono";
import { Database } from "bun:sqlite";

const db = new Database("booksdb.sqlite");
db.exec("PRAGMA journal_mode = WAL;");

db.run(
  "CREATE TABLE IF NOT EXISTS books (id INTEGER name TEXT author TEXT booktype TEXT length INTEGER)"
);
// db.run(
//   `INSERT INTO books VALUES (1, 'The Gambler', 'Fyodor Dostoevsky', 'novella', 197)`
// );

const app = new Hono();

const port = 3001;

const home = app.get("/", (c) => {
  return c.json({ message: "go finger yourself and sniff!" });
});

app.get("/api/v1/books", (c) => {
  const stmt = db.prepare("SELECT * FROM books");
  return c.json({
    status: 200,
    success: true,
    message: "Hello Hono!",
    books: stmt.all(),
  });
});

console.log(`This app running on https://localhost:${port}`);
export default {
  port,
  fetch: home.fetch,
};
