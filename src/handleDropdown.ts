import { EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { getGuildState, saveGuildState } from "./stateManager"

export async function handle_dropddown(interaction:StringSelectMenuInteraction) {
    const state = getGuildState(String(interaction.guildId))
    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({});
    }

    const theme = interaction.values[0]
    const themes = state.themes
    state.themes = themes.filter(item => item !== theme)
    saveGuildState(String(interaction.guildId))
    const embed = new EmbedBuilder()
        .setTitle("Deleted theme")
        .setDescription(`${interaction.user} deleted **${theme}** from the theme-pool`)
        .setColor(0x00ff88)
    await interaction.editReply({
        embeds: [embed]
    })
}