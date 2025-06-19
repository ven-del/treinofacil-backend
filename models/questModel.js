const supabase = require("../config/supabaseClient");

const QUESTS_TABLE = "quests";

const questModel = {
  async createQuest(questData) {
    if (
      !questData ||
      !questData.aluno_id ||
      !questData.professor_id ||
      !questData.titulo ||
      !questData.data_inicio
    ) {
      throw new Error(
        "Dados da quest inválidos: aluno_id, professor_id, titulo e data_inicio são obrigatórios."
      );
    }

    const { data, error } = await supabase
      .from(QUESTS_TABLE)
      .insert({
        aluno_id: questData.aluno_id,
        professor_id: questData.professor_id,
        titulo: questData.titulo,
        descricao: questData.descricao,
        recompensa: questData.recompensa,
        data_inicio: questData.data_inicio,
        data_fim: questData.data_fim,
        status: questData.status || "pendente",
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar quest:", error.message);
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
      .select(
        `
                *,
                aluno:aluno_id(id, nome, email),
                professor:professor_id(id, nome, email)
            `
      )
      .eq("id", questId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao buscar quest por ID:", error.message);
      throw new Error(`Erro ao buscar quest: ${error.message}`);
    }
    return data;
  },

  async getQuestsByAluno(alunoId, status = null) {
    if (!alunoId) {
      throw new Error("ID do aluno é obrigatório para busca.");
    }

    let query = supabase
      .from(QUESTS_TABLE)
      .select(
        `
                *,
                professor:professor_id(id, nome, email)
            `
      )
      .eq("aluno_id", alunoId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("data_inicio", {
      ascending: false,
    });

    if (error) {
      console.error("Erro ao buscar quests do aluno:", error.message);
      throw new Error(`Não foi possível buscar quests: ${error.message}`);
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
      .eq("id", questId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar quest:", error.message);
      throw new Error(`Não foi possível atualizar a quest: ${error.message}`);
    }
    return data;
  },

  async updateQuestStatus(questId, status) {
    if (!questId || !status) {
      throw new Error(
        "ID da quest e status são obrigatórios para atualização."
      );
    }

    const validStatuses = ["pendente", "concluida", "cancelada"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        "Status inválido. Deve ser um dos seguintes: pendente, concluida, cancelada"
      );
    }

    const { data, error } = await supabase
      .from(QUESTS_TABLE)
      .update({ status })
      .eq("id", questId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar status da quest:", error.message);
      throw new Error(
        `Não foi possível atualizar o status da quest: ${error.message}`
      );
    }
    return data;
  },

  async deleteQuest(questId) {
    if (!questId) {
      throw new Error("ID da quest é obrigatório para exclusão.");
    }
    const { error } = await supabase
      .from(QUESTS_TABLE)
      .delete()
      .eq("id", questId);

    if (error) {
      console.error("Erro ao deletar quest:", error.message);
      throw new Error(`Não foi possível deletar a quest: ${error.message}`);
    }
    return true;
  },
};

module.exports = questModel;