# Discord Bot for Creating Jams with theme votings and many more features

## User Commands:
- **`/help`
  displayes all commands
- **`/timeleft`**
  displayes the time left for the jam to the user using the command
- **`/jam`**
  displayes the current theme and time left for jam
- **`/theme`**
  displayes the current theme
- **`/addtheme`**
  adds a new theme to the theme pool for the theme votings

## Jam-Admin Commands
  *These command can only be run by someone with the role specified with /setup*
  - **`/createjam`**
  creates a new Jam (there can only be one Jam at a time)
  - **`/deletejam`**
  deletes the current Jam
  - **`/announcewinner`**
  anounces the winner
  - **`/deletetheme`**
  deletes a them from the theme pool for the theme votings

### The Command arguments get shown in Discord.

## IMPORTANT:
  Create a .env file at the root of the project and fill in:
- DISCORD_TOKEN=token
- DISCORD_CLIENT_ID=bot id

