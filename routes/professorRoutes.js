const express = require("express");
const router = express.Router();
const exercicioController = require("../controllers/exercicioController");
const planoTreinamentoController = require("../controllers/planoTreinamentoController");
const questController = require("../controllers/questController");
const {
  authenticateToken,
  isProfessor,
} = require("../middlewares/authMiddleware");

router.use(authenticateToken);
router.use(isProfessor);

router.post("/exercicios", exercicioController.createExercicio);
router.get("/exercicios", exercicioController.getAllExercicios);
router.get("/exercicios/:id", exercicioController.getExercicioById);
router.put("/exercicios/:id", exercicioController.updateExercicio);
router.delete("/exercicios/:id", exercicioController.deleteExercicio);

router.post("/planos", planoTreinamentoController.createPlano);
router.get("/planos/:id", planoTreinamentoController.getPlanoById);
router.put("/planos/:id", planoTreinamentoController.updatePlano);
router.delete("/planos/:id", planoTreinamentoController.deletePlano);

router.post("/quests", questController.createQuest);
router.get("/quests/:id", questController.getQuestById);
router.delete("/quests/:id", questController.deleteQuest);

module.exports = router;