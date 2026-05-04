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

// ================== الأوامر + اللفل ==================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const msg = message.content.trim().toLowerCase();

  // 🆙 نظام اللفل: كل 50 كلمة = لفل
  const words = message.content.trim().split(/\s+/).filter(Boolean);

  if (words.length > 0 && msg !== "خط" && msg !== "قوانين") {
    const userId = message.author.id;

    if (!levels[userId]) {
      levels[userId] = {
        words: 0,
        level: 0
      };
    }

    levels[userId].words += words.length;

    while (levels[userId].words >= 50) {
      levels[userId].words -= 50;
      levels[userId].level += 1;

      const levelChannel = message.guild.channels.cache.get(LEVEL_CHANNEL_ID);

      if (levelChannel) {
        const embed = new EmbedBuilder()
          .setColor(0x6c2cff)
          .setTitle("🎉 لفل جديد!")
          .setDescription(
            🔥 مبروك ${message.author}\n +
            وصلت إلى **Level ${levels[userId].level}**\n\n +
            استمر يا وحش 😈
          )
          .setFooter({ text: "SERVER R7 | Level System" });

        levelChannel.send({ embeds: [embed] });
      }
    }
  }

  // 🔥 خط (رسالة عادية)
  if (msg === "خط") {
    return message.channel.send(LINE_IMAGE);
  }

  // 📊 لفلي
  if (msg === "لفلي") {
    const data = levels[message.author.id] || { words: 0, level: 0 };
    const remaining = 50 - data.words;

    const embed = new EmbedBuilder()
      .setColor(0x6c2cff)
      .setTitle("📊 مستواك")
      .setDescription(
        ${message.author}\n\n +
        🔥 المستوى: **${data.level}**\n +
        📝 الكلمات الحالية: **${data.words}/50**\n +
        ⏳ باقي لك: **${remaining} كلمة** للمستوى القادم
      )
      .setFooter({ text: "SERVER R7 | Level System" });

    return message.channel.send({ embeds: [embed] });
  }

  // 🔥 قوانين
  if (msg === "قوانين") {
    const embed = new EmbedBuilder()
      .setColor(0x6c2cff)
      .setTitle("📜 قوانين سيرفر R7")
      .setDescription("اختر قسم القوانين من القائمة 👇")
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
11- يمنع الترويج لسيرفرات أو حسابات بدون إذن.
12- الالتزام بتعليمات الإدارة إلزامي.
13- الإدارة لها الحق في اتخاذ القرار المناسب.
14- تكرار المخالفات يؤدي لعقوبات أقوى.
15- يمنع استغلال الثغرات أو البوتات.16- يمنع نشر الشائعات أو الأخبار الكاذبة.
17- يمنع الإزعاج في الخاص.
18- يمنع تقليل الاحترام للإدارة.
19- دخولك السيرفر = موافقة على القوانين.

🔥 خلك راقي وخل سيرفر R7 نظيف.`,

  chat:
`💬 قوانين الشات | R7

1- يمنع السبام أو تكرار الرسائل.
2- يمنع المنشن العشوائي للأعضاء أو الإدارة.
3- يمنع نشر روابط بدون إذن.
4- يمنع الإعلانات أو الترويج.
5- التزم بموضوع كل روم.
6- يمنع الاستفزاز أو إثارة المشاكل.
7- يمنع إرسال محتوى غير لائق.
8- استخدم أسلوب محترم.
9- يمنع الكتابة بحروف مزعجة.
10- يمنع نشر محتوى مكرر.
11- يمنع النقاشات السامة.
12- يمنع نشر صور غير مناسبة.
13- يمنع التخريب في الرومات.
14- يمنع السب بين الأعضاء.
15- أي مخالفة = ميوت.

🔥 شات نظيف = مجتمع قوي.`,

  voice:
`🎧 قوانين الفويس | R7

1- يمنع الصراخ أو الإزعاج.
2- يمنع تشغيل أصوات مزعجة.
3- احترام الموجودين واجب.
4- يمنع المقاطعة المتعمدة.
5- يمنع تشغيل موسيقى بدون إذن.
6- يمنع تسجيل الصوت بدون موافقة.
7- يمنع الدخول والخروج للإزعاج.
8- يمنع التخريب داخل الروم.
9- يمنع استخدام مؤثرات مزعجة.
10- الالتزام بالهدوء.
11- الإدارة لها حق إخراجك.
12- أي إزعاج = عقوبة.
13- لا تزعج الآخرين.
14- كن محترم دائمًا.

🔥 استمتع بدون تخريب.`,

  security:
`🛡️ قوانين الأمن | R7

1- يمنع نشر روابط خبيثة.
2- يمنع إرسال ملفات غير موثوقة.
3- يمنع النصب أو الاحتيال.
4- لا تشارك معلوماتك.
5- يمنع محاولة التهكير.
6- يمنع استغلال البوتات.
7- لا تثق بروابط غريبة.
8- الإبلاغ عن المخالفين واجب.
9- حماية حسابك مسؤوليتك.
10- يمنع نشر بيانات حساسة.
11- لا ترسل أكواد تحقق.
12- لا تدخل مواقع مشبوهة.
13- أي تهديد = باند مباشر.
14- الأمن أولًا.

🔥 احمي نفسك.`,

  staff:
`👑 قوانين الإدارة | R7

1- الإدارة تمثل السيرفر.
2- يمنع استغلال الصلاحيات.
3- يمنع إعطاء رتب بدون سبب.
4- التعامل بعدل مع الجميع.
5- الرد بأسلوب محترم.
6- يمنع الظلم.
7- أي خطأ = محاسبة.
8- يمنع التهديد بالرتبة.
9- احترام الأعضاء واجب.
10- القرار النهائي للأونر.
11- لا تحذف بدون سبب.
12- لا تسيء استخدام البوت.
13- كن قدوة.
14- الالتزام مهم.
15- الإدارة مسؤولية.

🔥 إدارة قوية = سيرفر قوي.`
};

// ================== القائمة ==================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== "rules_menu") return;

  const embed = new EmbedBuilder()
    .setColor(0x6c2cff)
    .setDescription(rules[interaction.values[0]])
    .setImage(LINE_IMAGE);

  return interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
});

client.login(process.env.DISCORD_TOKEN);
