import { Router } from "express";
import { getTickets } from "../services/ticketService.js";

const router = Router();

router.get("/", async (req, res) => {

    const tickets = await getTickets();

    res.json(tickets);

});

export default router;