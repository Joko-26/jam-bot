import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  GuildMember,
} from "discord.js";
import { state } from "../state";
import { loadString } from "../saveString";

export const data = new SlashCommandBuilder()
  .setName("themevoting")
  .setDescription("Creates a poll for the next theme")
  .addIntegerOption((option) =>
    option.setName("endday").setDescription("End day (1-31)").setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName("endhour").setDescription("End hour (0-23)").setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  console.log("test")
  const requiredRoleName = "Jam-Admin";

  const member = interaction.member as GuildMember;
  if (!member.roles.cache.some((role) => role.name === requiredRoleName)) {
    return interaction.reply({
      content: "You don't have permission to run this command.",
      ephemeral: true,
    });
  }

  const day = interaction.options.getInteger("endday", true);
  const hour = interaction.options.getInteger("endhour", true);

  const now = new Date();
  let month = now.getMonth(); // 0-basiert
  const year = now.getFullYear();

  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  if (day > daysInCurrentMonth || day < now.getDate()) {
    month += 1;
    if (month > 11) {
      month = 0;
    }
  }

  const endTime = new Date(year, month, day, hour).getTime();
  state.votingEnd = endTime;

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

  await interaction.reply({
    content: "Vote for a Theme for the next Jam:",
    components: [row],
  });
}
