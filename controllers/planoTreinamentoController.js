const planosTreinamentoModel = require('../models/planosTreinamentoModel');

const planoTreinamentoController = {
    async getActivePlanos(req, res) {
        const alunoId = req.user.id;

        if (!alunoId) {
            return res.status(401).json({ message: "ID do aluno não encontrado na sessão. Usuário não autenticado." });
        }

        try {
            const planos = await planosTreinamentoModel.getPlanosByAlunoId(alunoId, true); 

            if (!planos || planos.length === 0) {
                return res.status(200).json({ 
                    message: "Nenhum plano de treinamento ativo encontrado para este aluno.", 
                    planos: [] 
                });
            }

            return res.status(200).json(planos);

        } catch (error) {
            console.error(`Erro ao obter planos ativos para o aluno ${alunoId}:`, error.message);
            return res.status(500).json({ 
                message: "Erro interno do servidor ao buscar planos de treinamento.", 
                error: error.message 
            });
        }
    },
    async getPlanoDetails(req, res) {
        const alunoId = req.user.id;
        const planoId = req.params.id;

        if (!alunoId) {
            return res.status(401).json({ message: "ID do aluno não encontrado na sessão. Usuário não autenticado." });
        }
        if (!planoId) {
            return res.status(400).json({ message: "ID do plano de treinamento é obrigatório." });
        }

        try {
            const plano = await planosTreinamentoModel.getPlanoById(planoId);

            if (!plano) {
                return res.status(404).json({ message: "Plano de treinamento não encontrado." });
            }
            if (plano.aluno_id !== alunoId) {
                console.warn(`Tentativa de acesso não autorizado ao plano ${planoId} pelo aluno ${alunoId}.`);
                return res.status(403).json({ message: "Acesso proibido: Este plano de treinamento não pertence ao aluno logado." });
            }

            return res.status(200).json(plano);

        } catch (error) {
            console.error(`Erro ao obter detalhes do plano ${planoId} para o aluno ${alunoId}:`, error.message);
            return res.status(500).json({ 
                message: "Erro interno do servidor ao buscar detalhes do plano.", 
                error: error.message 
            });
        }
    },
};

module.exports = planoTreinamentoController;