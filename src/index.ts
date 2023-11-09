import { Hono } from "hono";
import { Database } from "bun:sqlite";
import { cors } from 'hono/cors'

const db = new Database("booksdb.sqlite");
db.exec("PRAGMA journal_mode = WAL;");

db.run(
  "CREATE TABLE IF NOT EXISTS books (id INTEGER name TEXT author TEXT booktype TEXT length INTEGER)"
);


const app = new Hono().basePath("/api/v1");

const port = 3001;

app.use(
  '/api/*',
  cors({
    origin: '*',
    credentials: true,
  })
)

const home = app.get("/", (c) => {
  return c.json({ message: "go finger yourself and sniff!" });
});

app.notFound((c) => {
  return c.text('Lick my ass please daddy :3', 404)
})

app.get(`/books`, (c) => {
  const stmt = db.prepare("SELECT * FROM books");
   // Set HTTP status code
   c.status(200)
  return c.json({
    success: true,
    message: "Hello Hono!",
    books: stmt.all(),
  });
});



app.post(`/book`, async (context) => {
  const { req } = context;
  const body = await req.json();

  const id = crypto.randomUUID()
  const name = body.name;
  const author = body.author;
  const booktype = body.booktype;
  const length = body.length;

  context.status(200)
  const sql = `INSERT INTO books (id, name, author, booktype, length) VALUES (?,?,?,?,?)`;
  const params = [id, name, author, booktype, length];

  db.run(sql, params);

  return context.json({ name, author, booktype, length, id });
});

app.put(`/book/:name`, async (context) => {
  const { req } = context;
  const body = await req.json();

  const id = context.req.param('name')
  const name = body.name;
  const author = body.author;
  const booktype = body.booktype;
  const length = body.length;

  console.log("id: ", id)

  context.status(200)
  const sql ="UPDATE books SET name=?, author=?, booktype=?, length=? WHERE name=?";
  const params = [name, author, booktype, length, id];

  db.run(sql, params);

  return context.text(`You want see of ${name}`)

});


app.get(`/book/:name`, (c) => {
  const name = c.req.param('name')

  const sql = 'SELECT * from books WHERE name=?';
  const stmt = db.prepare(sql)
  return c.json({message : `You searched for this id : ${name}`, user : stmt.all(id)})
})


app.delete(`/book/:name`, (c) => {
  const name = c.req.param('name')
  const sql = 'DELETE FROM books WHERE id = ?'

  const params = [name]
  db.run(sql, params)
  return c.json({message : `You deleted book from this id : ${name}`})
})



console.log(`This app running on https://localhost:${port}`);
export default {
  port,
  fetch: home.fetch,
};
