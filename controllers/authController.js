const supabase = require("../config/supabaseClient");

const userModel = require("../models/userModel");

const authController = {
  async registerUser(req, res) {
    const { email, password, nome, tipo } = req.body;

    console.log("[REGISTER] Tentando registrar:", email);
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios para o registro." });
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      console.log("[REGISTER] Resposta do Supabase:", { authData, authError });

      if (authError) {
        console.error(
          "[REGISTER] Erro de registro no Supabase Auth:",
          authError.message
        );
        return res.status(400).json({
          message: "Falha no registro.",
          error: authError.message,
        });
      }

      if (!authData.user) {
        console.log(
          "[REGISTER] authData.user está vazio ou indefinido:",
          authData.user
        );
        return res.status(202).json({
          message:
            "Registro bem-sucedido. Verifique seu email para confirmar a conta.",
          user: authData.user || null,
        });
      }

      const newUserData = {
        id: authData.user.id,
        nome: nome,
        email: email,
        tipo: tipo || "aluno",
      };
      console.log(
        "[REGISTER] Tentando criar usuário na tabela usuarios:",
        newUserData
      );

      try {
        const newUserInDB = await userModel.createUser(newUserData);
        console.log(
          "[REGISTER] Usuário criado na tabela usuarios:",
          newUserInDB
        );

        return res.status(201).json({
          message: "Usuário registrado e logado com sucesso.",
          session: authData.session,
          user: newUserInDB,
        });
      } catch (dbError) {
        console.error("[REGISTER] Erro ao criar usuário na tabela:", dbError);
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
          console.log("[REGISTER] Registro no Auth revertido com sucesso");
        } catch (revertError) {
          console.error(
            "[REGISTER] Erro ao reverter registro no Auth:",
            revertError
          );
        }
        return res.status(500).json({
          message: "Erro ao criar usuário no banco de dados.",
          error: dbError.message,
        });
      }
    } catch (error) {
      console.error(
        "[REGISTER] Erro interno no registro de usuário:",
        error.message,
        error
      );
      return res.status(500).json({
        message: "Erro interno do servidor durante o registro.",
        error: error.message,
      });
    }
  },

  async loginUser(req, res) {
    const { email, password } = req.body;

    console.log("[LOGIN] Tentando login:", email);
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios para o login." });
    }

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

      console.log("[LOGIN] Resposta do Supabase:", { authData, authError });

      if (authError) {
        console.error(
          "[LOGIN] Erro de login no Supabase Auth:",
          authError.message
        );
        return res.status(401).json({
          message: "Falha no login.",
          error: authError.message,
        });
      }

      try {
        const userInDB = await userModel.findUserById(authData.user.id);
        console.log("[LOGIN] Usuário encontrado na tabela usuarios:", userInDB);

        if (!userInDB) {
          console.error(
            "[LOGIN] Usuário não encontrado na tabela usuarios:",
            authData.user.id
          );
          return res.status(401).json({
            message: "Usuário não encontrado no banco de dados.",
          });
        }

        return res.status(200).json({
          message: "Login bem-sucedido.",
          session: authData.session,
          ...userInDB,
        });
      } catch (dbError) {
        console.error("[LOGIN] Erro ao buscar usuário na tabela:", dbError);
        return res.status(500).json({
          message: "Erro ao buscar dados do usuário.",
          error: dbError.message,
        });
      }
    } catch (error) {
      console.error("[LOGIN] Erro interno no login de usuário:", error.message);
      return res.status(500).json({
        message: "Erro interno do servidor durante o login.",
        error: error.message,
      });
    }
  },

  async logoutUser(req, res) {
    console.log("[LOGOUT] Tentando logout");
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(
          "[LOGOUT] Erro ao fazer logout no Supabase Auth:",
          error.message
        );
        return res.status(500).json({
          message: "Falha ao fazer logout.",
          error: error.message,
        });
      }

      return res.status(200).json({ message: "Logout bem-sucedido." });
    } catch (error) {
      console.error(
        "[LOGOUT] Erro interno no logout de usuário:",
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor durante o logout.",
        error: error.message,
      });
    }
  },

  async resetPassword(req, res) {
    const { email } = req.body;

    console.log("[RESET_PASSWORD] Tentando resetar senha:", email);
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email é obrigatório para redefinir a senha." });
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {});

      if (error) {
        console.error(
          "[RESET_PASSWORD] Erro ao iniciar redefinição de senha:",
          error.message
        );
        return res.status(500).json({
          message:
            "Não foi possível iniciar o processo de redefinição de senha.",
          error: error.message,
        });
      }

      return res.status(200).json({
        message: "Um link para redefinir sua senha foi enviado para seu email.",
      });
    } catch (error) {
      console.error(
        "[RESET_PASSWORD] Erro interno na redefinição de senha:",
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor durante a redefinição de senha.",
        error: error.message,
      });
    }
  },

  async confirmEmail(req, res) {
    const { token_hash, type } = req.body;

    console.log("[CONFIRM_EMAIL] Tentando confirmar email:", {
      token_hash,
      type,
    });
    if (!token_hash || !type) {
      return res
        .status(400)
        .json({ message: "Token e tipo de confirmação são obrigatórios." });
    }

    try {
      const { data: authData, error: authError } =
        await supabase.auth.verifyOtp({
          token_hash: token_hash,
          type: type,
        });

      if (authError) {
        console.error(
          "[CONFIRM_EMAIL] Erro ao confirmar email:",
          authError.message
        );
        return res.status(400).json({
          message: "Falha ao confirmar email.",
          error: authError.message,
        });
      }

      return res.status(200).json({
        message: "Email confirmado com sucesso.",
        user: authData.user,
      });
    } catch (error) {
      console.error(
        "[CONFIRM_EMAIL] Erro interno na confirmação de email:",
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor durante a confirmação de email.",
        error: error.message,
      });
    }
  },
};

module.exports = authController;