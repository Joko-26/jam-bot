import fs from "fs"
import path from "path"
import { JamState, defaultJamState } from "./state"
import { json } from "stream/consumers";

// inits the state data
const stateFile = path.resolve(__dirname, "jamStates.json");

if (!fs.existsSync(stateFile)) {
    fs.writeFileSync(stateFile, JSON.stringify({}, null, 2))
}

let stateData: Record<string, JamState> = loadStates();

// deserializes the passed record so the ts can use the map object
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

// serializes the passed record so the json can handle the map object
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

// gets all states and deserialzes them
export function loadStates(): Record<string, JamState> {
    const raw = JSON.parse(fs.readFileSync(stateFile, "utf-8"));
    return deserializeALL(raw);
}

// saves all states
function saveStates() {
    const raw = serializeAll(stateData);
    fs.writeFileSync(stateFile, JSON.stringify(raw, null, 2))
}

// deletes a state
export function deleteState(guildId: string) {
    delete stateData[guildId];
    saveStates();
}

// get the state for a passed guild
export function getGuildState(guildId: string): JamState {
    if (!stateData[guildId]) {
        stateData[guildId] = structuredClone(defaultJamState);
        saveStates();
    }
    return stateData[guildId]
}

// saves the state for one passed guild
export function saveGuildState(guildId: string) {
    if (!stateData[guildId]) return;
    saveStates();
}
