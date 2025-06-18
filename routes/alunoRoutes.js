const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/authMiddleware");

const alunoController = require("../controllers/alunoController");
const planoTreinamentoController = require("../controllers/planoTreinamentoController");
const questController = require("../controllers/questController");
const calendarioTreinoController = require("../controllers/calendarioTreinoController");
const exerciciosDiaController = require("../controllers/exerciciosDiaController");

// Rotas de perfil do aluno
router.get("/profile", authenticateToken, alunoController.getProfile);
router.put("/profile", authenticateToken, alunoController.updateProfile);
router.post(
  "/change-password",
  authenticateToken,
  alunoController.changePassword
);

// Rotas de planos de treinamento
router.get(
  "/planos",
  authenticateToken,
  planoTreinamentoController.getActivePlanos
);
router.get(
  "/planos/:id",
  authenticateToken,
  planoTreinamentoController.getPlanoDetails
);
router.get(
  "/plano-atribuido",
  authenticateToken,
  planoTreinamentoController.getPlanoAtribuido
);

// Rotas de quests
router.get("/quests", authenticateToken, questController.getAlunoQuests);
router.get("/quests/:id", authenticateToken, questController.getQuestDetails);
router.put(
  "/quests/:id/complete",
  authenticateToken,
  questController.completeQuest
);

// Rotas de calendário de treino
router.get(
  "/calendario/:date",
  authenticateToken,
  calendarioTreinoController.getDailySchedule
);
router.put(
  "/treinos/:id/status",
  authenticateToken,
  calendarioTreinoController.updateTreinoStatus
);

// Rotas de exercícios do dia
router.get(
  "/exercicios-hoje/:aluno_id",
  authenticateToken,
  exerciciosDiaController.getExerciciosDoDia
);
router.get(
  "/exercicios-periodo/:aluno_id",
  authenticateToken,
  exerciciosDiaController.getExerciciosPorPeriodo
);
router.get(
  "/exercicio-detalhe/:treino_exercicio_id",
  authenticateToken,
  exerciciosDiaController.getDetalheExercicio
);
router.put(
  "/exercicio/:treino_exercicio_id/carga",
  authenticateToken,
  exerciciosDiaController.atualizarCargaAtual
);
router.put(
  "/exercicio/:treino_exercicio_id/observacoes",
  authenticateToken,
  exerciciosDiaController.adicionarObservacoesAluno
);

module.exports = router;