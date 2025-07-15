import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";
import { timeSplitter, getTimeUntil } from "../timeManager";

export const data = new SlashCommandBuilder()
  .setName("timeleft")
  .setDescription("Shows the time left till the end of the jam");

export async function execute(interaction: CommandInteraction) {
  // get the state (data) for the current guild
  const state = getGuildState(String(interaction.guildId));

  // check if the bot has been setup if not quit and send a message to the user running the command
  if (state.jamAdminRole == "" && state.jamChannel == "") {
    const embed = new EmbedBuilder()
      .setTitle("Bot isnt setup proprely")
      .setDescription("Please use `/setup` to setup the bot properly")
      .setColor(0xff1100);
    return interaction.reply({
      embeds: [embed],
      flags: "Ephemeral",
    });
  }

  // check if there is a ongoing jam and send a according message
  if (state.jamStage == "") {
    interaction.reply({
      content: `There is no on going Jam`,
      flags: "Ephemeral",
    });
  }

  // check the jam stage and send a according message with the timeleft for the stage
  if (state.jamStage == "voting") {
    const votingEnd = getTimeUntil(state.votingEndTime);
    if (votingEnd == "past") {
      const embed = new EmbedBuilder()
        .setTitle("Voting start time")
        .setDescription(
          `The voting has ended and the Jam will start at ${getTimeUntil(
            state.jamStartTime
          )}`
        )
        .setColor(0xfbff00);
      interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Voting end time")
        .setDescription(`The Voting ends in ${votingEnd}`)
        .setColor(0xfbff00);
      interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
      });
    }
  }
  if (state.jamStage == "voteEnd") {
    const jamend = getTimeUntil(state.jamStartTime);
    if (jamend == "past") {
      const embed = new EmbedBuilder()
        .setTitle("Jam start time")
        .setDescription(`The the jam ends in ${getTimeUntil(state.jamEndTime)}`)
        .setColor(0xfbff00);
      interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Voting start time")
        .setDescription(`The Jam starts in ${jamend}`)
        .setColor(0xfbff00);
      interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
      });
    }
  }
}
