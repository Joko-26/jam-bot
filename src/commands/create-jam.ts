import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { timeSplitter } from "../timeManager";
import { getGuildState, saveGuildState } from "../stateManager";

export const data = new SlashCommandBuilder()
  .setName("createjam")
  .setDescription("Create a Jam")
  // input for the voting end date
  .addStringOption((option) =>
    option
      .setName("votingenddate")
      .setDescription("Th end date for the theme voting (DD.MM.YY HH:MM)")
      .setRequired(true)
  )
  // input for the jam start date
  .addStringOption((option) =>
    option
      .setName("jamstartdate")
      .setDescription("Th end date for the theme voting (DD.MM.YY HH:MM)")
      .setRequired(true)
  )
  // input for jam end date
  .addStringOption((option) =>
    option
      .setName("jamenddate")
      .setDescription("Th end date for the theme voting (DD.MM.YY HH:MM)")
      .setRequired(true)
  )
  // input for the jam page
  .addStringOption((option) =>
    option
      .setName("jampage")
      .setDescription("The official page of the Jam")
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

  // get the values from the inputs
  const votingEnd = interaction.options.getString("votingenddate", true);
  const jamStart = interaction.options.getString("jamstartdate", true);
  const jamEnd = interaction.options.getString("jamenddate", true);
  const jampage = interaction.options.getString("jampage") ?? "";

  // get the time strings in the correct format and set the according state value
  state.votingEndTime = timeSplitter(votingEnd);
  state.jamStartTime = timeSplitter(jamStart);
  state.jamEndTime = timeSplitter(jamEnd);

  state.jamPage = jampage;

  // if the theme pool send a according message
  const themes = state.themes;
  if (themes.length == 0) {
    const embed = new EmbedBuilder()
      .setTitle("No themes available")
      .setDescription("Please use /addtheme to add themes to the themepool")
      .setColor(0xff1100);
    return interaction.reply({
      embeds: [embed],
      flags: "Ephemeral",
    });
  }

  // set the stage to "voting"
  state.jamStage = "voting";
  // save the state
  saveGuildState(String(interaction.guildId));

  // pick 3 random themes from the theme pool and make buttons for them
  const shuffled = [...themes].sort(() => Math.random() - 0.5);
  const selectedThemes = shuffled.slice(0, 3);

  const buttons = selectedThemes.map((theme, i) =>
    new ButtonBuilder()
      .setCustomId(`theme_vote_${theme}`)
      .setLabel(theme)
      .setStyle(ButtonStyle.Primary)
  );

  // add them to a row
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);

  // send a poll messsage with the buttons (the voting code is in handleButtons)
  const embed = new EmbedBuilder()
    .setTitle("Vote for a Theme")
    .setDescription(`## The Vote ends at **${state.votingEndTime}**`)
    .setColor(0x001eff);

  const announcementEmbed = new EmbedBuilder()
    .setTitle("New Jam")
    .setDescription(`@everyone A New Jam has begun the Voting starts **now**`)
    .setColor(0x001eff);
    

  await interaction.reply({
    embeds: [announcementEmbed, embed],
    components: [row],
  });
}
