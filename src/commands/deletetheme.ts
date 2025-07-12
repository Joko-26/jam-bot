import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  Embed,
} from "discord.js";
import { timeSplitter } from "../timeManager";
import { getGuildState, saveGuildState, loadStates } from "../stateManager";

export const data = new SlashCommandBuilder()
  .setName("deletetheme")
  .setDescription("Deletes one theme from the Themepool");

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

  const requiredRoleName = state.jamAdminRole;

  const member = interaction.member as GuildMember;
  if (!member.roles.cache.some((role) => role.id === requiredRoleName)) {
    return interaction.reply({
      content: "You don't have permission to run this command.",
      ephemeral: true,
    });
  }

  if (state.themes.length == 0) {
    const embed = new EmbedBuilder()
      .setTitle("No themes available")
      .setDescription("Add themes with `/addthemes`")
      .setColor(0xff1100);
    interaction.reply({
      embeds: [embed],
      flags: "Ephemeral",
    });
  }
  const dropdown = new StringSelectMenuBuilder().setCustomId("delete_themes");

  const options = state.themes.map((theme) => ({
    label: theme,
    value: theme,
  }));
  dropdown.addOptions(options);

  const drop = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    dropdown
  );

  const embed = new EmbedBuilder()
    .setTitle("Delete Theme")
    .setDescription("Choose the theme you want to delete")
    .setColor(0xfbff00);

  interaction.reply({
    embeds: [embed],
    components: [drop],
    flags: "Ephemeral",
  });
}
