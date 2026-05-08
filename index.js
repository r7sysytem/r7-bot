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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ]
});

const commands = [
  new SlashCommandBuilder()
    .setName("exchange")
    .setDescription("نظام التبادل التلقائي"),

  new SlashCommandBuilder()
    .setName("delete-post")
    .setDescription("حذف منشورك التلقائي")
].map(function(command) {
  return command.toJSON();
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function registerCommands() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("Commands registered successfully");
  } catch (error) {
    console.log(error);
  }
}

client.once("ready", async function() {
  console.log("Logged in as " + client.user.tag);
  await registerCommands();
});

client.on("interactionCreate", async function(interaction) {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "exchange") {
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
        .setDescription("لنشر منشورك أو معرفة منشوراتك وحدود النشر اضغط القائمة بالأسفل")
        .setColor("#8b5cf6");

      return interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }

    if (interaction.commandName === "delete-post") {
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

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "auto_exchange_menu") {
      const choice = interaction.values[0];

      if (choice === "create_post") {
        if (!interaction.member.roles.cache.has(AUTO_ROLE_ID)) {
          return interaction.reply({
            content: "❌ ما عندك رتبة التبادل التلقائي.",
            ephemeral: true
          });
        }

        if (userPosts.has(interaction.user.id)) {
          return interaction.reply({
            content: "❌ عندك منشور تلقائي بالفعل. استخدم /delete-post",
            ephemeral: true
          });
        }

        const roomOptions = Object.entries(rooms).map(function(entry) {
          return {
            label: entry[0],
            value: entry[1],
            emoji: "🌐"
          };
        });

        const roomMenu = new StringSelectMenuBuilder()
          .setCustomId("choose_auto_room")
          .setPlaceholder("اختر روم")
          .addOptions(roomOptions);

        const row = new ActionRowBuilder().addComponents(roomMenu);

        return interaction.reply({
          content: "📌 اختر الروم الذي تريد النشر فيه:",
          components: [row],
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
          content:
            "📌 منشورك يعمل في <#" +
            post.channelId +
            ">:\n\n" +
            post.content,
          ephemeral: true
        });
      }

      if (choice === "limits") {
        return interaction.reply({
          content:
            "📍 حدود النشر:\n\n" +
            "• لازم معك رتبة التبادل التلقائي\n" +
            "• منشور واحد فقط لكل عضو\n" +
            "• يتم النشر كل 12 دقيقة\n" +
            "• ممنوع السبام أو الروابط المخالفة",
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
        filter: function(msg) {
          return msg.author.id === interaction.user.id;
        },
        max: 1,
        time: 60000
      });

      collector.on("collect", async function(msg) {
        const content = msg.content || "بدون نص";
        const attachment = msg.attachments.first();

        const targetChannel = await client.channels.fetch(channelId).catch(function() {
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

        const interval = setInterval(async function() {
          const ch = await client.channels.fetch(channelId).catch(function() {
            return null;
          });

          if (!ch) return;

          const repeatData = {
            content: "📢 منشور من " + interaction.user.toString() + "\n\n" + content
          };

          if (attachment) {
            repeatData.files = [attachment.url];
          }

          ch.send(repeatData).catch(function() {});
        }, 720000);

        userPosts.set(interaction.user.id, {
          channelId: channelId,
          content: content,
          interval: interval
        });

        dm.send("✅ تم حفظ منشورك وسيتم نشره كل 12 دقيقة في <#" + channelId + ">");
      });

      collector.on("end", function(collected) {
        if (collected.size === 0) {
          dm.send("⌛ انتهى الوقت، أعد المحاولة من السيرفر.");
        }
      });
    }
  }
});

client.login(TOKEN);
