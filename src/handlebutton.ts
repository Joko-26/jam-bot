import { ButtonInteraction } from "discord.js";
import { state } from "./state";

export async function handlebutton(interaction: ButtonInteraction) {
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ ephemeral: true });
  }

  const index = interaction.customId.split("_").pop();
  await interaction.editReply({
    content: `You voted for ${index} as the new theme index`,
  });
  state.votedTheme = String(index)
}