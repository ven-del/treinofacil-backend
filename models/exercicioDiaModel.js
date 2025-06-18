const supabase = require("../config/supabaseClient");

const exerciciosDiaModel = {

  async getExerciciosDoDia(alunoId, data = null) {
    if (!alunoId) {
      throw new Error(
        "ID do aluno é obrigatório para buscar exercícios do dia."
      );
    }

    const dataConsulta = data || new Date().toISOString().split("T")[0];

    const { data: exercicios, error } = await supabase
      .from("calendario_treino")
      .select(
        `
                id,
                data,
                status,
                data_conclusao,
                treinos!inner (
                    id,
                    nome,
                    descricao,
                    treino_exercicios!inner (
                        id,
                        ordem,
                        series,
                        repeticoes,
                        carga,
                        carga_atual,
                        observacoes_professor,
                        observacoes_aluno,
                        exercicios!inner (
                            id,
                            nome,
                            grupo_muscular,
                            video_url
                        )
                    )
                )
            `
      )
      .eq("aluno_id", alunoId)
      .eq("data", dataConsulta)
      .order("treinos.treino_exercicios.ordem", { ascending: true });

    if (error) {
      console.error("Erro ao buscar exercícios do dia:", error.message);
      throw new Error(
        `Não foi possível buscar exercícios do dia: ${error.message}`
      );
    }

    const exerciciosProcessados = [];

    exercicios.forEach((calendario) => {
      const treino = calendario.treinos;
      treino.treino_exercicios.forEach((treinoExercicio) => {
        exerciciosProcessados.push({
          calendario_id: calendario.id,
          treino_id: treino.id,
          treino_nome: treino.nome,
          treino_descricao: treino.descricao,
          treino_exercicio_id: treinoExercicio.id,
          exercicio_id: treinoExercicio.exercicios.id,
          exercicio_nome: treinoExercicio.exercicios.nome,
          grupo_muscular: treinoExercicio.exercicios.grupo_muscular,
          video_url: treinoExercicio.exercicios.video_url,
          ordem: treinoExercicio.ordem,
          series: treinoExercicio.series,
          repeticoes: treinoExercicio.repeticoes,
          carga: treinoExercicio.carga,
          carga_atual: treinoExercicio.carga_atual,
          observacoes_professor: treinoExercicio.observacoes_professor,
          observacoes_aluno: treinoExercicio.observacoes_aluno,
          data: calendario.data,
          status_treino: calendario.status,
          data_conclusao: calendario.data_conclusao,
        });
      });
    });

    return exerciciosProcessados;
  },

  async getDetalheExercicio(treinoExercicioId) {
    if (!treinoExercicioId) {
      throw new Error(
        "ID do treino exercício é obrigatório para buscar detalhes."
      );
    }

    const { data, error } = await supabase
      .from("treino_exercicios")
      .select(
        `
                id,
                ordem,
                series,
                repeticoes,
                carga,
                carga_atual,
                observacoes_professor,
                observacoes_aluno,
                exercicios!inner (
                    id,
                    nome,
                    grupo_muscular,
                    video_url
                ),
                treinos!inner (
                    id,
                    nome,
                    descricao
                )
            `
      )
      .eq("id", treinoExercicioId)
      .single();

    if (error) {
      console.error("Erro ao buscar detalhes do exercício:", error.message);
      throw new Error(
        `Não foi possível buscar detalhes do exercício: ${error.message}`
      );
    }

    return {
      treino_exercicio_id: data.id,
      exercicio: {
        id: data.exercicios.id,
        nome: data.exercicios.nome,
        grupo_muscular: data.exercicios.grupo_muscular,
        video_url: data.exercicios.video_url,
      },
      treino: {
        id: data.treinos.id,
        nome: data.treinos.nome,
        descricao: data.treinos.descricao,
      },
      configuracao: {
        ordem: data.ordem,
        series: data.series,
        repeticoes: data.repeticoes,
        carga: data.carga,
        carga_atual: data.carga_atual,
        observacoes_professor: data.observacoes_professor,
        observacoes_aluno: data.observacoes_aluno,
      },
    };
  },

  async atualizarCargaAtual(treinoExercicioId, novaCarga) {
    if (!treinoExercicioId || novaCarga === undefined) {
      throw new Error("ID do treino exercício e nova carga são obrigatórios.");
    }

    const { data, error } = await supabase
      .from("treino_exercicios")
      .update({ carga_atual: novaCarga })
      .eq("id", treinoExercicioId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar carga atual:", error.message);
      throw new Error(
        `Não foi possível atualizar a carga atual: ${error.message}`
      );
    }

    return data;
  },

  /**
   * Adiciona observações do aluno a um exercício
   * @param {string} treinoExercicioId - ID da relação treino_exercicio
   * @param {string} observacoes - Observações do aluno
   * @returns {Object} Dados atualizados
   */
  async adicionarObservacoesAluno(treinoExercicioId, observacoes) {
    if (!treinoExercicioId || !observacoes) {
      throw new Error("ID do treino exercício e observações são obrigatórios.");
    }

    const { data, error } = await supabase
      .from("treino_exercicios")
      .update({ observacoes_aluno: observacoes })
      .eq("id", treinoExercicioId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao adicionar observações do aluno:", error.message);
      throw new Error(
        `Não foi possível adicionar observações: ${error.message}`
      );
    }

    return data;
  },
};

module.exports = exerciciosDiaModel;