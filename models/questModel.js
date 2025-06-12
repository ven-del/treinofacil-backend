const supabase = require('../config/supabaseClient');

const QUESTS_TABLE = 'quests';

const questModel = {

    async createQuest(questData) {
        if (!questData || !questData.aluno_id || !questData.titulo || !questData.data_inicio) {
            throw new Error("Dados de quest inválidos: aluno_id, titulo e data_inicio são obrigatórios.");
        }
        
        const status = questData.status || 'pendente'; 

        const { data, error } = await supabase
            .from(QUESTS_TABLE)
            .insert({
                aluno_id: questData.aluno_id,
                titulo: questData.titulo,
                descricao: questData.descricao || null,
                recompensa: questData.recompensa || null,
                data_inicio: questData.data_inicio,
                data_fim: questData.data_fim || null,
                status: status
            })
            .select() 
            .single();

        if (error) {
            console.error('Erro ao criar quest:', error.message);
            throw new Error(`Não foi possível criar a quest: ${error.message}`);
        }
        return data;
    },

    async getQuestById(questId) {
        if (!questId) {
            throw new Error("ID da quest é obrigatório para busca.");
        }
        const { data, error } = await supabase
            .from(QUESTS_TABLE)
            .select('*')
            .eq('id', questId)
            .single();

        if (error && error.code !== 'PGRST116') { 
            console.error('Erro ao buscar quest por ID:', error.message);
            throw new Error(`Erro ao buscar quest: ${error.message}`);
        }
        return data; 
    },

    async getQuestsByAlunoId(alunoId, status = null) {
        if (!alunoId) {
            throw new Error("ID do aluno é obrigatório para buscar quests.");
        }
        
        let query = supabase
            .from(QUESTS_TABLE)
            .select('*')
            .eq('aluno_id', alunoId);
        
        if (status) {
             query = query.eq('status', status);
        }

        query = query.order('data_inicio', { ascending: true });

        const { data, error } = await query;

        if (error) {
            console.error('Erro ao buscar quests por aluno ID:', error.message);
            throw new Error(`Não foi possível buscar quests para o aluno: ${error.message}`);
        }
        return data;
    },

    async updateQuest(questId, updates) {
        if (!questId || !updates) {
            throw new Error("ID da quest e dados de atualização são obrigatórios.");
        }
        const { data, error } = await supabase
            .from(QUESTS_TABLE)
            .update(updates)
            .eq('id', questId)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar quest:', error.message);
            throw new Error(`Não foi possível atualizar a quest: ${error.message}`);
        }
        return data;
    },

    async updateQuestStatus(questId, newStatus) {
        if (!questId || !newStatus) {
            throw new Error("ID da quest e novo status são obrigatórios.");
        }
        
        const allowedStatuses = ['pendente', 'em_progresso', 'concluida', 'cancelada'];
        if (!allowedStatuses.includes(newStatus)) {
            throw new Error(`Status inválido: '${newStatus}'. Status permitidos são: ${allowedStatuses.join(', ')}.`);
        }

        const { data, error } = await supabase
            .from(QUESTS_TABLE)
            .update({ status: newStatus })
            .eq('id', questId)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar status da quest:', error.message);
            throw new Error(`Não foi possível atualizar o status da quest: ${error.message}`);
        }
        return data;
    },

    async deleteQuest(questId) {
        if (!questId) {
            throw new Error("ID da quest é obrigatório para exclusão.");
        }
        const { error, count } = await supabase
            .from(QUESTS_TABLE)
            .delete()
            .eq('id', questId)
            .select('*', { count: 'exact' }); 

        if (error) {
            console.error('Erro ao deletar quest:', error.message);
            throw new Error(`Não foi possível deletar a quest: ${error.message}`);
        }
        return count > 0;
    }
};

module.exports = questModel;