import { Router } from "express";
import {
    getProjects,
    saveProjects
} from "../services/projectService.js";

const router = Router();

router.get("/", async (req, res) => {

    try {

        const projects = await getProjects();

        res.json(projects);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to load projects."
        });

    }

});

router.put("/", async (req, res) => {

    try {

        await saveProjects(req.body);

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