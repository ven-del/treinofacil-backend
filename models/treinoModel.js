const supabase = require("../config/supabaseClient");

const TREINO_TABLE = "treinos";

const treinoModel = {
  async createTreino(treinoData) {
    if (!treinoData || !treinoData.nome) {
      throw new Error(
        "Dados de treino inválidos: nome do treino é obrigatório."
      );
    }

    const { data, error } = await supabase
      .from(TREINO_TABLE)
      .insert({
        plano_id: treinoData.plano_id || null,
        nome: treinoData.nome,
        descricao: treinoData.descricao || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar treino:", error.message);
      throw new Error(`Não foi possível criar o treino: ${error.message}`);
    }
    return data;
  },

  async getTreinoById(treinoId) {
    if (!treinoId) {
      throw new Error("ID do treino é obrigatório para busca.");
    }
    const { data, error } = await supabase
      .from(TREINO_TABLE)
      .select("*")
      .eq("id", treinoId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao buscar treino por ID:", error.message);
      throw new Error(`Erro ao buscar treino: ${error.message}`);
    }
    return data;
  },

  async deleteTreino(treinoId) {
    if (!treinoId) {
      throw new Error("ID do treino é obrigatório para exclusão.");
    }
    const { error, count } = await supabase
      .from(TREINO_TABLE)
      .delete()
      .eq("id", treinoId)
      .select("*", { count: "exact" });

    if (error) {
      console.error("Erro ao deletar treino:", error.message);
      throw new Error(`Não foi possível deletar o treino: ${error.message}`);
    }
    return count > 0;
  },
};

module.exports = treinoModel;