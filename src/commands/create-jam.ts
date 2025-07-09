import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { state } from "../state";
import { timeSplitter } from "../timeSplitter"
import { loadString } from "../saveString";

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
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  const requiredRoleName = "Jam-Admin";

  const member = interaction.member as GuildMember;
  if (!member.roles.cache.some((role) => role.name === requiredRoleName)) {
    return interaction.reply({
      content: "You don't have permission to run this command.",
      ephemeral: true,
    });
  }

  const votingEnd = interaction.options.getString("votingenddate", true);
  const jamStart = interaction.options.getString("jamstartdate", true);
  const jamEnd = interaction.options.getString("jamenddate", true);
  const jampage = interaction.options.getString("jampage") ?? "";

  state.votingEndTime = timeSplitter(votingEnd)
  state.jamStartTime = timeSplitter(jamStart)
  state.jamEndTime = timeSplitter(jamEnd)

  state.jamStage = "voting"

  state.jamPage = jampage;

  const themes = loadString();
  if (!themes) {
    return interaction.reply("No themes available.");
  }

  const themesArr = Object.values(themes);
  const shuffled = [...themesArr].sort(() => Math.random() - 0.5);
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
    .setDescription(`The Vote ends at **${state.votingEndTime}**`)
    .setColor(0x00ff88)

  await interaction.reply({
    embeds: [embed],
    components: [row],
  });
}
