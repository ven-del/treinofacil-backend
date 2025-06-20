const path = require("path");
const express = require("express");
const cors = require("cors");
const publicRoutes = require("../routes/publicRoutes");
const alunoRoutes = require("../routes/alunoRoutes");
const professorRoutes = require("../routes/professorRoutes");
const errorHandler = require("../middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local
      "https://labce-treinofacil-backend.vercel.app", // Produção
      "http://localhost:5173", // Vite
      "https://labce-treinofacil.vercel.app", // Front Produção
    ],
    credentials: true,
  })
);
app.use(express.json());

const swaggerDocument = YAML.load(
  path.resolve(process.cwd(), "dist", "swagger.yaml")
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  return res.json("Olá, mundo!");
});
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
