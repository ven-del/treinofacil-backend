const exerciciosDiaModel = require("../models/exerciciosDiaModel");

const exerciciosDiaController = {

  async getExerciciosDoDia(req, res) {
    try {
      const { aluno_id } = req.params;
      const { data } = req.query; 

      if (!aluno_id) {
        return res.status(400).json({
          success: false,
          message: "ID do aluno é obrigatório",
        });
      }

      const exercicios = await exerciciosDiaModel.getExerciciosDoDia(
        aluno_id,
        data
      );

      return res.status(200).json({
        success: true,
        message: "Exercícios do dia recuperados com sucesso",
        data: {
          data_consulta: data || new Date().toISOString().split("T")[0],
          total_exercicios: exercicios.length,
          exercicios: exercicios,
        },
      });
    } catch (error) {
      console.error("Erro no controller getExerciciosDoDia:", error.message);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  },

  async getDetalheExercicio(req, res) {
    try {
      const { treino_exercicio_id } = req.params;

      if (!treino_exercicio_id) {
        return res.status(400).json({
          success: false,
          message: "ID do treino exercício é obrigatório",
        });
      }

      const detalhe = await exerciciosDiaModel.getDetalheExercicio(
        treino_exercicio_id
      );

      if (!detalhe) {
        return res.status(404).json({
          success: false,
          message: "Exercício não encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Detalhes do exercício recuperados com sucesso",
        data: detalhe,
      });
    } catch (error) {
      console.error("Erro no controller getDetalheExercicio:", error.message);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  },

  async atualizarCargaAtual(req, res) {
    try {
      const { treino_exercicio_id } = req.params;
      const { carga_atual } = req.body;

      if (!treino_exercicio_id) {
        return res.status(400).json({
          success: false,
          message: "ID do treino exercício é obrigatório",
        });
      }

      if (carga_atual === undefined || carga_atual < 0) {
        return res.status(400).json({
          success: false,
          message: "Carga atual deve ser um número válido e não negativo",
        });
      }

      const exercicioAtualizado = await exerciciosDiaModel.atualizarCargaAtual(
        treino_exercicio_id,
        carga_atual
      );

      return res.status(200).json({
        success: true,
        message: "Carga atual atualizada com sucesso",
        data: exercicioAtualizado,
      });
    } catch (error) {
      console.error("Erro no controller atualizarCargaAtual:", error.message);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  },

  async adicionarObservacoesAluno(req, res) {
    try {
      const { treino_exercicio_id } = req.params;
      const { observacoes } = req.body;

      if (!treino_exercicio_id) {
        return res.status(400).json({
          success: false,
          message: "ID do treino exercício é obrigatório",
        });
      }

      if (!observacoes || observacoes.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Observações não podem estar vazias",
        });
      }

      const exercicioAtualizado =
        await exerciciosDiaModel.adicionarObservacoesAluno(
          treino_exercicio_id,
          observacoes.trim()
        );

      return res.status(200).json({
        success: true,
        message: "Observações adicionadas com sucesso",
        data: exercicioAtualizado,
      });
    } catch (error) {
      console.error(
        "Erro no controller adicionarObservacoesAluno:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  },

  async getExerciciosPorPeriodo(req, res) {
    try {
      const { aluno_id } = req.params;
      const { data_inicio, data_fim } = req.query;

      if (!aluno_id) {
        return res.status(400).json({
          success: false,
          message: "ID do aluno é obrigatório",
        });
      }

      if (!data_inicio || !data_fim) {
        return res.status(400).json({
          success: false,
          message: "Data de início e data de fim são obrigatórias",
        });
      }

      const exerciciosPorPeriodo = [];
      const dataAtual = new Date(data_inicio);
      const dataFinal = new Date(data_fim);

      while (dataAtual <= dataFinal) {
        const dataFormatada = dataAtual.toISOString().split("T")[0];
        const exerciciosDoDia = await exerciciosDiaModel.getExerciciosDoDia(
          aluno_id,
          dataFormatada
        );

        if (exerciciosDoDia.length > 0) {
          exerciciosPorPeriodo.push({
            data: dataFormatada,
            exercicios: exerciciosDoDia,
          });
        }

        dataAtual.setDate(dataAtual.getDate() + 1);
      }

      return res.status(200).json({
        success: true,
        message: "Exercícios do período recuperados com sucesso",
        data: {
          periodo: {
            data_inicio,
            data_fim,
          },
          total_dias_com_exercicios: exerciciosPorPeriodo.length,
          exercicios_por_dia: exerciciosPorPeriodo,
        },
      });
    } catch (error) {
      console.error(
        "Erro no controller getExerciciosPorPeriodo:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  },
};

module.exports = exerciciosDiaController;