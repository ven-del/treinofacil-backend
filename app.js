const express = require("express");
const app = express();

const publicRoutes = require("./routes/publicRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

// Descomentar a rota depois de criar
// app.use("/api", publicRoutes);
app.use("/api/aluno", alunoRoutes);

app.use((req, res, next) => {
  const error = new Error(`Não encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const URL = 'localhost'
app.listen(PORT, () => {
  console.log(
    `Servidor rodando em http://${URL}:${PORT} no ambiente ${process.env.NODE_ENV}`
  );
});