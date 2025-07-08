import { CommandInteraction, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { state } from "./state";
import { saveString } from "../saveString"

export const data = new SlashCommandBuilder()
  .setName("addtheme")
  .setDescription("Add a new theme to the themepool")
    .addStringOption(option => 
        option.setName("theme")
            .setDescription("The theme you want in the theme pool")
            .setRequired(true)
    )

export async function execute(interaction:ChatInputCommandInteraction) {
    const theme = interaction.options.getString("theme", true);
    saveString(theme, theme)
    return interaction.reply(`You added ${theme} to the themepool`)
}