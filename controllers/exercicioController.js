const exercicioModel = require("../models/exercicioModel");

const exercicioController = {
  async createExercicio(req, res) {
    try {
      const exercicio = await exercicioModel.createExercicio(req.body);
      res.status(201).json(exercicio);
    } catch (error) {
      console.error("Erro ao criar exercício:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async getExercicioById(req, res) {
    try {
      const exercicio = await exercicioModel.getExercicioById(req.params.id);
      if (!exercicio) {
        return res.status(404).json({ error: "Exercício não encontrado" });
      }
      res.json(exercicio);
    } catch (error) {
      console.error("Erro ao buscar exercício:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async getAllExercicios(req, res) {
    try {
      const { grupo_muscular } = req.query;
      const exercicios = await exercicioModel.getAllExercicios(grupo_muscular);
      res.json(exercicios);
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async updateExercicio(req, res) {
    try {
      const exercicio = await exercicioModel.updateExercicio(
        req.params.id,
        req.body
      );
      if (!exercicio) {
        return res.status(404).json({ error: "Exercício não encontrado" });
      }
      res.json(exercicio);
    } catch (error) {
      console.error("Erro ao atualizar exercício:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async deleteExercicio(req, res) {
    try {
      const deleted = await exercicioModel.deleteExercicio(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Exercício não encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar exercício:", error);
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = exercicioController;