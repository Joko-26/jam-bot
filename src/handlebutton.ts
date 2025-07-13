import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { getGuildState, saveGuildState } from "./stateManager"

export async function handlebutton(interaction: ButtonInteraction) {
  const state = getGuildState(String(interaction.guildId))
  const userID = interaction.user.id
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ flags: "Ephemeral" });
  }
  if (! state.uservotes.includes(userID)){
    state.uservotes.push(userID)

    const themeID = String(interaction.customId.split("_").pop());

    const currentVotes = state.votes.get(themeID) ?? 0;
    state.votes.set(themeID, currentVotes + 1);

    const index = interaction.customId.split("_").pop();


    const embed = new EmbedBuilder()
      .setTitle("You voted")
      .setDescription(`You voted for ${index} as the next theme`)
      .setColor(0xfbff00)
    await interaction.editReply({
      embeds: [embed],
    });
    saveGuildState(String(interaction.guildId))
  } else {
    const embed = new EmbedBuilder()
      .setTitle("You cant vote")
      .setDescription(`You already voted`)
      .setColor(0xfbff00)
    await interaction.editReply({
      embeds: [embed],
    });
  }
}

export function getWinningTheme(guild:string): string | null {
  const state = getGuildState(guild)
  let maxVotes = -1;
  let winner: string | null = null;

  for (const [theme, votes] of state.votes.entries()) {
    if (votes > maxVotes) {
      maxVotes = votes
      winner = theme;
    }
  }

  state.votes.clear();
  state.uservotes = [];

  return String(winner);
}