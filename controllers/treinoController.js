const treinoModel = require("../models/treinoModel");
const treinoExercicioModel = require("../models/treinoExercicioModel");
const exercicioModel = require("../models/exercicioModel");
const planoTreinamentoModel = require("../models/planoTreinamentoModel");

const treinoController = {
  async getTreinoDetails(req, res) {
    const alunoId = req.user.id;
    const treinoId = req.params.id;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }
    if (!treinoId) {
      return res.status(400).json({ message: "ID do treino é obrigatório." });
    }

    try {
      const treino = await treinoModel.getTreinoById(treinoId);

      if (!treino) {
        return res.status(404).json({ message: "Treino não encontrado." });
      }
      if (treino.plano_id) {
        const plano = await planoTreinamentoModel.getPlanoById(treino.plano_id);
        if (!plano || plano.aluno_id !== alunoId) {
          return res
            .status(403)
            .json({
              message:
                "Acesso negado: Este treino não pertence aos seus planos.",
            });
        }
      }
      const exerciciosDoTreino =
        await treinoExercicioModel.getExerciciosDoTreino(treinoId);

      const detalhesCompletosDosExercicios = await Promise.all(
        exerciciosDoTreino.map(async (te) => {
          const exercicioDetalhes = await exercicioModel.getExercicioById(
            te.exercicio_id
          );
          return {
            ...te,
            exercicio: exercicioDetalhes,
          };
        })
      );
      const treinoCompleto = {
        ...treino,
        exercicios: detalhesCompletosDosExercicios,
      };

      return res.status(200).json({
        message: "Detalhes do treino recuperados com sucesso.",
        treino: treinoCompleto,
      });
    } catch (error) {
      console.error(
        `Erro ao obter detalhes do treino ${treinoId} para o aluno ${alunoId}:`,
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor ao buscar detalhes do treino.",
        error: error.message,
      });
    }
  },

  async getExerciciosByGrupo(req, res) {
    const alunoId = req.user.id;
    const { grupoMuscular } = req.query;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }

    try {
      let exercicios;
      if (grupoMuscular) {
        exercicios = await exercicioModel.getExerciciosByGrupoMuscular(
          grupoMuscular
        );
      } else {
        exercicios = await exercicioModel.getAllExercicios();
      }

      if (!exercicios || exercicios.length === 0) {
        return res
          .status(200)
          .json({ message: "Nenhum exercício encontrado.", exercicios: [] });
      }

      return res.status(200).json({
        message: "Exercícios recuperados com sucesso.",
        exercicios: exercicios,
      });
    } catch (error) {
      console.error(
        `Erro ao obter exercícios para o aluno ${alunoId} (grupo: ${
          grupoMuscular || "todos"
        }):`,
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor ao buscar exercícios.",
        error: error.message,
      });
    }
  },

  async createTreino(req, res) {
    const { nome, descricao, plano_id, exercicios } = req.body;
    if (!nome) {
      return res.status(400).json({ message: "Nome do treino é obrigatório." });
    }

    try {
      const newTreino = await treinoModel.createTreino({
        nome,
        descricao,
        plano_id,
      });

      if (exercicios && exercicios.length > 0) {
        const exerciciosAdicionados = await Promise.all(
          exercicios.map(async (ex) => {
            const existingExercicio = await exercicioModel.getExercicioById(
              ex.id
            );
            if (!existingExercicio) {
              console.warn(
                `Exercício com ID ${ex.id} não encontrado. Será ignorado ou tratado como erro.`
              );
              throw new Error(`Exercício com ID ${ex.id} não encontrado.`);
            }
            return await treinoExercicioModel.addExercicioToTreino(
              newTreino.id,
              ex.id,
              ex.ordem,
              ex.series,
              ex.repeticoes,
              ex.carga,
              ex.observacoes_professor
            );
          })
        );
        newTreino.exercicios_adicionados = exerciciosAdicionados;
      }

      return res.status(201).json({
        message: "Treino criado com sucesso.",
        treino: newTreino,
      });
    } catch (error) {
      console.error("Erro ao criar treino:", error.message);
      return res.status(500).json({
        message: "Erro interno do servidor ao criar treino.",
        error: error.message,
      });
    }
  },
};

module.exports = treinoController;