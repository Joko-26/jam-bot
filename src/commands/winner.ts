import {
  CommandInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("announcewinner")
    .setDescription("Announce the winner of the Jam") 
    .addStringOption(option =>
        option.setName("submissioname")
        .setDescription("The name of the winning submission")
        .setRequired(false)
    )
    .addStringOption(option =>
        option.setName("submissionlink")
        .setDescription("The link to the submission")
        .setRequired(false)
    )
    .addStringOption(option =>
        option.setName("jamlink")
        .setDescription("The link to the jam Participants")
        .setRequired(false)
    )
    .addUserOption(option =>
        option.setName("winner")
        .setDescription("The winner of the Jam")
        .setRequired(false)
    )
    .addStringOption(option =>
        option.setName("stringwinner")
        .setDescription("The winner of the Jam if he isn't on the Server")
        .setRequired(false)
    )

export async function execute(interaction:ChatInputCommandInteraction) {
  const requiredRoleName = "Jam-Admin";

  const member = interaction.member as GuildMember;
  if (!member.roles.cache.some((role) => role.name === requiredRoleName)) {
    return interaction.reply({
      content: "You don't have permission to run this command.",
      ephemeral: true,
    });
  }

    const submissionName = interaction.options.getString("submissioname", true);
    const submissionLink = interaction.options.getString("submissionlink", true);
    const jamLink = interaction.options.getString("jamlink", true);
    const winner = interaction.options.getUser("winner");
    const stringWinner = interaction.options.getString("stringwinner");

    let realWinner

    if (winner) {
        realWinner = winner
    } else {
        realWinner = stringWinner
    }

    const embed = new EmbedBuilder()
        .setTitle(`The Jam is over`)
        .setDescription(`The winner of the current Jam is...\n# **${submissionName}**\n ### check it out: **${submissionLink}**\n ### You can check out the other submissions at: **${jamLink}**\n ### Congratulations to all participants! @everyone`)
        .setColor(0x00ff88)

    await interaction.reply({
        embeds: [embed]
    })
}
