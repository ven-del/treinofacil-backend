const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/authMiddleware");

const alunoController = require("../controllers/alunoController");

const planoTreinamentoController = require("../controllers/planoTreinamentoController");
const questController = require("../controllers/questController");
const calendarioTreinoController = require("../controllers/calendarioTreinoController");
const exercicioController = require("../controllers/exercicioController");
const exerciciosDiaController = require("../controllers/exerciciosDiaController");

router.use(authenticateToken);

router.get("/profile", alunoController.getProfile);
router.put("/profile", alunoController.updateProfile);
router.post("/change-password", alunoController.changePassword);

router.get("/planos", planoTreinamentoController.getActivePlanos);
router.get("/planos/:id", planoTreinamentoController.getPlanoDetails);

router.get("/planos", planoTreinamentoController.getPlanosByAluno);
router.get("/planos/:id", planoTreinamentoController.getPlanoById);


router.get("/calendario/:date", calendarioTreinoController.getDailySchedule);
router.put(
  "/treinos/:id/status",
  calendarioTreinoController.updateTreinoStatus
);

router.get("/exercicios", exercicioController.getAllExercicios);
router.get("/exercicios/:id", exercicioController.getExercicioById);
router.get(
  "/exercicios-dia/:aluno_id",
  exerciciosDiaController.getExerciciosDoDia
);
router.get(
  "/exercicios-dia/detalhe/:treino_exercicio_id",
  exerciciosDiaController.getDetalheExercicio
);

router.get("/quests", questController.getAlunoQuests);
router.put("/quests/:id/complete", questController.completeQuest);
router.get("/quests", questController.getQuestsByAluno);
router.get("/quests/:id", questController.getQuestById);
router.patch("/quests/:id/status", questController.updateQuestStatus);

module.exports = router;