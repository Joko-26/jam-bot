import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  EmbedBuilder,
  
} from "discord.js";
import { state } from "../state";

export const data = new SlashCommandBuilder()
  .setName("deletejam")
  .setDescription("Delete the current Jam")

export async function execute(interaction:ChatInputCommandInteraction) {
    state.currentTheme = ""
    state.votingEndTime = ""
    state.jamStartTime = ""
    state.jamEndTime = ""
    state.jamStage = ""
    state.votes.clear();
    state.uservotes = []

    const embed = new EmbedBuilder()
        .setTitle("Jam was deled")
        .setDescription(`The current Jam was deleted by ${interaction.user}`)
        .setColor(0x00ff88)
        .setTimestamp();

    interaction.reply({
        embeds: [embed]
    })
    
}