import { Router } from "express";
import {
  getAllTickets,
  getTicketById,
} from "../../Controllers/API/ticket.controller.js";

const router = Router();

router.get("/", getAllTickets);
router.get("/:id", getTicketById);

export default router;
