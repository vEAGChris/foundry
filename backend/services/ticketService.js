import fs from "fs/promises";
import path from "path";

const ticketsPath = path.resolve("../data/tickets.json");

export async function getTickets() {
    const data = await fs.readFile(ticketsPath, "utf8");
    return JSON.parse(data);
}