import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextChannel,
  Events,
  Guild,
} from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { handlebutton, getWinningTheme } from "./handlebutton";
import { getGuildState, saveGuildState, loadStates, deleteState } from "./stateManager"
import { timeSplitter, getFormattedDate, getTimeUntil } from "./timeManager";
import { handle_dropddown } from "./handleDropdown";
import jams from "./jamStates.json"


// init the client with the right intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

// deploy all commands for all guilds when the bot starts
client.once("ready", async () => {
  for (const id in jams) {
    deployCommands(id)
  }
  console.log("Discord bot is ready");

  // check the jam stage every minute and check the time left for the stage and if one stage ends start the next one and send a according message.
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

// deploy command for every guild the bot gets added to
client.on(Events.GuildCreate, async (guild) => {
  deployCommands(guild.id)
})

// delete the state for very guild that deletes the bot
client.on(Events.GuildDelete, async (guild) => {
  deleteState(guild.id)
})

// handle commands buttons and dropdowns
client.on("interactionCreate", async (interaction) => {
  // handle buttons
  if (interaction.isButton()) {
    await handlebutton(interaction);
    return;
  }
  // handles dropdowns
  if (interaction.isStringSelectMenu()) {
    handle_dropddown(interaction)
    return;
  } 
  // handles commans
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    await commands[commandName as keyof typeof commands].execute(interaction);
  }
});

// login the client with the Token
client.login(config.DISCORD_TOKEN);
