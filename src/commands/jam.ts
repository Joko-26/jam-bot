import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { state } from "../state";

export const data = new SlashCommandBuilder()
  .setName("jam")
  .setDescription("shows the current Jam");

export async function execute(interaction: CommandInteraction) {
  const now = Date.now();
  let timeLeft = state.endTime - now;

  // Negative Zeit für vergangene Jams
  const isPast = timeLeft <= 0;
  if (isPast) timeLeft = Math.abs(timeLeft);

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const days = Math.floor((timeLeft / (1000 * 60 * 60 * 24)) % 30.44);
  const months = Math.floor((timeLeft / (1000 * 60 * 60 * 24 * 30.44)) % 12);
  const years = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 365.25));

  const timeString =
    (years ? `${years}y ` : "") +
    (months ? `${months}mo ` : "") +
    (days ? `${days}d ` : "") +
    (hours ? `${hours}h ` : "") +
    (minutes ? `${minutes}m ` : "") +
    `${seconds}s`;

  if (isPast) {
    return interaction.reply(
      `The last Jam has ended ${timeString} ago and the theme was ${state.currentTheme}`
    );
  }

  return interaction.reply(
    `The current Jam ends in ${timeString}\nThe theme is ${state.currentTheme}\n`
  );
}
