const planosTreinamentoModel = require("../models/planosTreinamentoModel");

const planoTreinamentoController = {
  async getActivePlanos(req, res) {
    const alunoId = req.user.id;

    if (!alunoId) {
      return res.status(401).json({
        success: false,
        message:
          "ID do aluno não encontrado na sessão. Usuário não autenticado.",
      });
    }

    try {
      const planos = await planosTreinamentoModel.getPlanosByAlunoId(
        alunoId,
        true
      );

      if (!planos || planos.length === 0) {
        return res.status(200).json({
          success: true,
          message:
            "Nenhum plano de treinamento ativo encontrado para este aluno.",
          data: {
            planos: [],
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Planos de treinamento ativos recuperados com sucesso",
        data: {
          total_planos: planos.length,
          planos: planos,
        },
      });
    } catch (error) {
      console.error(
        `Erro ao obter planos ativos para o aluno ${alunoId}:`,
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor ao buscar planos de treinamento.",
        error: error.message,
      });
    }
  },

  async getPlanoDetails(req, res) {
    const alunoId = req.user.id;
    const planoId = req.params.id;

    if (!alunoId) {
      return res.status(401).json({
        success: false,
        message:
          "ID do aluno não encontrado na sessão. Usuário não autenticado.",
      });
    }
    if (!planoId) {
      return res.status(400).json({
        success: false,
        message: "ID do plano de treinamento é obrigatório.",
      });
    }

    try {
      const plano = await planosTreinamentoModel.getPlanoById(planoId);

      if (!plano) {
        return res.status(404).json({
          success: false,
          message: "Plano de treinamento não encontrado.",
        });
      }
      if (plano.aluno_id !== alunoId) {
        console.warn(
          `Tentativa de acesso não autorizado ao plano ${planoId} pelo aluno ${alunoId}.`
        );
        return res.status(403).json({
          success: false,
          message:
            "Acesso proibido: Este plano de treinamento não pertence ao aluno logado.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Detalhes do plano de treinamento recuperados com sucesso",
        data: plano,
      });
    } catch (error) {
      console.error(
        `Erro ao obter detalhes do plano ${planoId} para o aluno ${alunoId}:`,
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor ao buscar detalhes do plano.",
        error: error.message,
      });
    }
  },

  /**
   * Busca plano de treinamento atribuído ao usuário (sem necessidade de ID específico)
   */
  async getPlanoAtribuido(req, res) {
    const alunoId = req.user.id;

    if (!alunoId) {
      return res.status(401).json({
        success: false,
        message:
          "ID do aluno não encontrado na sessão. Usuário não autenticado.",
      });
    }

    try {
      const planos = await planosTreinamentoModel.getPlanosByAlunoId(
        alunoId,
        true
      );

      if (!planos || planos.length === 0) {
        return res.status(200).json({
          success: true,
          message:
            "Nenhum plano de treinamento ativo encontrado para este aluno.",
          data: null,
        });
      }

      // Retorna o primeiro plano ativo (assumindo que um aluno tem apenas um plano ativo por vez)
      const planoAtivo = planos[0];

      return res.status(200).json({
        success: true,
        message: "Plano de treinamento atribuído recuperado com sucesso",
        data: planoAtivo,
      });
    } catch (error) {
      console.error(
        `Erro ao obter plano atribuído para o aluno ${alunoId}:`,
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor ao buscar plano atribuído.",
        error: error.message,
      });
    }
  },
};

module.exports = planoTreinamentoController;