const planosTreinamentoModel = require("../models/planosTreinamentoModel");

const planoTreinamentoController = {
  async createPlano(req, res) {
    try {
      const plano = await planosTreinamentoModel.createPlano(req.body);
      res.status(201).json(plano);
    } catch (error) {
      console.error("Erro ao criar plano:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async getPlanoById(req, res) {
    try {
      const plano = await planosTreinamentoModel.getPlanoById(req.params.id);
      if (!plano) {
        return res.status(404).json({ error: "Plano não encontrado" });
      }
      res.json(plano);
    } catch (error) {
      console.error("Erro ao buscar plano:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async getPlanosByAluno(req, res) {
    try {
      const planos = await planosTreinamentoModel.getPlanosByAluno(
        req.params.alunoId
      );
      res.json(planos);
    } catch (error) {
      console.error("Erro ao buscar planos do aluno:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async updatePlano(req, res) {
    try {
      const plano = await planosTreinamentoModel.updatePlano(
        req.params.id,
        req.body
      );
      if (!plano) {
        return res.status(404).json({ error: "Plano não encontrado" });
      }
      res.json(plano);
    } catch (error) {
      console.error("Erro ao atualizar plano:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async deletePlano(req, res) {
    try {
      const deleted = await planosTreinamentoModel.deletePlano(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Plano não encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar plano:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async getActivePlanos(req, res) {
    const alunoId = req.user.id;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }

    try {
      const planos = await planosTreinamentoModel.getPlanosByAluno(alunoId);

      if (!planos || planos.length === 0) {
        return res.status(200).json({
          message:
            "Nenhum plano de treinamento ativo encontrado para este aluno.",
          planos: [],
        });
      }

      return res.status(200).json(planos);
    } catch (error) {
      console.error(
        `Erro ao obter planos ativos para o aluno ${alunoId}:`,
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor ao buscar planos de treinamento.",
        error: error.message,
      });
    }
  },

  async getPlanoDetails(req, res) {
    const alunoId = req.user.id;
    const planoId = req.params.id;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }
    if (!planoId) {
      return res
        .status(400)
        .json({ message: "ID do plano de treinamento é obrigatório." });
    }

    try {
      const plano = await planosTreinamentoModel.getPlanoById(planoId);

      if (!plano) {
        return res
          .status(404)
          .json({ message: "Plano de treinamento não encontrado." });
      }
      if (plano.aluno_id !== alunoId) {
        console.warn(
          `Tentativa de acesso não autorizado ao plano ${planoId} pelo aluno ${alunoId}.`
        );
        return res
          .status(403)
          .json({
            message:
              "Acesso proibido: Este plano de treinamento não pertence ao aluno logado.",
          });
      }

      return res.status(200).json(plano);
    } catch (error) {
      console.error(
        `Erro ao obter detalhes do plano ${planoId} para o aluno ${alunoId}:`,
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor ao buscar detalhes do plano.",
        error: error.message,
      });
    }
  },
};

module.exports = planoTreinamentoController;