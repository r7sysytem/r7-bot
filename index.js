const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
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

const levels = {};

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const msg = message.content.trim().toLowerCase();

  // ===== نظام اللفل =====
  const words = message.content.trim().split(/\s+/).filter(Boolean);

  if (!levels[message.author.id]) {
    levels[message.author.id] = { xp: 0, level: 0 };
  }

  levels[message.author.id].xp += words.length;

  while (levels[message.author.id].xp >= 50) {
    levels[message.author.id].xp -= 50;
    levels[message.author.id].level++;

    const ch = message.guild.channels.cache.get(LEVEL_CHANNEL_ID);
    if (ch) {
      ch.send(`مبروك ${message.author} وصلت لفل ${levels[message.author.id].level}`);
    }
  }

  // ===== خط =====
  if (msg === "خط") {
    return message.channel.send(LINE_IMAGE);
  }

  // ===== لفلي =====
  if (msg === "لفلي") {
    const data = levels[message.author.id] || { xp: 0, level: 0 };
    return message.channel.send(
      لفلك: ${data.level}\nالتقدم: ${data.xp}/50 كلمة
    );
  }

  // ===== قوانين =====
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
});

// ===== القوانين الطويلة =====
const rules = {
  general:
`القوانين العامة

1- الاحترام واجب على الجميع بدون استثناء.
2- يمنع السب أو الشتم أو العنصرية.
3- يمنع نشر محتوى غير لائق.
4- يمنع انتحال شخصية أي عضو.
5- يمنع إثارة المشاكل.
6- يمنع الاستفزاز.
7- يمنع نشر معلومات شخصية.
8- يمنع التهديد.
9- يمنع التخريب.
10- يمنع نشر محتوى صادم.
11- يمنع الترويج بدون إذن.
12- الالتزام بتعليمات الإدارة.
13- الإدارة لها القرار النهائي.
14- تكرار المخالفات يؤدي لعقوبات.
15- يمنع استغلال الثغرات.
16- يمنع نشر الشائعات.
17- يمنع الإزعاج في الخاص.
18- احترام الإدارة واجب.
19- دخولك السيرفر = موافقة.`,

  chat:
`قوانين الشات

1- يمنع السبام.
2- يمنع المنشن العشوائي.
3- يمنع الروابط بدون إذن.
4- يمنع الإعلانات.
5- التزم بموضوع الروم.
6- لا تستفز.
7- لا تنشر محتوى سيء.
8- احترم الجميع.
9- لا تكرر الرسائل.
10- لا تخرب الشات.
11- لا سب.
12- لا إزعاج.`,

  voice:
`قوانين الفويس

1- لا صراخ.
2- لا إزعاج.
3- احترم الموجودين.
4- لا تسجيل بدون إذن.
5- لا تخريب.
6- التزم بالهدوء.
7- الإدارة لها الحق بإخراجك.`,

  security:
`قوانين الأمن

1- لا روابط خبيثة.
2- لا تهكير.
3- لا نصب.
4- لا تشارك معلوماتك.
5- لا تستغل البوت.
6- أي محاولة اختراق = باند.`,

  staff:
`قوانين الإدارة

1- لا تستغل الصلاحيات.
2- كن عادل.
3- احترم الجميع.
4- لا تعطي رتب بدون سبب.
5- القرار للأونر.`
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== "rules_menu") return;

  const embed = new EmbedBuilder()
    .setColor(0x6c2cff)
    .setDescription(rules[interaction.values[0]])
    .setImage(LINE_IMAGE);

  return interaction.reply({
    embeds: [embed],ephemeral: true
  });
});

client.login(process.env.DISCORD_TOKEN);
