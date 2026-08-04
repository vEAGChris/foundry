import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/tickets.js";
import projectRoutes from "./routes/projects.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketRoutes);
app.use("/api/projects", projectRoutes);
app.get("/", (req, res) => {
    res.send("Foundry API running");
});

app.listen(PORT, () => {
    console.log(`Foundry API listening on http://localhost:${PORT}`);
});