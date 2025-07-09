import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { state } from "../state";
import { timeSplitter, getTimeUntil } from "../timeSplitter";


export const data = new SlashCommandBuilder()
  .setName("timeleft")
  .setDescription("Shows the time left till the end of the jam");

export async function execute(interaction: CommandInteraction) {
    if (state.jamStage == "") {
        interaction.reply({
            content: `There is no on going Jam`,
            flags: "Ephemeral",
        })        
    }
    
    if (state.jamStage == "voting") {
        const votingEnd = getTimeUntil(state.votingEndTime)
        if (votingEnd == "past") {
            interaction.reply({
                content: `The voting has ended and the Jam will start at ${getTimeUntil(state.jamStartTime)}`,
                flags: "Ephemeral",
            })
        } else {
            interaction.reply({
                content: `The Voting ends in ${votingEnd}`,
                flags: "Ephemeral",
            })
        }
    } 
    if (state.jamStage == "voteEnd") {
        const votingEnd = getTimeUntil(state.jamStartTime)
        if (votingEnd == "past") {
            interaction.reply({
                content: `The the jam ends in ${getTimeUntil(state.jamEndTime)}`,
                flags: "Ephemeral",
            })
        } else {
            interaction.reply({
                content: `The Jam starts in ${votingEnd}`,
                flags: "Ephemeral",
            })
        }
    } 
}