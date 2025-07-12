import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";

export const data = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Setup of the jam bot")

  .addChannelOption((option) =>
    option
      .setName("jamchannel")
      .setDescription(
        "The channel that will recive updates about the current jam"
      )
      .setRequired(true)
  )

  .addRoleOption((option) =>
    option
      .setName("jamadminrole")
      .setDescription("The role required to create jams etc.")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const state = getGuildState(String(interaction.guildId));

  const requiredRoleName = state.jamAdminRole;

  const member = interaction.member as GuildMember;
  if (
    !member.roles.cache.some((role) => role.id === requiredRoleName) &&
    state.jamAdminRole !== ""
  ) {
    const embed = new EmbedBuilder()
      .setTitle("Invalid role")
      .setDescription("You don't have permission to run this command.")
      .setColor(0xff1100);
    return interaction.reply({
      embeds: [embed],
      flags: "Ephemeral",
    });
  }

  const jamChannel = interaction.options.getChannel("jamchannel", true);
  const jamAdminRole = interaction.options.getRole("jamadminrole", true);

  state.jamChannel = String(jamChannel.id);
  state.jamAdminRole = String(jamAdminRole.id);
  saveGuildState(String(interaction.guildId));

  const embed = new EmbedBuilder()
    .setTitle("Setup Complete")
    .setDescription(
      `Your Jam channel is: **${jamChannel}**\n
             Your Jam-Admin role is: **${jamAdminRole}**\n
             If you want to change anything run /setup again\n
             \n
             have fun ;)`
    )
    .setColor(0x00ff88);
  return interaction.reply({
    embeds: [embed],
    flags: "Ephemeral",
  });
}
