import express from "express";
import fetch   from "node-fetch";
import path    from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app       = express();
const PORT      = 3000;
const FLASK_URL = process.env.FLASK_URL || "http://backend:5000";

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.post("/submit", async (req, res) => {
  const { name, email } = req.body;

  try {
    const flaskRes = await fetch(`${FLASK_URL}/submit`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email }),
    });

    const data = await flaskRes.json();

    if (flaskRes.ok) {
      
      res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Result</title></head>
        <body>
          <h2>Success</h2>
          <p>${data.message}</p>
          <a href="/">Go back</a>
        </body>
        </html>
      `);
    } else {
      
      res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Error</title></head>
        <body>
          <h2>Error</h2>
          <p>${data.message}</p>
          <a href="/">Go back</a>
        </body>
        </html>
      `);
    }

  } catch (err) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body>
        <h2>Error</h2>
        <p>Could not reach the backend. Is Flask running?</p>
        <a href="/">Go back</a>
      </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`[Express] Running on http://localhost:${PORT}`);
});
