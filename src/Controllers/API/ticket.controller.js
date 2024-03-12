import TicketDao from "../../Services/DAOS/mongoDB/ticket.dao.js";

// import __dirname from "../../dirname.js";

export const getAllTickets = async (req, res) => {
  try {
    const ticketList = await TicketDao.getAll();
    res.json({
      message: "These are the tickets",
      data: ticketList,
    });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).send({
      status: "error",
      error: "Error al traer los tickets.",
    });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await TicketDao.findOneTicket(id);
    if (!ticket) {
      res.status(404).json({
        message: "Ticket id not found",
      });
    }
    res.json({
      message: `this is the ticket with id ${id}`,
      data: ticket,
    });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).send({
      status: "error",
      error: "Error al traer el ticket.",
    });
  }
};
