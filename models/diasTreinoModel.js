const supabase = require('../config/supabaseClient');

const DIAS_TREINO_TABLE = 'dias_treino';

const diasTreinoModel = {

    async addDiaTreino(treinoId, diaSemana) {
        if (!treinoId || !diaSemana) {
            throw new Error("ID do treino e dia da semana são obrigatórios para adicionar dia de treino.");
        }

        const allowedDays = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        const normalizedDiaSemana = diaSemana.toLowerCase();
        if (!allowedDays.includes(normalizedDiaSemana)) {
            throw new Error(`Dia da semana inválido: '${diaSemana}'. Dias permitidos são: ${allowedDays.join(', ')}.`);
        }

        const { data, error } = await supabase
            .from(DIAS_TREINO_TABLE)
            .insert({
                treino_id: treinoId,
                dia_semana: normalizedDiaSemana
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao adicionar dia de treino:', error.message);
            throw new Error(`Não foi possível adicionar o dia de treino: ${error.message}`);
        }
        return data;
    },

    async getDiasTreinoByTreinoId(treinoId) {
        if (!treinoId) {
            throw new Error("ID do treino é obrigatório para buscar dias de treino.");
        }
        const { data, error } = await supabase
            .from(DIAS_TREINO_TABLE)
            .select('*')
            .eq('treino_id', treinoId)
            .order('dia_semana', { ascending: true });

        if (error) {
            console.error('Erro ao buscar dias de treino:', error.message);
            throw new Error(`Não foi possível buscar dias de treino para o treino: ${error.message}`);
        }
        return data;
    },

    async getDiaTreinoByTreinoAndDay(treinoId, diaSemana) {
        if (!treinoId || !diaSemana) {
            throw new Error("ID do treino e dia da semana são obrigatórios para busca.");
        }
        const { data, error } = await supabase
            .from(DIAS_TREINO_TABLE)
            .select('*')
            .eq('treino_id', treinoId)
            .eq('dia_semana', diaSemana.toLowerCase())
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar dia de treino por treino e dia da semana:', error.message);
            throw new Error(`Erro ao buscar dia de treino: ${error.message}`);
        }
        return data;
    },

    async removeDiaTreino(diaTreinoId) {
        if (!diaTreinoId) {
            throw new Error("ID do dia de treino é obrigatório para remoção.");
        }
        const { error, count } = await supabase
            .from(DIAS_TREINO_TABLE)
            .delete()
            .eq('id', diaTreinoId)
            .select('*', { count: 'exact' }); 

        if (error) {
            console.error('Erro ao remover dia de treino:', error.message);
            throw new Error(`Não foi possível remover o dia de treino: ${error.message}`);
        }
        return count > 0;
    },

    async removeAllDiasTreino(treinoId) {
        if (!treinoId) {
            throw new Error("ID do treino é obrigatório para remover todos os dias de treino.");
        }
        const { error, count } = await supabase
            .from(DIAS_TREINO_TABLE)
            .delete()
            .eq('treino_id', treinoId)
            .select('*', { count: 'exact' }); 

        if (error) {
            console.error('Erro ao remover todos os dias de treino do treino:', error.message);
            throw new Error(`Não foi possível remover todos os dias de treino: ${error.message}`);
        }
        return count > 0;
    }
};

module.exports = diasTreinoModel;