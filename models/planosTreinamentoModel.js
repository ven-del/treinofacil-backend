const supabase = require('../config/supabaseClient');

const PLANOS_TREINAMENTO_TABLE = 'planos_treinamento';

const planoTreinamentoModel = {
    async createPlano(planoData) {
        if (!planoData || !planoData.aluno_id || !planoData.nome || !planoData.data_inicio) {
            throw new Error("Dados de plano inválidos: aluno_id, nome e data_inicio são obrigatórios.");
        }

        const { data, error } = await supabase
            .from(PLANOS_TREINAMENTO_TABLE)
            .insert({
                aluno_id: planoData.aluno_id,
                nome: planoData.nome,
                descricao: planoData.descricao || null,
                data_inicio: planoData.data_inicio,
                data_fim: planoData.data_fim || null,
                ativo: planoData.ativo !== undefined ? planoData.ativo : true
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar plano de treinamento:', error.message);
            throw new Error(`Não foi possível criar o plano de treinamento: ${error.message}`);
        }
        return data;
    },
    async getPlanoById(planoId) {
        if (!planoId) {
            throw new Error("ID do plano é obrigatório para busca.");
        }
        const { data, error } = await supabase
            .from(PLANOS_TREINAMENTO_TABLE)
            .select('*')
            .eq('id', planoId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar plano por ID:', error.message);
            throw new Error(`Erro ao buscar plano: ${error.message}`);
        }
        return data;
    },

    async getPlanosByAlunoId(alunoId, ativo = true) {
        if (!alunoId) {
            throw new Error("ID do aluno é obrigatório para buscar planos.");
        }
        
        let query = supabase
            .from(PLANOS_TREINAMENTO_TABLE)
            .select('*')
            .eq('aluno_id', alunoId);
        
        if (ativo !== undefined) {
             query = query.eq('ativo', ativo);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Erro ao buscar planos por aluno ID:', error.message);
            throw new Error(`Não foi possível buscar planos para o aluno: ${error.message}`);
        }
        return data;
    },

    async updatePlano(planoId, updates) {
        if (!planoId || !updates) {
            throw new Error("ID do plano e dados de atualização são obrigatórios.");
        }
        const { data, error } = await supabase
            .from(PLANOS_TREINAMENTO_TABLE)
            .update(updates)
            .eq('id', planoId)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar plano de treinamento:', error.message);
            throw new Error(`Não foi possível atualizar o plano de treinamento: ${error.message}`);
        }
        return data;
    },

    async deletePlano(planoId) {
        if (!planoId) {
            throw new Error("ID do plano é obrigatório para exclusão.");
        }
        const { error, count } = await supabase
            .from(PLANOS_TREINAMENTO_TABLE)
            .delete()
            .eq('id', planoId)
            .select('*', { count: 'exact' }); 

        if (error) {
            console.error('Erro ao deletar plano de treinamento:', error.message);
            throw new Error(`Não foi possível deletar o plano de treinamento: ${error.message}`);
        }
        return count > 0;
    }
};

module.exports = planoTreinamentoModel;