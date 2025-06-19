const calendarioTreinoModel = require("../models/calendarioTreinoModel");

const treinoModel = require("../models/treinoModel");

const calendarioTreinoController = {
  async getDailySchedule(req, res) {
    const alunoId = req.user.id;
    const date = req.params.date;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }
    if (!date) {
      return res
        .status(400)
        .json({ message: "Data é obrigatória para buscar o agendamento." });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ message: "Formato de data inválido. Use YYYY-MM-DD." });
    }

    try {
      let eventos = await calendarioTreinoModel.getEventosByAlunoAndDate(
        alunoId,
        date
      );

      if (!eventos || eventos.length === 0) {
        return res
          .status(200)
          .json({
            message: `Nenhum treino agendado encontrado para ${date}.`,
            treinos: [],
          });
      }

      const treinosComDetalhes = await Promise.all(
        eventos.map(async (evento) => {
          const treinoDetalhes = await treinoModel.getTreinoById(
            evento.treino_id
          );
          return {
            ...evento,
            treino: treinoDetalhes,
          };
        })
      );

      return res.status(200).json({
        message: `Treinos agendados para ${date} recuperados com sucesso.`,
        treinos: treinosComDetalhes,
      });
    } catch (error) {
      console.error(
        `Erro ao obter agendamento diário para o aluno ${alunoId} na data ${date}:`,
        error.message
      );
      return res.status(500).json({
        message: "Erro interno do servidor ao buscar agendamento de treinos.",
        error: error.message,
      });
    }
  },

  async getScheduleByDateRange(req, res) {
    const alunoId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({
          message:
            "Data de início e fim são obrigatórias para buscar agendamento por período.",
        });
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
    ) {
      return res
        .status(400)
        .json({ message: "Formato de data inválido. Use YYYY-MM-DD." });
    }
    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({
          message: "Data de início não pode ser posterior à data de fim.",
        });
    }

    try {
      let eventos = await calendarioTreinoModel.getEventosByAlunoAndDateRange(
        alunoId,
        startDate,
        endDate
      );

      if (!eventos || eventos.length === 0) {
        return res
          .status(200)
          .json({
            message: `Nenhum treino agendado encontrado para o período de ${startDate} a ${endDate}.`,
            treinos: [],
          });
      }
      const treinosComDetalhes = await Promise.all(
        eventos.map(async (evento) => {
          const treinoDetalhes = await treinoModel.getTreinoById(
            evento.treino_id
          );
          return {
            ...evento,
            treino: treinoDetalhes,
          };
        })
      );

      return res.status(200).json({
        message: `Treinos agendados para o período de ${startDate} a ${endDate} recuperados com sucesso.`,
        treinos: treinosComDetalhes,
      });
    } catch (error) {
      console.error(
        `Erro ao obter agendamento por período para o aluno ${alunoId}:`,
        error.message
      );
      return res.status(500).json({
        message:
          "Erro interno do servidor ao buscar agendamento de treinos por período.",
        error: error.message,
      });
    }
  },

  async updateTreinoStatus(req, res) {
    const alunoId = req.user.id;
    const eventoId = req.params.id;
    const { status: newStatus } = req.body;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }
    if (!eventoId) {
      return res
        .status(400)
        .json({ message: "ID do evento de treino é obrigatório." });
    }
    if (!newStatus) {
      return res.status(400).json({ message: "Novo status é obrigatório." });
    }

    try {
      const eventoExistente = await calendarioTreinoModel.getEventoById(
        eventoId
      );

      if (!eventoExistente) {
        return res
          .status(404)
          .json({ message: "Evento de treino não encontrado." });
      }
      if (eventoExistente.aluno_id !== alunoId) {
        return res
          .status(403)
          .json({
            message:
              "Acesso negado: Este evento não pertence ao aluno autenticado.",
          });
      }

      const updatedEvento = await calendarioTreinoModel.updateEventoStatus(
        eventoId,
        newStatus
      );

      return res.status(200).json({
        message: "Status do treino atualizado com sucesso.",
        evento: updatedEvento,
      });
    } catch (error) {
      console.error(
        `Erro ao atualizar status do treino para o evento ${eventoId} do aluno ${alunoId}:`,
        error.message
      );
      if (error.message.includes("Status inválido")) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: "Erro interno do servidor ao atualizar status do treino.",
        error: error.message,
      });
    }
  },

  async createCalendarEvent(req, res) {
    const alunoId = req.user.id;
    const { treino_id, data, status } = req.body;

    if (!alunoId) {
      return res
        .status(401)
        .json({
          message:
            "ID do aluno não encontrado na sessão. Usuário não autenticado.",
        });
    }
    if (!treino_id || !data) {
      return res
        .status(400)
        .json({
          message:
            "ID do treino e data são obrigatórios para criar um evento no calendário.",
        });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return res
        .status(400)
        .json({ message: "Formato de data inválido. Use YYYY-MM-DD." });
    }

    try {
      const newEvento = await calendarioTreinoModel.createEvento({
        aluno_id: alunoId,
        treino_id,
        data,
        status,
      });
      return res
        .status(201)
        .json({
          message: "Evento de treino criado no calendário com sucesso.",
          evento: newEvento,
        });
    } catch (error) {
      console.error(
        `Erro ao criar evento para o aluno ${alunoId}:`,
        error.message
      );
      return res
        .status(500)
        .json({
          message: "Erro interno do servidor ao criar evento no calendário.",
          error: error.message,
        });
    }
  },
};

module.exports = calendarioTreinoController;