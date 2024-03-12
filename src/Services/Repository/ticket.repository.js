import ticketDao from "../DAOS/mongoDB/ticket.dao.js";

class TicketRepository {

  getAll = () => {
    return ticketDao.getAll();
  };
  getById = (id) => {
    return ticketDao.findOneTicket(id);
  };
  save = (ticket) => {
    return ticketDao.generateTicket(ticket);
  };
 
}


export default new TicketRepository();
