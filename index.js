const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const AUTO_ROLE_ID = "1502228931141697546";

const rooms = {
  "تبادل السرقة": "1481344240981246163",
  "تبادل بلوكس": "1486658062679801937",
  "تبادل عام": "1486648685898235976",
  "تبادل المزرعة": "1501227088902881441",
  "تبادل MM2": "1501227409176006787"
};

const userPosts = new Map();

const commands = [
  new SlashCommandBuilder()
    .setName("تبادل")
    .setDescription("نظام التبادل التلقائي"),

  new SlashCommandBuilder()
    .setName("حذف-منشوري")
    .setDescription("حذف منشورك التلقائي")
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function registerCommands() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("تم تسجيل الكوماندات");
  } catch (error) {
    console.error(error);
  }
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await registerCommands();
});

client.on("interactionCreate", async (interaction) => {

  // =========================
  // Slash Commands
  // =========================

  if (interaction.isChatInputCommand()) {

    // /تبادل
    if (interaction.commandName === "تبادل") {

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

      return interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }

    // /حذف-منشوري
    if (interaction.commandName === "حذف-منشوري") {

      const post = userPosts.get(interaction.user.id);

      if (!post) {
        return interaction.reply({
          content: "❌ ما عندك منشور تلقائي.",
          ephemeral: true
        });
      }

      clearInterval(post.interval);
      userPosts.delete(interaction.user.id);

      return interaction.reply({
        content: "✅ تم حذف منشورك التلقائي.",
        ephemeral: true
      });
    }
  }

  // =========================
  // Select Menu
  // =========================

  if (interaction.isStringSelectMenu()) {

    // القائمة الرئيسية
    if (interaction.customId === "auto_exchange_menu") {

      const choice = interaction.values[0];

      // إنشاء منشور
      if (choice === "create_post") {

        if (!interaction.member.roles.cache.has(AUTO_ROLE_ID)) {
          return interaction.reply({
            content: "❌ ما عندك رتبة التبادل التلقائي.",
            ephemeral: true
          });
        }

        if (userPosts.has(interaction.user.id)) {
          return interaction.reply({
            content: "❌ عندك منشور تلقائي بالفعل. استخدم /حذف-منشوري",
            ephemeral: true
          });
        }

        const roomMenu = new StringSelectMenuBuilder()
          .setCustomId("choose_auto_room")
          .setPlaceholder("اختر روم")
          .addOptions(
            Object.entries(rooms).map(([name, id]) => ({
              label: name,
              value: id,
              emoji: "🌐"
            }))
          );

        const row = new ActionRowBuilder().addComponents(roomMenu);

        return interaction.reply({
          content: "📌 اختر الروم الذي تريد النشر فيه:",
          components: [row],
          ephemeral: true
        });
      }

      // منشوراتك الخاصة
      if (choice === "my_posts") {

        const post = userPosts.get(interaction.user.id);

        if (!post) {
          return interaction.reply({
            content: "❌ ما عندك منشور تلقائي حالياً.",
            ephemeral: true
          });
        }

        return interaction.reply({
          content: 📌 منشورك يعمل في <#${post.channelId}>:\n\n${post.content},
          ephemeral: true
        });
      }

      // حدود النشر
      if (choice === "limits") {

        return interaction.reply({
          content:
`📍 حدود النشر:

• لازم معك رتبة التبادل التلقائي
• منشور واحد فقط لكل عضو
• يتم النشر كل 12 دقيقة
• ممنوع السبام أو الروابط المخالفة`,
          ephemeral: true
        });
      }

      // شرح
      if (choice === "help") {

        return interaction.reply({
          content:
`📖 شرح النظام:

1- اضغط إنشاء منشور
2- اختر الروم
3- البوت يرسلك خاص
4- اكتب منشورك
5- يتم نشره تلقائياً كل 12 دقيقة`,
          ephemeral: true
        });
      }

      // تحديث
      if (choice === "refresh") {

        return interaction.reply({
          content: "✅ تم تحديث القائمة.",
          ephemeral: true
        });
      }
    }

    // اختيار الروم
    if (interaction.customId === "choose_auto_room") {

      const channelId = interaction.values[0];

      await interaction.reply({
        content: "📨 أرسلت لك خاص، اكتب منشورك هناك.",
        ephemeral: true
      });

      let dm;

      try {

        dm = await interaction.user.createDM();

        await dm.send(
          "📨 أرسل الآن نص المنشور (اختياري صورة) لديك 60 ثانية فقط."
        );

      } catch {

        return interaction.followUp({
          content: "❌ افتح الخاص عشان البوت يقدر يراسلك.",
          ephemeral: true
        });
      }

      const collector = dm.createMessageCollector({
        filter: msg => msg.author.id === interaction.user.id,
        max: 1,
        time: 60000
      });

      collector.on("collect", async (msg) => {

        const content = msg.content || "بدون نص";
        const attachment = msg.attachments.first();

        const targetChannel = await client.channels.fetch(channelId).catch(() => null);

        if (!targetChannel) {
          return dm.send("❌ الروم غير موجود أو البوت ما عنده صلاحية.");
        }

        // أول نشر
        await targetChannel.send({
          content: 📢 منشور من ${interaction.user}\n\n${content},
          files: attachment ? [attachment.url] : []
        });

        // النشر التلقائي
        const interval = setInterval(async () => {

          const ch = await client.channels.fetch(channelId).catch(() => null);

          if (!ch) return;

          ch.send({
            content: 📢 منشور من ${interaction.user}\n\n${content},
            files: attachment ? [attachment.url] : []
          }).catch(() => {});

        }, 12 * 60 * 1000);

        // حفظ البيانات
        userPosts.set(interaction.user.id, {
          channelId,
          content,
          interval
        });

        dm.send(
          ✅ تم حفظ منشورك وسيتم نشره كل 12 دقيقة في <#${channelId}>
        );
      });

      collector.on("end", collected => {

        if (collected.size === 0) {
          dm.send("⌛ انتهى الوقت، أعد المحاولة من السيرفر.");
        }
      });
    }
  }
});

client.login(TOKEN);
