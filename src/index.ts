import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { handlebutton, getWinningTheme } from "./handlebutton";
import { state } from "./state";
import { timeSplitter, getFormattedDate, getTimeUntil } from "./timeSplitter";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once("ready", () => {
  console.log("Discord bot is ready");

  setInterval(async () => {
    const channelId = "1392143552011829278";
    const channel = client.channels.cache.get(channelId) as TextChannel;
    const currentStage = state.jamStage;
    if (currentStage == "voting") {
      if (getTimeUntil(state.votingEndTime) == "past") {
        state.currentTheme = getWinningTheme();

        state.jamStage = "voteEnd";

        const embed = new EmbedBuilder()
          .setTitle("Voting finished")
          .setDescription(
            `The voting has ended the winner is: **${state.currentTheme}**`
          )
          .setColor(0x00ff88)
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      }
    }

    if (currentStage == "voteEnd") {
      if (getTimeUntil(state.jamStartTime) == "past") {
        state.jamStage = "jaming";

        const embed = new EmbedBuilder()
          .setTitle("Jam started")
          .setDescription(
            `The the Jam started with the Theme: **${state.currentTheme}** \n it ends on: **${state.jamEndTime}**`
          )
          .setColor(0x00ff88)
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      }
    }

    if (currentStage == "jaming") {
      if (getTimeUntil(state.jamStartTime) == "past") {
        state.jamStage = "";

        const embed = new EmbedBuilder()
          .setTitle("Jam ended")
          .setDescription(
            `The the Jam ended and the winner will be anounced shortly`
          )
          .setColor(0x00ff88)
          .setTimestamp();

        state.currentTheme = "";
        state.votingEndTime = "";
        state.jamStartTime = "";
        state.jamEndTime = "";
        state.jamStage = "";
        state.votes.clear();
        state.uservotes = [];

        await channel.send({ embeds: [embed] });
      }
    }
  }, 60 * 1000);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    await handlebutton(interaction);
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    await commands[commandName as keyof typeof commands].execute(interaction);
  }

  if (interaction.isButton()) {
    await handlebutton(interaction);
    return;
  }
});

client.login(config.DISCORD_TOKEN);
