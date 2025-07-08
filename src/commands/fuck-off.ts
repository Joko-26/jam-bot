import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("fuckoff")
    .setDescription("Tells a user to fuck off")
    .addUserOption(option => 
        option.setName("user")
            .setDescription("The user that should fuck off")
            .setRequired(true)
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");
    if (!user){
        return interaction.reply("No user specified")
    }
    return interaction.reply(`Fuck off ${user}`)
}