import { isJSONEncodable } from "discord.js";
import fs from "fs";
const file = "themes.json";

export function saveString(key:string, value:string) {
    let data: Record<string, string> = {};
    if (fs.existsSync(file)) {
        data = JSON.parse(fs.readFileSync(file, "utf-8"));
    }
    data[key] = value;
    fs.writeFileSync(file, JSON.stringify(data), "utf-8")
}

export function loadString(): string | undefined {
    if (!fs.existsSync(file)) return undefined;
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return data;
}