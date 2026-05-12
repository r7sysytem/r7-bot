const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

const TOKEN = process.env.TOKEN;

const AUTO_ROLE_ID = "1502228931141697546";

const rooms = [
  { label: "تبادل عام", value: "1486648685898235976", emoji: "🌍" },
  { label: "تبادل بلوكس", value: "1486658062679801937", emoji: "🔫" },
  { label: "تبادل السرقة", value: "1481344240981246163", emoji: "🧤" },
  { label: "تبادل المزرعة", value: "1501227088902881441", emoji: "🌱" }
];

const activePosts = new Map();

client.once("ready", function () {
  console.log("جاهز " + client.user.tag);
});

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;

  if (message.content.trim() === "تبادل") {
    const menu = new StringSelectMenuBuilder()
      .setCustomId("exchange_main")
      .setPlaceholder("اختر خياراً...")
      .addOptions([
        { label: "إنشاء منشور", value: "create", emoji: "📨" },
        { label: "منشوراتك الخاصة", value: "my_posts", emoji: "📌" },
        { label: "حدود النشر", value: "limits", emoji: "📍" },
        { label: "شرح", value: "help", emoji: "📖" },
        { label: "Refresh", value: "refresh", emoji: "🔄" }
      ]);

    return message.channel.send({
      content:
`📢 نظام التبادل التلقائي

اختر من القائمة بالأسفل:

📨 إنشاء منشور
📌 منشوراتك الخاصة
📍 حدود النشر
📖 شرح`,
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }

  if (message.content.trim() === "حذف منشوري") {
    const post = activePosts.get(message.author.id);

    if (!post) return message.reply("❌ ما عندك منشور.");

    clearInterval(post.interval);
    activePosts.delete(message.author.id);

    return message.reply("✅ تم حذف منشورك.");
  }
});

client.on("interactionCreate", async function (interaction) {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === "exchange_main") {
    const choice = interaction.values[0];

    if (choice === "create") {
      if (!interaction.member.roles.cache.has(AUTO_ROLE_ID)) {
        return interaction.reply({
          content: "❌ لازم يكون عندك رتبة التبادل التلقائي.",
          ephemeral: true
        });
      }

      if (activePosts.has(interaction.user.id)) {
        return interaction.reply({
          content: "❌ عندك منشور بالفعل.\nاكتب: حذف منشوري",
          ephemeral: true
        });
      }

      const roomMenu = new StringSelectMenuBuilder()
        .setCustomId("exchange_room")
        .setPlaceholder("اختر روم التبادل")
        .addOptions(rooms);

      return interaction.reply({
        content: "📌 اختر الروم اللي تبي تنشر فيه:",
        components: [new ActionRowBuilder().addComponents(roomMenu)],
        ephemeral: true
      });
    }

    if (choice === "my_posts") {
      const post = activePosts.get(interaction.user.id);

      if (!post) {
        return interaction.reply({
          content: "❌ ما عندك منشور تلقائي حالياً.",
          ephemeral: true
        });
      }

      return interaction.reply({
        content:
`📌 منشورك شغال في <#${post.channelId}>

النص:
${post.text}`,
        ephemeral: true
      });
    }

    if (choice === "limits") {
      return interaction.reply({
        content:
`📍 حدود النشر:

• لازم معك رتبة التبادل التلقائي
• منشور واحد فقط لكل عضو
• يتم النشر كل 12 دقيقة
• للحذف اكتب: حذف منشوري`,
        ephemeral: true
      });
    }

    if (choice === "help") {
      return interaction.reply({
        content:
`📖 الشرح:

1- اضغط إنشاء منشور
2- اختر روم التبادل
3- البوت يرسلك خاص
4- اكتب عرضك
5- البوت ينشره كل 12 دقيقة

شكل المنشور:
أنا عندي فلوس

━━━━━━━━━━━━━━

📩 للتواصل:
@اسم_الشخص`,
        ephemeral: true
      });
    }

    if (choice === "refresh") {
      return interaction.reply({
        content: "✅ تم تحديث القائمة.",
        ephemeral: true
      });}
  }

  if (interaction.customId === "exchange_room") {
    const channelId = interaction.values[0];

    await interaction.reply({
      content: "📩 أرسلت لك خاص، ارسل عرضك الآن.",
      ephemeral: true
    });

    let dm;

    try {
      dm = await interaction.user.createDM();
      await dm.send(
`📢 ارسل الآن عرضك

مثال:
أنا عندي فلوس

والبوت بيضيف التواصل تلقائياً.`
      );
    } catch {
      return interaction.followUp({
        content: "❌ افتح الخاص أول.",
        ephemeral: true
      });
    }

    const collector = dm.createMessageCollector({
      filter: function (m) {
        return m.author.id === interaction.user.id;
      },
      max: 1,
      time: 60000
    });

    collector.on("collect", async function (msg) {
      const text = msg.content || "عرض بدون نص";
      const targetChannel = await client.channels.fetch(channelId);

      const finalPost =
`${text}

━━━━━━━━━━━━━━

📩 للتواصل:
${interaction.user}`;

      await targetChannel.send(finalPost);

      const interval = setInterval(async function () {
        const ch = await client.channels.fetch(channelId);

        const autoPost =
`${text}

━━━━━━━━━━━━━━

📩 للتواصل:
${interaction.user}`;

        ch.send(autoPost).catch(function () {});
      }, 720000);

      activePosts.set(interaction.user.id, {
        channelId: channelId,
        text: text,
        interval: interval
      });

      dm.send("✅ تم حفظ منشورك وسيتم نشره كل 12 دقيقة.");
    });

    collector.on("end", function (collected) {
      if (collected.size === 0) {
        dm.send("⌛ انتهى الوقت.");
      }
    });
  }
});

client.login(TOKEN);
