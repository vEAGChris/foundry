import { Router } from "express";
import { 
    getTickets,
    saveTickets
} from "../services/ticketService.js";


const router = Router();

router.get("/", async (req, res) => {
    try {
        const tickets = await getTickets();
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to load tickets."
        });
    }
});

router.put("/", async (req, res) => {
    try {
        await saveTickets(req.body);
        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
        });
    }
});

export default router;