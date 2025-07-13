import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Embed,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows a list of all commands");

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle("Help")
    .setDescription(
      "# User Commands:\n `/jam`: displayes the current theme and time left for jam\n `/timeleft`: displayes the time left for the jam to the user using the command\n `/theme`: displayes the current theme\n `/addtheme`: adds a new theme to the theme pool for the theme votes\n\n# Admin commands\n *These command can only be run by someone with the role specified with /setup*\n `/createjam`: creates a new Jam (there can only be one Jam at a time)\n `/deletejam`: deletes the current Jam\n `/announcewinner`: anounces the winner\n `/deletetheme`: deletes a them from the theme pool for the theme votings\n\n **Use `/setup` to setup the bot otherwise it wont work**"
    )
    .setColor(0xfbff00);
  interaction.reply({
    embeds: [embed],
    flags: "Ephemeral",
  });
}
