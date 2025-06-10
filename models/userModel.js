const supabase = require('../config/supabaseClient');

const USER_TABLE = 'usuarios'; 

const userModel = {
  async createUser(userData) {
    if (!userData || !userData.id || !userData.email) {
      throw new Error(
        "Dados de usuário inválidos para criação. ID e email são obrigatórios."
      );
    }

    const { data: existingUser, error: findError } = await supabase
      .from(USER_TABLE)
      .select("id")
      .eq("id", userData.id)
      .single();

    if (findError && findError.code !== "PGRST116") {
      console.error("Erro ao verificar usuário existente:", findError.message);
      throw new Error(
        `Erro ao verificar usuário existente: ${findError.message}`
      );
    }

    if (existingUser) {
      throw new Error(
        `Usuário com ID ${userData.id} já existe na tabela '${USER_TABLE}'.`
      );
    }

    const { data, error } = await supabase
      .from(USER_TABLE)
      .insert({
        id: userData.id,
        nome: userData.nome || null,
        email: userData.email,
        tipo: userData.tipo || "aluno",
        criado_em: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar usuário:", error.message);
      throw new Error(`Não foi possível criar o usuário: ${error.message}`);
    }

    return data;
  },
  async findUserById(userId) {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório para busca.");
    }
    const { data, error } = await supabase
      .from(USER_TABLE)
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao buscar usuário por ID:", error.message);
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
    return data;
  },

  async updateUser(userId, updates) {
    if (!userId || !updates) {
      throw new Error("ID do usuário e dados de atualização são obrigatórios.");
    }
    const { data, error } = await supabase
      .from(USER_TABLE)
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar usuário:", error.message);
      throw new Error(`Não foi possível atualizar o usuário: ${error.message}`);
    }
    return data;
  },

  async deleteUser(userId) {
    if (!userId) {
      throw new Error("ID do usuário é obrigatório para exclusão.");
    }
    const { error, count } = await supabase
      .from(USER_TABLE)
      .delete()
      .eq("id", userId)
      .select("*", { count: "exact" });

    if (error) {
      console.error("Erro ao deletar usuário:", error.message);
      throw new Error(`Não foi possível deletar o usuário: ${error.message}`);
    }
    return count > 0;
  },
};

module.exports = userModel;