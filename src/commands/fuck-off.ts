import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
// command is just a joke and is not part of the bot if you want it anyways just add it to the idex.ts file in /commands
export const data = new SlashCommandBuilder()
  .setName("fuckoff")
  .setDescription("Tells a user to fuck off")
  // input for the user
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user that should fuck off")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  // tells the specified user to fuck off
  const user = interaction.options.getUser("user");
  if (!user) {
    return interaction.reply("No user specified");
  }
  return interaction.reply(`Fuck off ${user}`);
}
