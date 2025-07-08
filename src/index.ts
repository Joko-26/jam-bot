import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { handlebutton } from "./handlebutton"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once("ready", () => {
    console.log("Discord bot is ready")
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      await handlebutton(interaction)
      return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        await commands[commandName as keyof typeof commands].execute(interaction)
    } 

    if (interaction.isButton()) {
      await handlebutton(interaction)
      return;
    }
});

client.login(config.DISCORD_TOKEN);