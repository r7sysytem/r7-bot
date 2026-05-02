const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🟢 الأوامر
const commands = [
  new SlashCommandBuilder()
    .setName('rules')
    .setDescription('عرض القوانين'),

  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('يتأكد أن البوت شغال')
].map(cmd => cmd.toJSON());

// 🟢 تسجيل الأوامر
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('Started refreshing commands...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );
    console.log('Commands registered ✅');
  } catch (error) {
    console.error(error);
  }
});

// 🟢 رد الأوامر
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'rules') {
    await interaction.reply('📜 القوانين:\n1- احترام الجميع\n2- ممنوع السب\n3- استمتع 😎');
  }

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 البوت شغال!');
  }
});

client.login(process.env.DISCORD_TOKEN);
