const errorHandler = (err, req, res, next) => {
  console.error("--- Erro Capturado ---");
  console.error("Caminho da Requisição:", req.path);
  console.error("Método da Requisição:", req.method);
  console.error("Mensagem de Erro:", err.message);
  console.error("Pilha de Erros:", err.stack);
  console.error("--- Fim do Erro ---");

  const statusCode = err.statusCode || 500;

  const errorResponse = {
    status: "error",
    message: err.message || "Ocorreu um erro interno no servidor.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
