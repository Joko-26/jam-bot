import {
  CommandInteraction,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Guild,
  EmbedBuilder,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";

export const data = new SlashCommandBuilder()
  .setName("addtheme")
  .setDescription("Add a new theme to the themepool")
  .addStringOption((option) =>
    option
      .setName("theme")
      .setDescription("The theme you want in the theme pool")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const state = getGuildState(String(interaction.guildId));

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

  const theme = interaction.options.getString("theme", true);
  if (state.themes.includes(theme)) {
    const embed = new EmbedBuilder()
      .setTitle("Theme already exist")
      .setDescription(`Your theme ${theme} already exists`)
      .setColor(0xff1100);
    interaction.reply({
      embeds: [embed],
      flags: "Ephemeral",
    });
  }
  state.themes.push(theme);
  saveGuildState(String(interaction.guildId));
  const embed = new EmbedBuilder()
    .setTitle("Added theme")
    .setDescription(`${interaction.user} added **${theme}** to the themepool`)
    .setColor(0x00ff88);
  return interaction.reply({
    embeds: [embed],
  });
}
