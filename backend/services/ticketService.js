import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { DATA_PATH } from "../config/paths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ticketsPath = path.join(
    __dirname,
    DATA_PATH,
    "tickets.json"
);

export async function getTickets() {
    const data = await fs.readFile(ticketsPath, "utf8");
    return JSON.parse(data);
}

export async function saveTickets(tickets) {

    console.log("Saving:", tickets);

    const data = JSON.stringify(tickets, null, 4);

    await fs.writeFile(
        ticketsPath,
        data,
        "utf8"
    );

    

}