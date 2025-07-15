import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  EmbedBuilder,
} from "discord.js";
import { getGuildState, saveGuildState } from "../stateManager";

export const data = new SlashCommandBuilder()
  .setName("deletejam")
  .setDescription("Delete the current Jam");

export async function execute(interaction: ChatInputCommandInteraction) {
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
  const requiredRoleName = state.jamAdminRole;

  const member = interaction.member as GuildMember;
  if (!member.roles.cache.some((role) => role.id === requiredRoleName)) {
    const embed = new EmbedBuilder()
      .setTitle("Invalid role")
      .setDescription("You don't have permission to run this command.")
      .setColor(0xff1100);
    return interaction.reply({
      embeds: [embed],
      flags: "Ephemeral",
    });
  }

  // resets all jam specific data from the state
  state.currentTheme = "";
  state.votingEndTime = "";
  state.jamStartTime = "";
  state.jamEndTime = "";
  state.jamStage = "";
  state.votes.clear();
  state.uservotes = [];

  // save the state
  saveGuildState(String(interaction.guildId));

  // send according message
  const embed = new EmbedBuilder()
    .setTitle("Jam was deled")
    .setDescription(`The current Jam was deleted by ${interaction.user}`)
    .setColor(0x00ff88)
    .setTimestamp();

  interaction.reply({
    embeds: [embed],
  });
}
