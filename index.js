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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

const userPosts = new Map();

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

client.once("ready", function () {
  console.log("Bot is ready: " + client.user.tag);
});

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;

  if (message.content.trim() === "تبادل") {
    const menu = new StringSelectMenuBuilder()
      .setCustomId("auto_exchange_menu")
      .setPlaceholder("اختر خياراً...")
      .addOptions([
        { label: "إنشاء منشور", value: "create_post", emoji: "📨" },
        { label: "منشوراتك الخاصة", value: "my_posts", emoji: "📌" },
        { label: "حدود النشر", value: "limits", emoji: "📍" },
        { label: "شرح", value: "help", emoji: "📖" },
        { label: "Refresh", value: "refresh", emoji: "🔄" }
      ]);

    const embed = new EmbedBuilder()
      .setTitle("نظام المنشورات التلقائي")
      .setDescription("لنشر منشورك أو معرفة منشوراتك اضغط القائمة بالأسفل")
      .setColor("#8b5cf6");

    return message.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }

  if (message.content.trim() === "حذف منشوري") {
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

  if (interaction.customId === "auto_exchange_menu") {
    const choice = interaction.values[0];

    if (choice === "create_post") {
      const hasRole =
        interaction.member &&
        interaction.member.roles &&
        interaction.member.roles.cache &&
        interaction.member.roles.cache.has(AUTO_ROLE_ID);

      if (!hasRole) {
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
          { label: "تبادل السرقة", value: "1481344240981246163", emoji: "🌐" },
          { label: "تبادل بلوكس", value: "1486658062679801937", emoji: "🌐" },
          { label: "تبادل عام", value: "1486648685898235976", emoji: "🌐" },
          { label: "تبادل المزرعة", value: "1501227088902881441", emoji: "🌐" },
          { label: "تبادل MM2", value: "1501227409176006787", emoji: "🌐" }
        ]);

      return interaction.reply({
        content: "📌 اختر الروم الذي تريد النشر فيه:",
        components: [new ActionRowBuilder().addComponents(roomMenu)],
        ephemeral: true
      });
    }

    if (choice === "my_posts") {
      const post = userPosts.get(interaction.user.id);

      if (!post) {
        return interaction.reply({
          content: "❌ ما عندك منشور تلقائي حالياً.",
          ephemeral: true
        });
      }

      return interaction.reply({
        content: "📌 منشورك يعمل في <#" + post.channelId + ">\n\n" + post.content,
        ephemeral: true
      });
    }

    if (choice === "limits") {
      return interaction.reply({
        content:
          "📍 حدود النشر:\n\n" +
          "• لازم معك رتبة التبادل التلقائي\n" +
          "• منشور واحد فقط لكل عضو\n" +"• يتم النشر كل 12 دقيقة\n" +
          "• ممنوع السبام والروابط المخالفة",
        ephemeral: true
      });
    }

    if (choice === "help") {
      return interaction.reply({
        content:
          "📖 شرح النظام:\n\n" +
          "1- اضغط إنشاء منشور\n" +
          "2- اختر الروم\n" +
          "3- البوت يرسلك خاص\n" +
          "4- اكتب منشورك\n" +
          "5- يتم نشره تلقائياً كل 12 دقيقة",
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

  if (interaction.customId === "choose_auto_room") {
    const channelId = interaction.values[0];

    await interaction.reply({
      content: "📨 أرسلت لك خاص، اكتب منشورك هناك.",
      ephemeral: true
    });

    let dm;

    try {
      dm = await interaction.user.createDM();
      await dm.send("📨 أرسل الآن نص المنشور. لديك 60 ثانية فقط.");
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
      const content = msg.content || "بدون نص";
      const attachment = msg.attachments.first();

      const targetChannel = await client.channels.fetch(channelId).catch(function () {
        return null;
      });

      if (!targetChannel) {
        return dm.send("❌ الروم غير موجود أو البوت ما عنده صلاحية.");
      }

      const sendData = {
        content: "📢 منشور من " + interaction.user.toString() + "\n\n" + content
      };

      if (attachment) {
        sendData.files = [attachment.url];
      }

      await targetChannel.send(sendData);

      const interval = setInterval(async function () {
        const ch = await client.channels.fetch(channelId).catch(function () {
          return null;
        });

        if (!ch) return;

        const repeatData = {
          content: "📢 منشور من " + interaction.user.toString() + "\n\n" + content
        };

        if (attachment) {
          repeatData.files = [attachment.url];
        }

        ch.send(repeatData).catch(function () {});
      }, 720000);

      userPosts.set(interaction.user.id, {
        channelId: channelId,
        content: content,
        interval: interval
      });

      dm.send("✅ تم حفظ منشورك وسيتم نشره كل 12 دقيقة.");
    });

    collector.on("end", function (collected) {
      if (collected.size === 0) {
        dm.send("⌛ انتهى الوقت، أعد المحاولة من السيرفر.");
      }
    });
  }
});

client.login(TOKEN);
