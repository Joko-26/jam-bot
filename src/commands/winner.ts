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
  .setName("announcewinner")
  .setDescription("Announce the winner of the Jam")
  // input for the submission name
  .addStringOption((option) =>
    option
      .setName("submissioname")
      .setDescription("The name of the winning submission")
      .setRequired(false)
  )
  // input for the link to the submission
  .addStringOption((option) =>
    option
      .setName("submissionlink")
      .setDescription("The link to the submission")
      .setRequired(false)
  )
  // input for the link to the jam
  .addStringOption((option) =>
    option
      .setName("jamlink")
      .setDescription("The link to the jam Participants")
      .setRequired(false)
  )
  // input for the jam winner as a discord user
  .addUserOption((option) =>
    option
      .setName("winner")
      .setDescription("The winner of the Jam")
      .setRequired(false)
  )
  // input for the jam winner as a normal string
  .addStringOption((option) =>
    option
      .setName("stringwinner")
      .setDescription("The winner of the Jam if he isn't on the Server")
      .setRequired(false)
  );

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

  // get all inputs 
  const submissionName = interaction.options.getString("submissioname", true);
  const submissionLink = interaction.options.getString("submissionlink", true);
  const jamLink = interaction.options.getString("jamlink", true);
  const winner = interaction.options.getUser("winner");
  const stringWinner = interaction.options.getString("stringwinner");

  // check if the winner is on discord or not and set the real winner var accordingly
  let realWinner;

  if (winner) {
    realWinner = winner;
  } else {
    realWinner = stringWinner;
  } 

  // send a according message with a @everyone ping
  const embed = new EmbedBuilder()
    .setTitle(`The Jam is over`)
    .setDescription(
      `The winner of the current Jam is...\n# **${submissionName}**\n ### check it out: **${submissionLink}**\n ### You can check out the other submissions at: **${jamLink}**\n ### Congratulations to all participants! @everyone`
    )
    .setColor(0x001eff);

  await interaction.reply({
    embeds: [embed],
  });
}
