const supabase = require('../config/supabaseClient');

const CALENDARIO_TREINO_TABLE = 'calendario_treino';

const calendarioTreinoModel = {
    async createEvento(eventoData) {
        if (!eventoData || !eventoData.aluno_id || !eventoData.data || !eventoData.treino_id) {
            throw new Error("Dados de evento inválidos: aluno_id, data e treino_id são obrigatórios.");
        }
        
        const status = eventoData.status || 'pendente'; 

        const { data, error } = await supabase
            .from(CALENDARIO_TREINO_TABLE)
            .insert({
                aluno_id: eventoData.aluno_id,
                data: eventoData.data,
                treino_id: eventoData.treino_id,
                status: status
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar evento no calendário de treino:', error.message);
            throw new Error(`Não foi possível criar o evento no calendário: ${error.message}`);
        }
        return data;
    },

    async getEventoById(eventoId) {
        if (!eventoId) {
            throw new Error("ID do evento é obrigatório para busca.");
        }
        const { data, error } = await supabase
            .from(CALENDARIO_TREINO_TABLE)
            .select('*')
            .eq('id', eventoId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar evento por ID:', error.message);
            throw new Error(`Erro ao buscar evento: ${error.message}`);
        }
        return data;
    },

    async getEventosByAlunoAndDate(alunoId, date) {
        if (!alunoId || !date) {
            throw new Error("ID do aluno e data são obrigatórios para buscar eventos.");
        }
        const { data, error } = await supabase
            .from(CALENDARIO_TREINO_TABLE)
            .select('*')
            .eq('aluno_id', alunoId)
            .eq('data', date)
            .order('data', { ascending: true });
        if (error) {
            console.error('Erro ao buscar eventos por aluno e data:', error.message);
            throw new Error(`Não foi possível buscar eventos para a data: ${error.message}`);
        }
        return data;
    },

    async getEventosByAlunoAndDateRange(alunoId, startDate, endDate) {
        if (!alunoId || !startDate || !endDate) {
            throw new Error("ID do aluno, data de início e data de fim são obrigatórios para buscar eventos por período.");
        }
        const { data, error } = await supabase
            .from(CALENDARIO_TREINO_TABLE)
            .select('*')
            .eq('aluno_id', alunoId)
            .gte('data', startDate)
            .lte('data', endDate)
            .order('data', { ascending: true });

        if (error) {
            console.error('Erro ao buscar eventos por período:', error.message);
            throw new Error(`Não foi possível buscar eventos para o período: ${error.message}`);
        }
        return data;
    },

    async updateEventoStatus(eventoId, newStatus) {
        if (!eventoId || !newStatus) {
            throw new Error("ID do evento e novo status são obrigatórios para atualização.");
        }
        
        const allowedStatuses = ['pendente', 'concluido', 'cancelado', 'adiado'];
        if (!allowedStatuses.includes(newStatus)) {
            throw new Error(`Status inválido: '${newStatus}'. Status permitidos são: ${allowedStatuses.join(', ')}.`);
        }

        const { data, error } = await supabase
            .from(CALENDARIO_TREINO_TABLE)
            .update({ status: newStatus })
            .eq('id', eventoId)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar status do evento de treino:', error.message);
            throw new Error(`Não foi possível atualizar o status do evento: ${error.message}`);
        }
        return data;
    },

    async deleteEvento(eventoId) {
        if (!eventoId) {
            throw new Error("ID do evento é obrigatório para exclusão.");
        }
        const { error, count } = await supabase
            .from(CALENDARIO_TREINO_TABLE)
            .delete()
            .eq('id', eventoId)
            .select('*', { count: 'exact' });

        if (error) {
            console.error('Erro ao deletar evento do calendário de treino:', error.message);
            throw new Error(`Não foi possível deletar o evento: ${error.message}`);
        }
        return count > 0;
    }
};

module.exports = calendarioTreinoModel;