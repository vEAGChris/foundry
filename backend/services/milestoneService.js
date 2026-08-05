import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { DATA_PATH } from "../config/paths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const milestonesPath = path.join(
    __dirname,
    DATA_PATH,
    "milestones.json"
);

export async function getMilestones() {

    const data = await fs.readFile(
        milestonesPath,
        "utf8"
    );

    return JSON.parse(data);

}

export async function saveMilestones(milestones) {

    const data = JSON.stringify(
        milestones,
        null,
        4
    );

    await fs.writeFile(
        milestonesPath,
        data,
        "utf8"
    );

}