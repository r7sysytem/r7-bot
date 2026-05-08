const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ]
});

const TOKEN = process.env.TOKEN;

const AUTO_ROLE_ID = "1502228931141697546";

const rooms = {
  "تبادل السرقة": "1481344240981246163",
  "تبادل بلوكس": "1486658062679801937",
  "تبادل عام": "1486648685898235976",
  "تبادل المزرعة": "1501227088902881441",
  "تبادل MM2": "1501227409176006787"
};

const userPosts = new Map();

client.once("ready", function () {
  console.log("البوت اشتغل " + client.user.tag);
});

client.on("messageCreate", async function (message) {

  if (message.author.bot) return;

  // =========================
  // إرسال لوحة التبادل
  // =========================

  if (message.content === "تبادل") {

    const menu = new StringSelectMenuBuilder()
      .setCustomId("auto_exchange_menu")
      .setPlaceholder("اختر خياراً...")
      .addOptions([
        {
          label: "إنشاء منشور",
          value: "create_post",
          emoji: "📨"
        },
        {
          label: "منشوراتك الخاصة",
          value: "my_posts",
          emoji: "📌"
        },
        {
          label: "حدود النشر",
          value: "limits",
          emoji: "📍"
        },
        {
          label: "شرح",
          value: "help",
          emoji: "📖"
        },
        {
          label: "Refresh",
          value: "refresh",
          emoji: "🔄"
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    const embed = new EmbedBuilder()
      .setTitle("نظام المنشورات التلقائي")
      .setDescription("لنشر منشورك أو معرفة منشوراتك اضغط القائمة بالأسفل")
      .setColor("#8b5cf6");

    return message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }

  // =========================
  // حذف المنشور
  // =========================

  if (message.content === "حذف منشوري") {

    const post = userPosts.get(message.author.id);

    if (!post) {
      return message.reply("❌ ما عندك منشور تلقائي.");
    }

    clearInterval(post.interval);

    userPosts.delete(message.author.id);

    return message.reply("✅ تم حذف منشورك التلقائي.");
  }
});

client.on("interactionCreate", async function (interaction) {

  if (!interaction.isStringSelectMenu()) return;

  // =========================
  // القائمة الرئيسية
  // =========================

  if (interaction.customId === "auto_exchange_menu") {

    const choice = interaction.values[0];

    // =========================
    // إنشاء منشور
    // =========================

    if (choice === "create_post") {

      if (!interaction.member.roles.cache.has(AUTO_ROLE_ID)) {

        return interaction.reply({
          content: "❌ ما عندك رتبة التبادل التلقائي.",
          ephemeral: true
        });
      }

      if (userPosts.has(interaction.user.id)) {

        return interaction.reply({
          content: "❌ عندك منشور تلقائي بالفعل. اكتب: حذف منشوري",
          ephemeral: true
        });
      }

      const roomMenu = new StringSelectMenuBuilder()
        .setCustomId("choose_auto_room")
        .setPlaceholder("اختر روم")
        .addOptions([
          {
            label: "تبادل السرقة",
            value: "1481344240981246163",
            emoji: "🌐"
          },
          {
            label: "تبادل بلوكس",
            value: "1486658062679801937",
            emoji: "🌐"
          },
          {
            label: "تبادل عام",
            value: "1486648685898235976",
            emoji: "🌐"
          },
          {
            label: "تبادل المزرعة",
            value: "1501227088902881441",
            emoji: "🌐"
          },
          {
            label: "تبادل MM2",
            value: "1501227409176006787",
            emoji: "🌐"
          }
        ]);

      const row = new ActionRowBuilder().addComponents(roomMenu);

      return interaction.reply({});
  }
});

client.login(TOKEN);
