const questModel = require('../models/questModel');

const questController = {

    async getAlunoQuests(req, res) {
        const alunoId = req.user.id; 
        const { status } = req.query;

        if (!alunoId) {
            return res.status(401).json({ message: "ID do aluno não encontrado na sessão. Usuário não autenticado." });
        }

        try {
            const quests = await questModel.getQuestsByAlunoId(alunoId, status);

            if (!quests || quests.length === 0) {
                const statusMessage = status ? ` com status '${status}'` : '';
                return res.status(200).json({ message: `Nenhuma quest encontrada para este aluno${statusMessage}.`, quests: [] });
            }

            return res.status(200).json({
                message: "Quests recuperadas com sucesso.",
                quests: quests
            });

        } catch (error) {
            console.error(`Erro ao obter quests para o aluno ${alunoId} (status: ${status || 'todos'}):`, error.message);
            return res.status(500).json({
                message: "Erro interno do servidor ao buscar quests.",
                error: error.message
            });
        }
    },

    async getQuestDetails(req, res) {
        const alunoId = req.user.id;
        const questId = req.params.id;

        if (!alunoId) {
            return res.status(401).json({ message: "ID do aluno não encontrado na sessão. Usuário não autenticado." });
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
                return res.status(403).json({ message: "Acesso negado: Esta quest não pertence ao aluno autenticado." });
            }

            return res.status(200).json({
                message: "Detalhes da quest recuperados com sucesso.",
                quest: quest
            });

        } catch (error) {
            console.error(`Erro ao obter detalhes da quest ${questId} para o aluno ${alunoId}:`, error.message);
            return res.status(500).json({
                message: "Erro interno do servidor ao buscar detalhes da quest.",
                error: error.message
            });
        }
    },

    async completeQuest(req, res) {
        const alunoId = req.user.id;
        const questId = req.params.id;

        if (!alunoId) {
            return res.status(401).json({ message: "ID do aluno não encontrado na sessão. Usuário não autenticado." });
        }
        if (!questId) {
            return res.status(400).json({ message: "ID da quest é obrigatório para marcar como concluída." });
        }

        try {
            const questExistente = await questModel.getQuestById(questId);

            if (!questExistente) {
                return res.status(404).json({ message: "Quest não encontrada." });
            }
            if (questExistente.aluno_id !== alunoId) {
                return res.status(403).json({ message: "Acesso negado: Esta quest não pertence ao aluno autenticado." });
            }

            const updatedQuest = await questModel.updateQuestStatus(questId, 'concluida');

            return res.status(200).json({
                message: "Quest marcada como concluída com sucesso.",
                quest: updatedQuest
            });

        } catch (error) {
            console.error(`Erro ao marcar quest ${questId} como concluída para o aluno ${alunoId}:`, error.message);
            if (error.message.includes('Status inválido')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({
                message: "Erro interno do servidor ao marcar quest como concluída.",
                error: error.message
            });
        }
    },
    async createQuest(req, res) {

        const { aluno_id, titulo, descricao, recompensa, data_inicio, data_fim, status } = req.body;

        if (!titulo || !data_inicio || !aluno_id) {
            return res.status(400).json({ message: "Título, data de início e aluno_id são obrigatórios para criar uma quest." });
        }
        
        try {
            const newQuest = await questModel.createQuest({ 
                aluno_id, titulo, descricao, recompensa, data_inicio, data_fim, status 
            });
            return res.status(201).json({ message: "Quest criada com sucesso.", quest: newQuest });
        } catch (error) {
            console.error('Erro ao criar quest:', error.message);
            return res.status(500).json({ message: "Erro interno do servidor ao criar quest.", error: error.message });
        }
    },

    async updateQuest(req, res) {
        const questId = req.params.id;
        const updates = req.body;

        if (!questId || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "ID da quest e dados de atualização são obrigatórios." });
        }

        const allowedUpdates = ['titulo', 'descricao', 'recompensa', 'data_inicio', 'data_fim', 'status'];
        const filteredUpdates = {};
        for (const key of allowedUpdates) {
            if (updates[key] !== undefined) {
                filteredUpdates[key] = updates[key];
            }
        }
        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({ message: "Nenhum campo permitido para atualização foi fornecido." });
        }

        try {
            const updatedQuest = await questModel.updateQuest(questId, filteredUpdates);
            if (!updatedQuest) {
                return res.status(404).json({ message: "Quest não encontrada para atualização." });
            }
            return res.status(200).json({ message: "Quest atualizada com sucesso.", quest: updatedQuest });
        } catch (error) {
            console.error(`Erro ao atualizar quest ${questId}:`, error.message);
            return res.status(500).json({ message: "Erro interno do servidor ao atualizar quest.", error: error.message });
        }
    },

    async deleteQuest(req, res) {
        const questId = req.params.id;

        if (!questId) {
            return res.status(400).json({ message: "ID da quest é obrigatório para exclusão." });
        }

        try {
            const deleted = await questModel.deleteQuest(questId);
            if (!deleted) {
                return res.status(404).json({ message: "Quest não encontrada para exclusão." });
            }
            return res.status(200).json({ message: "Quest deletada com sucesso." });
        } catch (error) {
            console.error(`Erro ao deletar quest ${questId}:`, error.message);
            return res.status(500).json({ message: "Erro interno do servidor ao deletar quest.", error: error.message });
        }
    }

};

module.exports = questController;