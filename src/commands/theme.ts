import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  embedLength,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";

export const data = new SlashCommandBuilder()
  .setName("theme")
  .setDescription("shows the current jam theme");

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

  // send a message with the current theme
  const embed = new EmbedBuilder()
    .setTitle("Current Theme")
    .setDescription(`The current jam theme is ${state.currentTheme}`)
    .setColor(0xfbff00);
  await interaction.reply({
    embeds: [embed],
    flags: "Ephemeral",
  });
}
