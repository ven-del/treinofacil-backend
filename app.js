const express = require("express");
const app = express();

const publicRoutes = require("./routes/publicRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/", publicRoutes);
app.use("/app/aluno", alunoRoutes);

app.use((req, res, next) => {
  const error = new Error(`Não encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

const PORT = 3000;
const URL = "localhost";
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://${URL}:${PORT}`);
});
