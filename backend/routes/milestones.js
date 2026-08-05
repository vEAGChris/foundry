import { Router } from "express";
import {
    getMilestones,
    saveMilestones
} from "../services/milestoneService.js";

const router = Router();

router.get("/", async (req, res) => {

    try {

        const milestones = await getMilestones();

        res.json(milestones);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to load milestones."
        });

    }

});

router.put("/", async (req, res) => {

    try {

        await saveMilestones(req.body);

        res.json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

export default router;