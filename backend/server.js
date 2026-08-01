import express from "express";
import ticketRoutes from "./routes/tickets.js";

const app = express();
const PORT = 3001;

app.use(express.json());

app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
    res.send("Foundry API running");
});

app.listen(PORT, () => {
    console.log(`Foundry API listening on http://localhost:${PORT}`);
});