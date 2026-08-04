import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { DATA_PATH } from "../config/paths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsPath = path.join(
    __dirname,
    DATA_PATH,
    "projects.json"
);

export async function getProjects() {

    const data = await fs.readFile(
        projectsPath,
        "utf8"
    );

    return JSON.parse(data);

}

export async function saveProjects(projects) {

    const data = JSON.stringify(
        projects,
        null,
        4
    );

    await fs.writeFile(
        projectsPath,
        data,
        "utf8"
    );

}