import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { getGuildState, saveGuildState } from "./stateManager"

// handles the button events from the theme votings
export async function handlebutton(interaction: ButtonInteraction) {
  // get the state (data) for the current guild
  const state = getGuildState(String(interaction.guildId))
  // get the user ID
  const userID = interaction.user.id
  // create a message so the bot wont timeout 
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ flags: "Ephemeral" });
  }
  // get the ID of the button and extract the theme of that button from the ID
  if (! state.uservotes.includes(userID)){
    state.uservotes.push(userID)

    const themeID = String(interaction.customId.split("_").pop());

    // set the state value votes of this theme 
    const currentVotes = state.votes.get(themeID) ?? 0;
    state.votes.set(themeID, currentVotes + 1);

    // get the theme as a string for the feedback message
    const index = interaction.customId.split("_").pop();

    // send a according feedback message if the user has or hasnt voted yet
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

// gets the winner of the vote
export function getWinningTheme(guild:string): string | null {
  // get the state (data) for the current guild
  const state = getGuildState(guild)
  // sets the needed vars
  let maxVotes = -1;
  let winner: string | null = null; 

  // calculate the winner of the votes
  for (const [theme, votes] of state.votes.entries()) {
    if (votes > maxVotes) {
      maxVotes = votes
      winner = theme;
    }
  } 

  // resets the state values used for the vote
  state.votes.clear();
  state.uservotes = [];

  // save the state
  saveGuildState(guild)

  // return the winner
  return String(winner);
}