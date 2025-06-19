const supabase = require("../config/supabaseClient");

const TREINO_EXERCICIOS_TABLE = "treino_exercicios";

const treinoExercicioModel = {
  async addExercicioToTreino(
    treinoId,
    exercicioId,
    ordem,
    series,
    repeticoes,
    carga = null,
    observacoes_professor = null,
    observacoes_aluno = null
  ) {
    if (
      !treinoId ||
      !exercicioId ||
      ordem === undefined ||
      series === undefined ||
      repeticoes === undefined
    ) {
      throw new Error(
        "Dados incompletos para adicionar exercício ao treino: treinoId, exercicioId, ordem, series e repeticoes são obrigatórios."
      );
    }

    const { data, error } = await supabase
      .from(TREINO_EXERCICIOS_TABLE)
      .insert({
        treino_id: treinoId,
        exercicio_id: exercicioId,
        ordem: ordem,
        series: series,
        repeticoes: repeticoes,
        carga: carga,
        observacoes_professor: observacoes_professor,
        observacoes_aluno: observacoes_aluno,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar exercício ao treino:", error.message);
      throw new Error(
        `Não foi possível adicionar o exercício ao treino: ${error.message}`
      );
    }
    return data;
  },

  async getExerciciosDoTreino(treinoId) {
    if (!treinoId) {
      throw new Error(
        "ID do treino é obrigatório para buscar exercícios associados."
      );
    }
    const { data, error } = await supabase
      .from(TREINO_EXERCICIOS_TABLE)
      .select("*")
      .eq("treino_id", treinoId)
      .order("ordem", { ascending: true });

    if (error) {
      console.error("Erro ao buscar exercícios do treino:", error.message);
      throw new Error(
        `Não foi possível buscar exercícios para o treino: ${error.message}`
      );
    }
    return data;
  },

  async getTreinoExercicioById(treinoExercicioId) {
    if (!treinoExercicioId) {
      throw new Error(
        "ID da associação treino_exercicio é obrigatório para busca."
      );
    }
    const { data, error } = await supabase
      .from(TREINO_EXERCICIOS_TABLE)
      .select("*")
      .eq("id", treinoExercicioId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error(
        "Erro ao buscar associação treino-exercício por ID:",
        error.message
      );
      throw new Error(`Erro ao buscar associação: ${error.message}`);
    }
    return data;
  },

  async updateTreinoExercicio(treinoExercicioId, updates) {
    if (!treinoExercicioId || !updates) {
      throw new Error(
        "ID da associação e dados de atualização são obrigatórios."
      );
    }
    const { data, error } = await supabase
      .from(TREINO_EXERCICIOS_TABLE)
      .update(updates)
      .eq("id", treinoExercicioId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar exercício do treino:", error.message);
      throw new Error(
        `Não foi possível atualizar o exercício do treino: ${error.message}`
      );
    }
    return data;
  },

  async removeExercicioFromTreino(treinoExercicioId) {
    if (!treinoExercicioId) {
      throw new Error(
        "ID da associação treino_exercicio é obrigatório para remoção."
      );
    }
    const { error, count } = await supabase
      .from(TREINO_EXERCICIOS_TABLE)
      .delete()
      .eq("id", treinoExercicioId)
      .select("*", { count: "exact" });

    if (error) {
      console.error("Erro ao remover exercício do treino:", error.message);
      throw new Error(
        `Não foi possível remover o exercício do treino: ${error.message}`
      );
    }
    return count > 0;
  },

  async removeAllExerciciosFromTreino(treinoId) {
    if (!treinoId) {
      throw new Error(
        "ID do treino é obrigatório para remover todos os exercícios."
      );
    }
    const { error, count } = await supabase
      .from(TREINO_EXERCICIOS_TABLE)
      .delete()
      .eq("treino_id", treinoId)
      .select("*", { count: "exact" });

    if (error) {
      console.error(
        "Erro ao remover todos os exercícios do treino:",
        error.message
      );
      throw new Error(
        `Não foi possível remover todos os exercícios do treino: ${error.message}`
      );
    }
    return count > 0;
  },
};

module.exports = treinoExercicioModel;