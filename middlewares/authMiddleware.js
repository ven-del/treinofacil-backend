const supabase = require("../config/supabaseClient");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .json({ message: "Acesso não autorizado: Token não fornecido." });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Erro de autenticação Supabase:", error.message);
      if (error.status === 401) {
        return res
          .status(401)
          .json({
            message: "Token inválido ou expirado.",
            error: error.message,
          });
      }
      return res
        .status(500)
        .json({
          message: "Erro de autenticação interna.",
          error: error.message,
        });
    }

    if (!user) {
      return res
        .status(401)
        .json({
          message:
            "Acesso não autorizado: Token inválido ou usuário não encontrado.",
        });
    }

    req.user = {
      id: user.id, 
      email: user.email,
    };
    next();
  } catch (error) {
    console.error("Erro inesperado no middleware de autenticação:", error);
    return res.status(500).json({
      message: "Erro interno do servidor durante a autenticação.",
      error: error.message,
    });
  }
};

module.exports = authenticateToken;