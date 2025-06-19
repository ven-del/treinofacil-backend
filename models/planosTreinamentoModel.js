const supabase = require("../config/supabaseClient");

const PLANOS_TABLE = "planos_treinamento";

const planosTreinamentoModel = {
  async createPlano(planoData) {
    if (
      !planoData ||
      !planoData.aluno_id ||
      !planoData.professor_id ||
      !planoData.nome ||
      !planoData.data_inicio
    ) {
      throw new Error(
        "Dados do plano inválidos: aluno_id, professor_id, nome e data_inicio são obrigatórios."
      );
    }

    const { data, error } = await supabase
      .from(PLANOS_TABLE)
      .insert({
        aluno_id: planoData.aluno_id,
        professor_id: planoData.professor_id,
        nome: planoData.nome,
        descricao: planoData.descricao,
        data_inicio: planoData.data_inicio,
        data_fim: planoData.data_fim,
        ativo: planoData.ativo ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar plano:", error.message);
      throw new Error(`Não foi possível criar o plano: ${error.message}`);
    }
    return data;
  },

  async getPlanoById(planoId) {
    if (!planoId) {
      throw new Error("ID do plano é obrigatório para busca.");
    }

    const { data, error } = await supabase
      .from(PLANOS_TABLE)
      .select(
        `
                *,
                aluno:aluno_id(id, nome, email),
                professor:professor_id(id, nome, email),
                treinos(*)
            `
      )
      .eq("id", planoId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao buscar plano por ID:", error.message);
      throw new Error(`Erro ao buscar plano: ${error.message}`);
    }
    return data;
  },

  async getPlanosByAluno(alunoId) {
    if (!alunoId) {
      throw new Error("ID do aluno é obrigatório para busca.");
    }

    const { data, error } = await supabase
      .from(PLANOS_TABLE)
      .select(
        `
                *,
                professor:professor_id(id, nome, email),
                treinos(*)
            `
      )
      .eq("aluno_id", alunoId)
      .eq("ativo", true)
      .order("data_inicio", { ascending: false });

    if (error) {
      console.error("Erro ao buscar planos do aluno:", error.message);
      throw new Error(`Não foi possível buscar planos: ${error.message}`);
    }
    return data;
  },

  async updatePlano(planoId, updates) {
    if (!planoId || !updates) {
      throw new Error("ID do plano e dados de atualização são obrigatórios.");
    }

    const { data, error } = await supabase
      .from(PLANOS_TABLE)
      .update(updates)
      .eq("id", planoId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar plano:", error.message);
      throw new Error(`Não foi possível atualizar o plano: ${error.message}`);
    }
    return data;
  },

  async deletePlano(planoId) {
    if (!planoId) {
      throw new Error("ID do plano é obrigatório para exclusão.");
    }

    const { error } = await supabase
      .from(PLANOS_TABLE)
      .delete()
      .eq("id", planoId);

    if (error) {
      console.error("Erro ao deletar plano:", error.message);
      throw new Error(`Não foi possível deletar o plano: ${error.message}`);
    }
    return true;
  },
};

module.exports = planosTreinamentoModel;