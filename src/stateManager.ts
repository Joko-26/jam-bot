import fs from "fs"
import path from "path"
import { JamState, defaultJamState } from "./state"
import { json } from "stream/consumers";

const stateFile = path.resolve(__dirname, "jamStates.json");

if (!fs.existsSync(stateFile)) {
    fs.writeFileSync(stateFile, JSON.stringify({}, null, 2))
}

let stateData: Record<string, JamState> = loadStates();

function deserializeALL(raw:any): Record<string, JamState> {
    const result: Record<string, JamState> = {};
    for (const [guiltId, state] of Object.entries(raw)) {
        result[guiltId] = {
            ...state,
            votes: new Map(Object.entries((state as any).votes ?? {}))
        };
    }
    return result
}

function serializeAll(states: Record<string, JamState>) : any {
    const result: any = {};
    for (const [guildId, state] of Object.entries(states)) {
        result[guildId] = {
            ...state,
            votes: Object.fromEntries(state.votes ?? new Map())
        }
    }
    return result
}

export function loadStates(): Record<string, JamState> {
    const raw = JSON.parse(fs.readFileSync(stateFile, "utf-8"));
    return deserializeALL(raw);
}

function saveStates() {
    const raw = serializeAll(stateData);
    fs.writeFileSync(stateFile, JSON.stringify(raw, null, 2))
}

export function getGuildState(guildId: string): JamState {
    if (!stateData[guildId]) {
        stateData[guildId] = structuredClone(defaultJamState);
        saveStates();
    }
    return stateData[guildId]
}

export function saveGuildState(guildId: string) {
    if (!stateData[guildId]) return;
    saveStates();
}
