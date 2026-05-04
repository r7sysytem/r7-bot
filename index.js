const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  REST,
  Routes
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const LINE_IMAGE = "https://cdn.discordapp.com/attachments/1481671050671427746/1500463419353206834/59FFD92D-2656-4D2D-BB91-7B9DFD3F2724.png";
const LEVEL_CHANNEL_ID = "1494581022896029726";
const ADMIN_ROLE = "1481375123243143320";

const levels = {};

// ===== تسجيل الكوماند =====
const commands = [
  {
    name: "r7",
    description: "قوانين + استدعاء",
    options: [
      {
        name: "نوع",
        description: "اختر",
        type: 3,
        required: true,
        choices: [
          { name: "القوانين", value: "rules" },
          { name: "استدعاء", value: "call" }
        ]
      },
      {
        name: "سبب",
        description: "سبب الاستدعاء",
        type: 3,
        required: false
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

client.once("ready", async () => {
  console.log("Logged in as " + client.user.tag);

  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands }
  );

  console.log("تم تسجيل /r7 ✅");
});

// ===== الرسائل =====
client.on("messageCreate", async function (message) {
  if (message.author.bot) return;

  const msg = message.content.trim().toLowerCase();

  if (msg === "خط") {
    return message.channel.send(LINE_IMAGE);
  }

  if (msg === "لفلي") {
    const data = levels[message.author.id] || { xp: 0, level: 0 };
    return message.channel.send(
      "لفلك: " + data.level + "\n" +
      "التقدم: " + data.xp + "/50 كلمة"
    );
  }

  if (msg === "قوانين") {
    const embed = new EmbedBuilder()
      .setColor(0x6c2cff)
      .setTitle("قوانين سيرفر R7")
      .setDescription("اختر قسم القوانين من القائمة")
      .setImage(LINE_IMAGE)
      .setFooter({ text: "SERVER R7 | Rules Panel" });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("rules_menu")
      .setPlaceholder("اختر قسم القوانين")
      .addOptions(
        { label: "القوانين العامة", value: "general", emoji: "📖" },
        { label: "قوانين الشات", value: "chat", emoji: "💬" },
        { label: "قوانين الفويس", value: "voice", emoji: "🎧" },
        { label: "قوانين الأمن", value: "security", emoji: "🛡️" },
        { label: "قوانين الإدارة", value: "staff", emoji: "👑" }
      );

    return message.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }

  // ===== نظام اللفل =====
  const words = message.content.trim().split(/\s+/).filter(Boolean);

  if (!levels[message.author.id]) {
    levels[message.author.id] = { xp: 0, level: 0 };
  }

  levels[message.author.id].xp += words.length;

  while (levels[message.author.id].xp >= 50) {
    levels[message.author.id].xp -= 50;
    levels[message.author.id].level += 1;

    const channel = message.guild.channels.cache.get(LEVEL_CHANNEL_ID);

    if (channel) {
      channel.send(
        "مبروك " + message.author.toString() +
        " وصلت لفل " + levels[message.author.id].level
      );
    }
  }
});

// ===== /r7 =====
client.on("interactionCreate", async (interaction) => {

  // سلاش
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName !== "r7") return;

    const type = interaction.options.getString("نوع");
    const reason = interaction.options.getString("سبب");

    // ===== القوانين =====
    if (type === "rules") {
      const embed = new EmbedBuilder()
        .setColor(0x6c2cff)
        .setTitle("قوانين سيرفر R7")
        .setDescription("اختر قسم القوانين من القائمة")
        .setImage(LINE_IMAGE);

      const menu = new StringSelectMenuBuilder()
        .setCustomId("rules_menu")
        .setPlaceholder("اختر قسم القوانين")
        .addOptions(
          { label: "القوانين العامة", value: "general", emoji: "📖" },
          { label: "قوانين الشات", value: "chat", emoji: "💬" },
          { label: "قوانين الفويس", value: "voice", emoji: "🎧" },
          { label: "قوانين الأمن", value: "security", emoji: "🛡️" },
          { label: "قوانين الإدارة", value: "staff", emoji: "👑" }
        );

      return interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(menu)]
      });
    }

    // ===== استدعاء =====
    if (type === "call") {
      return interaction.reply({
        content: `<@&${ADMIN_ROLE}> 🚨 استدعاء إدارة\n👤 ${interaction.user}\n📌 ${reason || "بدون سبب"}`
      });
    }
  }

  // ===== منيو القوانين =====
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId !== "rules_menu") return;

    const embed = new EmbedBuilder()
      .setColor(0x6c2cff)
      .setDescription(rules[interaction.values[0]])
      .setImage(LINE_IMAGE);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
});

// ===== القوانين (بدون تغيير) =====
const rules = { /* نفس كودك بدون تعديل */ };

client.login(process.env.DISCORD_TOKEN);
