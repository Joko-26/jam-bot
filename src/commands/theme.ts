import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { state } from "../state";

export const data = new SlashCommandBuilder()
  .setName("theme")
  .setDescription("shows the current jam theme");

export async function execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: `The current jam theme is ${state.currentTheme}`,
      flags: "Ephemeral"
    })
}