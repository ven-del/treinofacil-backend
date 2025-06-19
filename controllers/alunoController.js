const userModel = require("../models/userModel");

const supabase = require("../config/supabaseClient");

const alunoController = {
  async getProfile(req, res) {
    const alunoId = req.user.id;

    if (!alunoId) {
      return res.status(401).json({
        message:
          "ID do aluno não encontrado na sessão. Usuário não autenticado ou token inválido.",
      });
    }

    try {
      const aluno = await userModel.findUserById(alunoId);

      if (!aluno) {
        return res
          .status(404)
          .json({ message: "Dados do aluno não encontrados." });
      }
      const { senha, ...alunoData } = aluno;

      return res.status(200).json(alunoData);
    } catch (error) {
      console.error(`Erro ao obter perfil do aluno ${alunoId}:`, error.message);
      return res.status(500).json({
        message: "Erro interno do servidor ao buscar perfil.",
        error: error.message,
      });
    }
  },
  async updateProfile(req, res) {
    const alunoId = req.user.id;
    const updates = req.body;

    if (!alunoId) {
      return res.status(401).json({
        message:
          "ID do aluno não encontrado na sessão. Usuário não autenticado ou token inválido.",
      });
    }

    const forbiddenUpdates = ["id", "email", "tipo", "criado_em", "senha"];
    forbiddenUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        delete updates[field];
        console.warn(
          `Tentativa de atualizar campo proibido '${field}' para o aluno ${alunoId}. Ignorado.`
        );
      }
    });

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "Nenhum dado válido para atualização fornecido." });
    }

    try {
      const updatedAluno = await userModel.updateUser(alunoId, updates);

      if (!updatedAluno) {
        return res.status(404).json({
          message: "Perfil do aluno não encontrado para atualização.",
        });
      }

      const { senha, ...alunoData } = updatedAluno;
      return res.status(200).json({
        message: "Perfil atualizado com sucesso.",
        aluno: alunoData,
      });
    } catch (error) {
      console.error(
        `Erro ao atualizar perfil do aluno ${alunoId}:`,
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor ao atualizar perfil.",
        error: error.message,
      });
    }
  },

  async changePassword(req, res) {
    const { newPassword } = req.body;
    const accessToken = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!newPassword) {
      return res.status(400).json({ message: "Nova senha é obrigatória." });
    }
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Token de acesso não fornecido." });
    }

    try {
      const { data, error } = await supabase.auth.updateUser(
        {
          password: newPassword,
        },
        {}
      );

      if (error) {
        console.error("Erro ao mudar senha do aluno:", error.message);
        return res.status(400).json({
          message: "Não foi possível mudar a senha.",
          error: error.message,
        });
      }

      return res.status(200).json({ message: "Senha alterada com sucesso." });
    } catch (error) {
      console.error(`Erro interno ao mudar senha do aluno:`, error.message);
      return res.status(500).json({
        message: "Erro interno do servidor ao mudar senha.",
        error: error.message,
      });
    }
  },
};

module.exports = alunoController;