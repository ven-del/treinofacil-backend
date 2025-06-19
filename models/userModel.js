const supabase = require("../config/supabaseClient");

const USER_TABLE = "usuarios";

const userModel = {
  async createUser(userData) {
    console.log("[CREATE_USER] Iniciando criação de usuário:", userData);
    if (!userData || !userData.id || !userData.email) {
      console.error("[CREATE_USER] Dados de usuário inválidos:", userData);
      throw new Error("Dados de usuário inválidos");
    }

    try {
      const { data: existingUser, error: checkError } = await supabase
        .from(USER_TABLE)
        .select("*")
        .eq("id", userData.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error(
          "[CREATE_USER] Erro ao verificar usuário existente:",
          checkError
        );
        throw new Error("Erro ao verificar usuário existente");
      }

      if (existingUser) {
        console.log("[CREATE_USER] Usuário já existe:", existingUser);
        return existingUser;
      }
      const { data: newUser, error: createError } = await supabase
        .from(USER_TABLE)
        .insert([userData])
        .select()
        .single();

      if (createError) {
        console.error("[CREATE_USER] Erro ao criar usuário:", createError);
        throw new Error("Erro ao criar usuário no banco de dados");
      }

      console.log("[CREATE_USER] Usuário criado com sucesso:", newUser);
      return newUser;
    } catch (error) {
      console.error("[CREATE_USER] Erro interno:", error);
      throw error;
    }
  },

  async findUserById(userId) {
    console.log("[FIND_USER] Buscando usuário por ID:", userId);
    if (!userId) {
      console.error("[FIND_USER] ID de usuário não fornecido");
      throw new Error("ID de usuário é obrigatório");
    }

    try {
      const { data: user, error } = await supabase
        .from(USER_TABLE)
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("[FIND_USER] Usuário não encontrado:", userId);
          return null;
        }
        console.error("[FIND_USER] Erro ao buscar usuário:", error);
        throw new Error("Erro ao buscar usuário no banco de dados");
      }

      console.log("[FIND_USER] Usuário encontrado:", user);
      return user;
    } catch (error) {
      console.error("[FIND_USER] Erro interno:", error);
      throw error;
    }
  },

  async updateUser(userId, updates) {
    console.log("[UPDATE_USER] Atualizando usuário:", { userId, updates });
    if (!userId) {
      console.error("[UPDATE_USER] ID de usuário não fornecido");
      throw new Error("ID de usuário é obrigatório");
    }

    if (!updates || Object.keys(updates).length === 0) {
      console.error("[UPDATE_USER] Nenhuma atualização fornecida");
      throw new Error("Dados de atualização são obrigatórios");
    }

    try {
      const { data: updatedUser, error } = await supabase
        .from(USER_TABLE)
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("[UPDATE_USER] Erro ao atualizar usuário:", error);
        throw new Error("Erro ao atualizar usuário no banco de dados");
      }

      if (!updatedUser) {
        console.log("[UPDATE_USER] Usuário não encontrado:", userId);
        return null;
      }

      console.log("[UPDATE_USER] Usuário atualizado com sucesso:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("[UPDATE_USER] Erro interno:", error);
      throw error;
    }
  },

  async deleteUser(userId) {
    console.log("[DELETE_USER] Deletando usuário:", userId);
    if (!userId) {
      console.error("[DELETE_USER] ID de usuário não fornecido");
      throw new Error("ID de usuário é obrigatório");
    }

    try {
      const { error } = await supabase
        .from(USER_TABLE)
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("[DELETE_USER] Erro ao deletar usuário:", error);
        throw new Error("Erro ao deletar usuário do banco de dados");
      }

      console.log("[DELETE_USER] Usuário deletado com sucesso:", userId);
      return true;
    } catch (error) {
      console.error("[DELETE_USER] Erro interno:", error);
      throw error;
    }
  },
};

module.exports = userModel;