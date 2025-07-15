import { EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { getGuildState, saveGuildState } from "./stateManager"

// deletes the theme from the dropdown from deletetheme
export async function handle_dropddown(interaction:StringSelectMenuInteraction) {
    // get the state (data) for the current guild
    const state = getGuildState(String(interaction.guildId))
    // create a answer message so the bot doesnt time out
    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({});
    }

    // gets the theme from the dropdown
    const theme = interaction.values[0]
    // get the theme pool from the state
    const themes = state.themes
    // delete the theme
    state.themes = themes.filter(item => item !== theme)
    // save the state
    saveGuildState(String(interaction.guildId))
    // send a according message
    const embed = new EmbedBuilder()
        .setTitle("Deleted theme")
        .setDescription(`${interaction.user} deleted **${theme}** from the theme-pool`)
        .setColor(0x00ff88)
    await interaction.editReply({
        embeds: [embed]
    })
}