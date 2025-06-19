const express = require("express");
const cors = require("cors");
const publicRoutes = require("./routes/publicRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const professorRoutes = require("./routes/professorRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", publicRoutes);
app.use("/api/aluno", alunoRoutes);
app.use("/api/professor", professorRoutes);

app.use((req, res, next) => {
  const error = new Error(`Não encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

module.exports = app;