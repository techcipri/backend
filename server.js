const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 CONFIGURE COM OS DADOS DO EASYPANEL
const pool = new Pool({
  host: "SEU_HOST",
  user: "SEU_USER",
  password: "SUA_SENHA",
  database: "SEU_DB",
  port: 5432,
});

// TESTE
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// LISTAR
app.get("/alunos", async (req, res) => {
  const result = await pool.query("SELECT * FROM alunos ORDER BY id DESC");
  res.json(result.rows);
});

// CRIAR
app.post("/alunos", async (req, res) => {
  const { nome, responsavel, perua, valor } = req.body;

  const result = await pool.query(
    "INSERT INTO alunos (nome, responsavel, perua, valor, pago) VALUES ($1,$2,$3,$4,false) RETURNING *",
    [nome, responsavel, perua, valor]
  );

  res.json(result.rows[0]);
});

// EDITAR
app.put("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, responsavel, perua, valor } = req.body;

  const result = await pool.query(
    "UPDATE alunos SET nome=$1, responsavel=$2, perua=$3, valor=$4 WHERE id=$5 RETURNING *",
    [nome, responsavel, perua, valor, id]
  );

  res.json(result.rows[0]);
});

// PAGAR
app.put("/alunos/:id/pagar", async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE alunos SET pago = NOT pago WHERE id=$1",
    [id]
  );

  res.sendStatus(200);
});

// DELETE
app.delete("/alunos/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM alunos WHERE id=$1", [id]);

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
