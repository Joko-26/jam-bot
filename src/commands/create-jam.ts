import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { state } from "../state";

export const data = new SlashCommandBuilder()
  .setName("createjam")
  .setDescription("Create a Jam")

  .addIntegerOption((option) =>
    option.setName("endday").setDescription("End day (1-31)").setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("endhour")
      .setDescription("End hour (0-23)")
      .setRequired(true)
  )

  .addStringOption((option) =>
    option
      .setName("jampage")
      .setDescription("The official page of the Jam")
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("theme")
      .setDescription("The theme of the Jam if left empty the last voted theme will be choosen")
      .setRequired(false)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
  const requiredRoleName = "Jam-Admin";
  const member = interaction.member;

  const hasRole = member.roles.cache.some(
    (role) => role.name === requiredRoleName
  );

  if (!hasRole) {
    return interaction.reply("You dont have permission to run this command");
  }

  let theme = ""


  theme = interaction.options.getString("theme");
  const day = interaction.options.getInteger("endday", true);
  const hour = interaction.options.getInteger("endhour", true);
  const jampage = interaction.options.getString("jampage") ?? "";

  if(!theme) {
    theme = state.votedTheme
  }

  const now = new Date();
  let month = now.getMonth(); // 0-basiert
  const year = now.getFullYear();

  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  if (day > daysInCurrentMonth) {
    month += 1;
    if (month > 11) {
      month = 0;
    }
  } else if (day < now.getDate()) {
    month += 1;
    if (month > 11) {
      month = 0;
    }
  }

  const endTime = new Date(year, month, day, hour).getTime();

  state.currentTheme = theme;
  state.endTime = endTime;
  state.jamPage = jampage;

  await interaction.reply(
    `Jam erstellt!\nTheme: ${theme}\nEnde: ${day}.${
      month + 1
    }.${year} ${hour}\n${jampage ? "Jam Page: " + jampage : ""}`
  );
}
