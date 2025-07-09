# Discord Bot for Creating Jams with theme votings and many more features

## User Commands:
- **`/timeleft`**
  displayes the time left for the jam to the user using the command
- **`/jam`**
  displayes the current theme and time left for jam
- **`/theme`**
  displayes the current theme
- **`/addtheme`**
  adds an new theme to the theme pool for the theme votes

## Jam-Admin Commands
  *These commands need the role Jam-Admin*
  - **`/createjam`**
  creates a new Jam (there can only be one Jam at a time)
  - **`/deletejam`**
  deletes the current Jam
  - **`/announcewinner`**
  anounces the winner

### The Command arguments get shown in Discord.

## IMPORTANT:
  Create a .env file at the root of the project and fill in:
DISCORD_TOKEN=token
DISCORD_CLIENT_ID=bot id
DISCORD_JAM_CHANNEL_ID=channel id
