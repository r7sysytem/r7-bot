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
  console.log(`🔥 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const msg = message.content.trim().toLowerCase();

  // ================== نظام اللفل ==================
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
      ch.send(`🎉 مبروك ${message.author} وصلت Level ${levels[message.author.id].level} 🔥`);
    }
  }

  // ================== خط ==================
  if (msg === "خط") {
    return message.channel.send(LINE_IMAGE);
  }

  // ================== لفلي ==================
  if (msg === "لفلي") {
    const data = levels[message.author.id];
    return message.channel.send(
      📊 لفلك: ${data.level}\n📝 التقدم: ${data.xp}/50 كلمة
    );
  }

  // ================== قوانين ==================
  if (msg === "قوانين") {
    const embed = new EmbedBuilder()
      .setColor(0x6c2cff)
      .setTitle("📜 قوانين سيرفر R7")
      .setDescription("اختر قسم القوانين من القائمة 👇")
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

    return message.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }
});

// ================== القوانين الطويلة ==================
const rules = {

general:
`📖 القوانين العامة | R7

1- الاحترام واجب على جميع الأعضاء بدون استثناء.
2- يمنع السب أو الشتم أو التنمر أو العنصرية بأي شكل.
3- يمنع نشر أي محتوى غير لائق أو مخالف للذوق العام.
4- يمنع انتحال شخصية أي عضو أو إداري أو بوت.
5- يمنع إثارة المشاكل أو الفتن داخل السيرفر.
6- يمنع الاستفزاز أو التقليل من الآخرين.
7- يمنع نشر أو طلب معلومات شخصية.
8- يمنع التهديد بأي شكل من الأشكال.
9- يمنع التخريب أو الإزعاج المتعمد.
10- يمنع نشر محتوى +18 أو محتوى صادم.
11- يمنع الترويج بدون إذن.
12- الالتزام بتعليمات الإدارة إلزامي.
13- الإدارة لها الحق في اتخاذ القرار المناسب.
14- تكرار المخالفات يؤدي لعقوبات أقوى.
15- يمنع استغلال الثغرات.
16- يمنع نشر الشائعات.
17- يمنع الإزعاج في الخاص.
18- يمنع قلة الاحترام للإدارة.
19- دخولك السيرفر = موافقة على القوانين.

🔥 خلك راقي.`,

chat:
`💬 قوانين الشات | R7

1- يمنع السبام.
2- يمنع المنشن العشوائي.
3- يمنع نشر روابط بدون إذن.
4- يمنع الإعلانات.
5- التزم بموضوع الروم.
6- لا تستفز.
7- لا تنشر محتوى غير لائق.
8- احترم الجميع.
9- لا تكرر.
10- لا تخرب الشات.
11- لا سب.
12- لا إزعاج.

🔥 شات نظيف.`,

voice:
`🎧 قوانين الفويس | R7

1- لا صراخ.
2- لا إزعاج.
3- احترم الموجودين.
4- لا تسجيل بدون إذن.
5- لا تخريب.
6- التزم بالهدوء.
7- الإدارة لها الحق تطلعك.

🔥 استمتع بدون تخريب.`,

security:
`🛡️ قوانين الأمن | R7

1- لا روابط خبيثة.
2- لا تهكير.
3- لا نصب.
4- لا تشارك معلوماتك.
5- لا تستغل البوت.
6- أي محاولة اختراق = باند.

🔥 الأمان مهم.`,

staff:
`👑 قوانين الإدارة | R7

1- لا تستغل الصلاحيات.
2- كن عادل.
3- احترم الجميع.4- لا تعطي رتب بدون سبب.
5- القرار للأونر.

🔥 إدارة قوية.`
};

// ================== القائمة ==================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== "rules_menu") return;

  const embed = new EmbedBuilder()
    .setColor(0x6c2cff)
    .setDescription(rules[interaction.values[0]])
    .setImage(LINE_IMAGE);

  interaction.reply({ embeds: [embed], ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);
