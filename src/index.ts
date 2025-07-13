import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./global-deploy-commands";
import { handlebutton, getWinningTheme } from "./handlebutton";
import { getGuildState, saveGuildState, loadStates } from "./stateManager"
import { timeSplitter, getFormattedDate, getTimeUntil } from "./timeManager";
import { handle_dropddown } from "./handleDropdown"


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once("ready", async () => {
  await client.application.commands.set([]);
  console.log("Discord bot is ready");

  setInterval(async () => {
    
    const allStates = loadStates()
    for (const [guildId, currentState] of Object.entries(allStates)) {
      const state = getGuildState(guildId)
      const channel = client.channels.cache.get(state.jamChannel) as TextChannel;
      if (!state.jamChannel) {
        if (!channel) {
          console.log(`Channel not found for guild ${guildId}: ${state.jamChannel}`);
          continue;
        } 
      }
      
      const channelId = state.jamChannel;
      const currentStage = state.jamStage;
      if (currentStage == "voting") {
        if (getTimeUntil(state.votingEndTime) == "past") {
          state.currentTheme = String(getWinningTheme(guildId));

          state.jamStage = "voteEnd";

          const embed = new EmbedBuilder()
            .setTitle("Voting finished")
            .setDescription(
              `The voting has ended the winner is: **${state.currentTheme}**`
            )
            .setColor(0x001eff)
            .setTimestamp();
          if (!channel) continue;
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
            .setColor(0x001eff)
            .setTimestamp();
          if (!channel) continue;
          await channel.send({ embeds: [embed] });
        }
      }

      
      if (currentStage == "jaming") {
        if (getTimeUntil(state.jamStartTime) == "past") {
          console.log("delete")
          state.jamStage = "";


          const embed = new EmbedBuilder()
            .setTitle("Jam ended")
            .setDescription(
              `The the Jam ended and the winner will be anounced shortly`
            )
            .setColor(0x001eff)
            .setTimestamp();

          state.currentTheme = "";
          state.votingEndTime = "";
          state.jamStartTime = "";
          state.jamEndTime = "";
          state.jamStage = "";
          state.votes.clear();
          state.uservotes = [];
          
          saveGuildState(guildId)
          if (!channel) continue;
          await channel.send({ embeds: [embed] });
        }
      }
    }
    
  }, 60 * 1000);
});


client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    await handlebutton(interaction);
    return;
  }
  if (interaction.isStringSelectMenu()) {
    handle_dropddown(interaction)
    return;
  } 
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    await commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
