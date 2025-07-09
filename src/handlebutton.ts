import { ButtonInteraction } from "discord.js";
import { state } from "./state";

export async function handlebutton(interaction: ButtonInteraction) {
  const userID = interaction.user.id
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ flags: "Ephemeral" });
  }
  if (! state.uservotes.includes(userID)){
    state.uservotes.push(userID)

    const themeID = interaction.customId;
    const themeKey = themeID;

    const currentVotes = state.votes.get(themeKey) ?? 0;
    state.votes.set(themeKey, currentVotes + 1);

    const index = interaction.customId.split("_").pop();
    await interaction.editReply({
      content: `You voted for ${index} as the next theme`,
    });
  } else {
    await interaction.editReply({
      content: `You already voted`,
    });
  }
}

export function getWinningTheme(): string | null {
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