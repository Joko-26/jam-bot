import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { state } from "../state";

export const data = new SlashCommandBuilder()
  .setName("timeleft")
  .setDescription("Shows the time left till the end of the jam");

export async function execute(interaction: CommandInteraction) {
    const now = new Date();
    const end = new Date(state.endTime);

    let years = end.getFullYear() - now.getFullYear();
    let months = end.getMonth() - now.getMonth();
    let days = end.getDate() - now.getDate();
    let hours = end.getHours() - now.getHours();
    let minutes = end.getMinutes() - now.getMinutes();
    let seconds = end.getSeconds() - now.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {

        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) { months += 12; years--; }

    const timeString = 
        (years ? `${years}y ` : "") +
        (months ? `${months}mo ` : "") +
        (days ? `${days}d ` : "") +
        (hours ? `${hours}h ` : "") +
        (minutes ? `${minutes}m ` : "") +
        `${seconds}s`;

    if (state.endTime - now.getTime() <= 0) {
        return interaction.reply(`The last Jam has ended ${timeString} ago`);
    }

    return interaction.reply(`The current Jam ends in ${timeString}`);
}