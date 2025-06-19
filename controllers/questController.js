const questModel = require("../models/questModel");

const questController = {
  async getAlunoQuests(req, res) {
    const alunoId = req.user.id;
    const { status } = req.query;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }

    try {
      const quests = await questModel.getQuestsByAluno(alunoId, status);

      if (!quests || quests.length === 0) {
        const statusMessage = status ? ` com status '${status}'` : "";
        return res
          .status(200)
          .json({
            message: `Nenhuma quest encontrada para este aluno${statusMessage}.`,
            quests: [],
          });
      }

      return res.status(200).json({
        message: "Quests recuperadas com sucesso.",
        quests: quests,
      });
    } catch (error) {
      console.error(
        `Erro ao obter quests para o aluno ${alunoId} (status: ${
          status || "todos"
        }):`,
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor ao buscar quests.",
        error: error.message,
      });
    }
  },

  async getQuestDetails(req, res) {
    const alunoId = req.user.id;
    const questId = req.params.id;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }
    if (!questId) {
      return res.status(400).json({ message: "ID da quest é obrigatório." });
    }

    try {
      const quest = await questModel.getQuestById(questId);

      if (!quest) {
        return res.status(404).json({ message: "Quest não encontrada." });
      }

      if (quest.aluno_id !== alunoId) {
        return res
          .status(403)
          .json({
            message:
              "Acesso negado: Esta quest não pertence ao aluno autenticado.",
          });
      }

      return res.status(200).json({
        message: "Detalhes da quest recuperados com sucesso.",
        quest: quest,
      });
    } catch (error) {
      console.error(
        `Erro ao obter detalhes da quest ${questId} para o aluno ${alunoId}:`,
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor ao buscar detalhes da quest.",
        error: error.message,
      });
    }
  },

  async completeQuest(req, res) {
    const alunoId = req.user.id;
    const questId = req.params.id;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }
    if (!questId) {
      return res
        .status(400)
        .json({
          message: "ID da quest é obrigatório para marcar como concluída.",
        });
    }

    try {
      const questExistente = await questModel.getQuestById(questId);

      if (!questExistente) {
        return res.status(404).json({ message: "Quest não encontrada." });
      }
      if (questExistente.aluno_id !== alunoId) {
        return res
          .status(403)
          .json({
            message:
              "Acesso negado: Esta quest não pertence ao aluno autenticado.",
          });
      }

      const updatedQuest = await questModel.updateQuestStatus(
        questId,
        "concluida"
      );

      return res.status(200).json({
        message: "Quest marcada como concluída com sucesso.",
        quest: updatedQuest,
      });
    } catch (error) {
      console.error(
        `Erro ao marcar quest ${questId} como concluída para o aluno ${alunoId}:`,
        error.message
      );
      if (error.message.includes("Status inválido")) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: "Erro interno do servidor ao marcar quest como concluída.",
        error: error.message,
      });
    }
  },

  async createQuest(req, res) {
    try {
      const quest = await questModel.createQuest(req.body);
      res.status(201).json(quest);
    } catch (error) {
      console.error("Erro ao criar quest:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async getQuestById(req, res) {
    try {
      const quest = await questModel.getQuestById(req.params.id);
      if (!quest) {
        return res.status(404).json({ error: "Quest não encontrada" });
      }
      res.json(quest);
    } catch (error) {
      console.error("Erro ao buscar quest:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async getQuestsByAluno(req, res) {
    try {
      const { status } = req.query;
      const quests = await questModel.getQuestsByAluno(
        req.params.alunoId,
        status
      );
      res.json(quests);
    } catch (error) {
      console.error("Erro ao buscar quests do aluno:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async updateQuestStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status é obrigatório" });
      }

      const quest = await questModel.updateQuestStatus(req.params.id, status);
      if (!quest) {
        return res.status(404).json({ error: "Quest não encontrada" });
      }
      res.json(quest);
    } catch (error) {
      console.error("Erro ao atualizar status da quest:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async deleteQuest(req, res) {
    try {
      const deleted = await questModel.deleteQuest(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Quest não encontrada" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar quest:", error);
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = questController;