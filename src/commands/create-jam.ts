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

  .addStringOption((option) =>
    option
      .setName("votingenddate")
      .setDescription("Th end date for the theme voting (DD.MM.YY HH:MM)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("jamstartdate")
      .setDescription("Th end date for the theme voting (DD.MM.YY HH:MM)")
      .setRequired(true)
  )

  .addStringOption((option) =>
    option
      .setName("jamenddate")
      .setDescription("Th end date for the theme voting (DD.MM.YY HH:MM)")
      .setRequired(true)
  )

  .addStringOption((option) =>
    option
      .setName("jampage")
      .setDescription("The official page of the Jam")
      .setRequired(false)
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

  const votingEnd = interaction.options.getString("votingenddate", true);
  const jamStart = interaction.options.getString("jamstartdate", true);
  const jamEnd = interaction.options.getString("jamenddate", true);
  const jampage = interaction.options.getString("jampage") ?? "";

  state.votingEndTime = timeSplitter(votingEnd);
  state.jamStartTime = timeSplitter(jamStart);
  state.jamEndTime = timeSplitter(jamEnd);

  state.jamPage = jampage;

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

  state.jamStage = "voting";
  saveGuildState(String(interaction.guildId));

  const shuffled = [...themes].sort(() => Math.random() - 0.5);
  const selectedThemes = shuffled.slice(0, 3);

  const buttons = selectedThemes.map((theme, i) =>
    new ButtonBuilder()
      .setCustomId(`theme_vote_${theme}`)
      .setLabel(theme)
      .setStyle(ButtonStyle.Primary)
  );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);

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
