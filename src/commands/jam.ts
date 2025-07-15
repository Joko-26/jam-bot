import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";
import { timeSplitter, getTimeUntil } from "../timeManager";

export const data = new SlashCommandBuilder()
  .setName("jam")
  .setDescription("shows the current Jam");

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

  // check if the user has the permission to run this command
  if (state.jamStage == "") {
    const embed = new EmbedBuilder()
      .setTitle("Jam info")
      .setDescription(`There is no on going Jam`)
      .setColor(0xfbff00);
    interaction.reply({
      embeds: [embed],
      flags: "Ephemeral",
    });
  }

  // checks the current jam stage and sends a according message with the infos about the jam
  if (state.jamStage == "voting") {
    const votingEnd = getTimeUntil(state.votingEndTime);
    if (votingEnd == "past") {
      const embed = new EmbedBuilder()
        .setTitle("Jam info")
        .setDescription(
          `The voting has ended and the Jam will start at **${getTimeUntil(
            state.jamStartTime
          )}** the theme is **${state.currentTheme}**`
        )
        .setColor(0xfbff00);
      interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
      });
    } else {
      interaction.reply({
        content: `The Voting ends in ${votingEnd}`,
        flags: "Ephemeral",
      });
    }
  }
  if (state.jamStage == "voteEnd") {
    const votingEnd = getTimeUntil(state.jamStartTime);
    if (votingEnd == "past") {
      const embed = new EmbedBuilder()
        .setTitle("Jam info")
        .setDescription(
          `The the jam ends in **${getTimeUntil(
            state.jamEndTime
          )}** the theme is **${state.currentTheme}**`
        )
        .setColor(0xfbff00);
      interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Jam info")
        .setDescription(
          `The Jam starts in **${votingEnd}** the theme still has to be voted`
        )
        .setColor(0xfbff00);
      interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
      });
    }
  }
}
