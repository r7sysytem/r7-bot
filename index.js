const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
} = require("discord.js");

const TOKEN = process.env.TOKEN;

const AUTO_ROLE_ID = "1502228931141697546";

const rooms = [
  { label: "تبادل السرقة", value: "1481344240981246163", emoji: "🧤" },
  { label: "تبادل بلوكس", value: "1486658062679801937", emoji: "🔫" },
  { label: "تبادل عام", value: "1486648685898235976", emoji: "🌍" },
  { label: "تبادل المزرعة", value: "1501227088902881441", emoji: "🌱" },
  { label: "تبادل MM2", value: "1501227409176006787", emoji: "🔪" }
];

const activePosts = new Map();

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

client.once("ready", function () {
  console.log("Bot is online: " + client.user.tag);
});

function makePost(user, text) {
  return (
    "╭──・〔 📢 عرض تبادل تلقائي 〕・──╮\n\n" +
    text +
    "\n\n" +
    "╰──・〔 للتواصل: " + user.toString() + " 〕・──╯"
  );
}

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;

  if (message.content.trim() === "تبادل") {
    const embed = new EmbedBuilder()
      .setTitle("📢 نظام التبادل التلقائي")
      .setDescription(
        "لنشر عرضك تلقائياً كل 12 دقيقة.\n\n" +
        "اختر من القائمة بالأسفل:\n\n" +
        "📨 إنشاء منشور\n" +
        "📌 منشوراتك الخاصة\n" +
        "📍 حدود النشر\n" +
        "📖 شرح"
      )
      .setColor("#8b5cf6");

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
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }

  if (message.content.trim() === "حذف منشوري") {
    const post = activePosts.get(message.author.id);

    if (!post) {
      return message.reply("❌ ما عندك منشور تلقائي.");
    }

    clearInterval(post.interval);
    activePosts.delete(message.author.id);

    return message.reply("✅ تم حذف منشورك التلقائي.");
  }
});

client.on("interactionCreate", async function (interaction) {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === "exchange_main") {
    const choice = interaction.values[0];

    if (choice === "create") {
      if (!interaction.member.roles.cache.has(AUTO_ROLE_ID)) {
        return interaction.reply({
          content: "❌ ما عندك رتبة التبادل التلقائي.",
          ephemeral: true
        });
      }

      if (activePosts.has(interaction.user.id)) {
        return interaction.reply({
          content: "❌ عندك منشور تلقائي بالفعل. اكتب: حذف منشوري",
          ephemeral: true
        });
      }

      const roomMenu = new StringSelectMenuBuilder()
        .setCustomId("exchange_room")
        .setPlaceholder("اختر روم")
        .addOptions(rooms);

      return interaction.reply({
        content: "📌 اختر الروم الذي تريد نشر عرضك فيه:",
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
          "📌 منشورك يعمل في <#" + post.channelId + ">\n\n" +
          "النص:\n" + post.text,
        ephemeral: true
      });
    }

    if (choice === "limits") {
      return interaction.reply({
        content:
          "📍 حدود النشر:\n\n" +"• لازم معك رتبة التبادل التلقائي\n" +
          "• منشور واحد فقط لكل عضو\n" +
          "• يتم النشر كل 12 دقيقة\n" +
          "• تقدر تحذف منشورك بكتابة: حذف منشوري",
        ephemeral: true
      });
    }

    if (choice === "help") {
      return interaction.reply({
        content:
          "📖 طريقة الاستخدام:\n\n" +
          "1- اضغط إنشاء منشور\n" +
          "2- اختر روم التبادل\n" +
          "3- البوت يرسلك خاص\n" +
          "4- أرسل نص العرض مع صورة إذا تبي\n" +
          "5- البوت ينشر العرض كل 12 دقيقة",
        ephemeral: true
      });
    }

    if (choice === "refresh") {
      return interaction.reply({
        content: "✅ تم تحديث القائمة.",
        ephemeral: true
      });
    }
  }

  if (interaction.customId === "exchange_room") {
    const channelId = interaction.values[0];

    await interaction.reply({
      content: "📨 أرسلت لك خاص. ارسل نص عرضك مع صورة اختيارية.",
      ephemeral: true
    });

    let dm;

    try {
      dm = await interaction.user.createDM();
      await dm.send(
        "📨 أرسل الآن نص العرض.\n" +
        "تقدر ترسل صورة مع النص.\n" +
        "لديك 60 ثانية فقط."
      );
    } catch (error) {
      return interaction.followUp({
        content: "❌ افتح الخاص عشان البوت يقدر يراسلك.",
        ephemeral: true
      });
    }

    const collector = dm.createMessageCollector({
      filter: function (msg) {
        return msg.author.id === interaction.user.id;
      },
      max: 1,
      time: 60000
    });

    collector.on("collect", async function (msg) {
      const text = msg.content || "عرض بدون نص";
      const attachment = msg.attachments.first();
      const imageUrl = attachment ? attachment.url : null;

      const targetChannel = await client.channels.fetch(channelId).catch(function () {
        return null;
      });

      if (!targetChannel) {
        return dm.send("❌ الروم غير موجود أو البوت ما عنده صلاحية.");
      }

      const finalPost = makePost(interaction.user, text);

      const sendData = {
        content: finalPost
      };

      if (imageUrl) {
        sendData.files = [imageUrl];
      }

      await targetChannel.send(sendData);

      const interval = setInterval(async function () {
        const ch = await client.channels.fetch(channelId).catch(function () {
          return null;
        });

        if (!ch) return;

        const repeatData = {
          content: makePost(interaction.user, text)
        };

        if (imageUrl) {
          repeatData.files = [imageUrl];
        }

        ch.send(repeatData).catch(function () {});
      }, 720000);

      activePosts.set(interaction.user.id, {
        channelId: channelId,
        text: text,
        imageUrl: imageUrl,
        interval: interval
      });

      dm.send("✅ تم حفظ عرضك وسيتم نشره تلقائياً كل 12 دقيقة.");
    });

    collector.on("end", function (collected) {
      if (collected.size === 0) {
        dm.send("⌛ انتهى الوقت. أعد المحاولة من السيرفر.");
      }
    });
  }
});

client.login(TOKEN);
