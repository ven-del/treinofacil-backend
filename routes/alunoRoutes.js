const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authMiddleware');

const alunoController = require('../controllers/alunoController');

// Aqui, quando criar os outros controladores, vai precisar só descomentar.
// const planoTreinamentoController = require('../controllers/planoTreinamentoController');
// const questController = require('../controllers/questController');
// const calendarioTreinoController = require('../controllers/calendarioTreinoController');

router.get('/profile', authenticateToken, alunoController.getProfile);
router.put('/profile', authenticateToken, alunoController.updateProfile);
router.post(
  '/change-password',
  authenticateToken,
  alunoController.changePassword
);

// Mesma coisa da linha 8. Quando criar os controladores, descomenta essas rotas.
// router.get(
//   '/planos',
//   authenticateToken,
//   planoTreinamentoController.getActivePlanos
// );
// router.get(
//   '/planos/:id',
//   authenticateToken,
//   planoTreinamentoController.getPlanoDetails
// );

// Rotas de quests. Dúvida, ler linha 20.
// router.get('/quests', authenticateToken, questController.getAlunoQuests);
// router.put(
//   '/quests/:id/complete',
//   authenticateToken,
//   questController.completeQuest
// ); 

// Rotas para Calendário e Treinos. Acho que já ficou repetitivo.
// router.get('/calendario/:date', authenticateToken, calendarioTreinoController.getDailySchedule);
// router.put('/treinos/:id/status', authenticateToken, calendarioTreinoController.updateTreinoStatus);


module.exports = router;