const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder
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

/* رتبة التبادل التلقائي */
const AUTO_ROLE_ID = "1494276329825374269";

/* الرومات */
const rooms = [
  {
    label: "تبادل عام",
    value: "1486648685898235976",
    emoji: "🌍"
  },
  {
    label: "تبادل بلوكس",
    value: "1486658062679801937",
    emoji: "🔫"
  },
  {
    label: "تبادل السرقة",
    value: "1481344240981246163",
    emoji: "🧤"
  },
  {
    label: "تبادل المزرعة",
    value: "1501227088902881441",
    emoji: "🌱"
  }
];

const activePosts = new Map();

client.once("ready", function () {
  console.log("جاهز " + client.user.tag);
});

/* شكل المنشور */
function makePostEmbed(user, text, imageUrl) {

  const embed = new EmbedBuilder()

    .setColor("#8b5cf6")

    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL({ dynamic: true })
    })

    .setThumbnail(
      user.displayAvatarURL({ dynamic: true })
    )

    .setDescription(`
${text}

━━━━━━━━━━━━━━

📩 للتواصل:
${user}
`)

    .setFooter({
      text: "تبادل تلقائي"
    });

  if (imageUrl) {
    embed.setImage(imageUrl);
  }

  return embed;
}

/* أمر التبادل */
client.on("messageCreate", async function (message) {

  if (message.author.bot) return;

  if (message.content === "تبادل") {

    const embed = new EmbedBuilder()

      .setColor("#8b5cf6")

      .setTitle("📢 نظام التبادل التلقائي")

      .setDescription(`
🔥 اهلاً بك في نظام التبادل التلقائي

• ارسل عرضك وسيتم نشره كل 12 دقيقة
• يتم وضع صورتك تلقائياً
• آخر المنشور يكون للتواصل معك
• يمنع السبام

📌 اختر الروم من القائمة بالأسفل
`);

    const menu = new StringSelectMenuBuilder()

      .setCustomId("exchange_room")

      .setPlaceholder("اختر روم التبادل")

      .addOptions(rooms);

    const row =
      new ActionRowBuilder().addComponents(menu);

    return message.channel.send({
      embeds: [embed],
      components: [row]
    });

  }

  /* حذف المنشور */
  if (message.content === "حذف منشوري") {

    const post = activePosts.get(message.author.id);

    if (!post) {
      return message.reply("❌ ما عندك منشور.");
    }

    clearInterval(post.interval);

    activePosts.delete(message.author.id);

    return message.reply("✅ تم حذف منشورك.");

  }

});

/* الاختيارات */
client.on("interactionCreate", async function (interaction) {

  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === "exchange_room") {

    /* تحقق الرتبة */
    if (
      !interaction.member.roles.cache.has(AUTO_ROLE_ID)
    ) {

      return interaction.reply({
        content: "❌ لازم يكون عندك رتبة التبادل التلقائي.",
        ephemeral: true
      });

    }

    /* تحقق منشور سابق */
    if (activePosts.has(interaction.user.id)) {

      return interaction.reply({
        content:
          "❌ عندك منشور بالفعل.\nاكتب: حذف منشوري",
        ephemeral: true
      });

    }

    const channelId = interaction.values[0];

    await interaction.reply({
      content:
        "📩 أرسلت لك خاص.\nارسل الآن العرض + صورة اختيارية.",
      ephemeral: true
    });

    let dm;

    try {

      dm = await interaction.user.createDM();

      await dm.send(`
📢 ارسل الآن عرضك.

• ارسل نص فقط أو نص + صورة
• لديك 60 ثانية
`);

    } catch (err) {

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

      const text =
        msg.content || "عرض بدون نص";

      const attachment =
        msg.attachments.first();

      const imageUrl =attachment ? attachment.url : null;

      const targetChannel =
        await client.channels.fetch(channelId);

      /* أول نشر */
      await targetChannel.send({

        embeds: [
          makePostEmbed(
            interaction.user,
            text,
            imageUrl
          )
        ]

      });

      /* إعادة النشر */
      const interval = setInterval(async function () {

        const ch =
          await client.channels.fetch(channelId);

        ch.send({

          embeds: [
            makePostEmbed(
              interaction.user,
              text,
              imageUrl
            )
          ]

        }).catch(function () {});

      }, 720000);

      /* حفظ */
      activePosts.set(interaction.user.id, {

        channelId: channelId,

        text: text,

        imageUrl: imageUrl,

        interval: interval

      });

      dm.send(
        "✅ تم حفظ منشورك وسيتم نشره كل 12 دقيقة."
      );

    });

    collector.on("end", function (collected) {

      if (collected.size === 0) {

        dm.send("⌛ انتهى الوقت.");

      }

    });

  }

});

client.login(TOKEN);
