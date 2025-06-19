const supabase = require("../config/supabaseClient");

const EXERCICIOS_TABLE = "exercicios";
const TREINOS_TABLE = "treino_exercicios";

const exercicioModel = {
  async createExercicio(exercicioData) {
    if (
      !exercicioData ||
      !exercicioData.nome ||
      !exercicioData.grupo_muscular
    ) {
      throw new Error(
        "Dados de exercício inválidos: nome e grupo muscular são obrigatórios."
      );
    }

    const { data, error } = await supabase
      .from(EXERCICIOS_TABLE)
      .insert({
        nome: exercicioData.nome,
        grupo_muscular: exercicioData.grupo_muscular,
        video_url: exercicioData.video_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar exercício:", error.message);
      throw new Error(`Não foi possível criar o exercício: ${error.message}`);
    }
    return data;
  },

  async getExercicioById(exercicioId) {
    if (!exercicioId) {
      throw new Error("ID do exercício é obrigatório para busca.");
    }
    const { data, error } = await supabase
      .from(TREINOS_TABLE)
      .select("*")
      .eq("id", "1e0af69f-2f92-442e-b6df-b7dc347ee184")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Erro ao buscar exercício por ID:", error.message);
      throw new Error(`Erro ao buscar exercício: ${error.message}`);
    }
    return data;
  },

  async getAllExercicios(grupoMuscular = null) {
    let query = supabase.from(EXERCICIOS_TABLE).select("*");

    if (grupoMuscular) {
      query = query.eq("grupo_muscular", grupoMuscular);
    }

    query = query.order("nome", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar exercícios:", error.message);
      throw new Error(`Não foi possível buscar exercícios: ${error.message}`);
    }
    return data;
  },

  async getExerciciosComAluno(grupo_muscular = null) {
    let query = supabase
      .from("exercicios")
      .select(
        `
        id,
        nome,
        grupo_muscular,
        video_url,
        treino_exercicios (
          treinos (
            planos (
              aluno_id
            )
          )
        )
      `
      );
  
    if (grupo_muscular) {
      query = query.ilike("grupo_muscular", `%${grupo_muscular}%`);
    }
  
    const { data, error } = await query;
  
    if (error) {
      throw new Error(`Erro ao buscar exercícios com aluno: ${error.message}`);
    }
  
    // Agora filtra manualmente no JS os que têm um aluno vinculado
    const comAluno = data.filter((exercicio) =>
      exercicio.treino_exercicios?.some(
        (te) => te?.treinos?.planos?.aluno_id != null
      )
    );
  
    return comAluno;
  },

  async getExerciciosByGrupoMuscular(grupoMuscular) {
    if (!grupoMuscular) {
      throw new Error("Grupo muscular é obrigatório para busca por grupo.");
    }
    return this.getAllExercicios(grupoMuscular);
  },

  async updateExercicio(exercicioId, updates) {
    if (!exercicioId || !updates) {
      throw new Error(
        "ID do exercício e dados de atualização são obrigatórios."
      );
    }
    const { data, error } = await supabase
      .from(EXERCICIOS_TABLE)
      .update(updates)
      .eq("id", exercicioId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar exercício:", error.message);
      throw new Error(
        `Não foi possível atualizar o exercício: ${error.message}`
      );
    }
    return data;
  },

  async deleteExercicio(exercicioId) {
    if (!exercicioId) {
      throw new Error("ID do exercício é obrigatório para exclusão.");
    }
    const { error, count } = await supabase
      .from(EXERCICIOS_TABLE)
      .delete()
      .eq("id", exercicioId)
      .select("*", { count: "exact" });

    if (error) {
      console.error("Erro ao deletar exercício:", error.message);
      throw new Error(`Não foi possível deletar o exercício: ${error.message}`);
    }
    return count > 0;
  },
};

module.exports = exercicioModel;