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
    GatewayIntentBits.DirectMessages
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
    .setDescription("إرسال لوحة التبادل التلقائي"),

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
    console.log("Slash commands registered.");
  } catch (error) {
    console.error(error);
  }
}

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await registerCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "تبادل") {
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
        .setDescription("لنشر منشورك أو معرفة منشوراتك وحدود النشر، اضغط القائمة بالأسفل.")
        .setColor("#8b5cf6");

      return interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(menu)]
      });
    }

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
            content: "❌ عندك منشور تلقائي بالفعل. استخدم /حذف-منشوري لحذفه.",
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
          content: 📌 منشورك يعمل في <#${post.channelId}>:\n\n${post.content},
          ephemeral: true
        });
      }

      if (choice === "limits") {
        return interaction.reply({
          content:
            "📍 حدود النشر:\n• لازم معك رتبة التبادل التلقائي\n• منشور واحد فقط لكل عضو\n• النشر كل 12 دقيقة\n• ممنوع السبام والمخالفات",
          ephemeral: true
        });
      }

      if (choice === "help") {
        return interaction.reply({
          content:
            "📖 الشرح:\n1. اضغط إنشاء منشور\n2. اختر الروم\n3. البوت يرسلك خاص\n4. اكتب منشورك\n5. ينشره كل 12 دقيقة",
          ephemeral: true
        });
      }

      if (choice === "refresh") {
        return interaction.reply({
          content: "✅ تم التحديث.",
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
        const content = msg.content;
        const targetChannel = await client.channels.fetch(channelId).catch(() => null);

        if (!targetChannel) {
          return dm.send("❌ الروم غير موجود أو البوت ما عنده صلاحية.");
        }

        await targetChannel.send(`📢 منشور من ${interaction.user}:\n\n${content}`);

        const interval = setInterval(async () => {
          const ch = await client.channels.fetch(channelId).catch(() => null);
          if (!ch) return;

          ch.send(`📢 منشور من ${interaction.user}:\n\n${content}`).catch(() => {});
        }, 12 * 60 * 1000);

        userPosts.set(interaction.user.id, {
          channelId,
          content,
          interval
        });

        dm.send(`✅ تم حفظ منشورك، وسيتم نشره كل 12 دقيقة في <#${channelId}>`);
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
