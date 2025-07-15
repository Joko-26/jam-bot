import { REST, Routes } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

// gets the commands
const commandsData = Object.values(commands).map((command) => command.data);
// initialises the rest api for the deploment
const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands(guildId: string) {
  try {
    console.log(`Started refreshing application (/) commands for guild: ${guildId}.`);
  // sends the commands to the discord server for the registration importand: only for one guild not globaly
  await rest.put(
    Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
    { body: commandsData }
  );

    console.log(`Successfully reloaded application (/) commands for guild: ${guildId}.`);
  } catch (error) {
    console.error(error);
  }
}
