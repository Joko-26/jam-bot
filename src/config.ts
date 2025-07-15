import dotenv from "dotenv";

// gets the values from the .env and make them usable
dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

// sends message in the console if there are no env vars
if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
};
