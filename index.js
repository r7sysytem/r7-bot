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

client.once("ready", () => {
  console.log(`🔥 Logged in as ${client.user.tag}`);
});

// ==========================
// 💬 أوامر الشات
// ==========================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const msg = message.content.toLowerCase();

  // 🔥 خط
  if (msg === "خط") {
    return message.channel.send({
      embeds: [new EmbedBuilder().setColor(0x6c2cff).setImage(LINE_IMAGE)]
    });
  }

  // 🔥 قوانين
  if (msg === "قوانين") {
    const embed = new EmbedBuilder()
      .setColor(0x6c2cff)
      .setTitle("📜 قوانين سيرفر R7")
      .setDescription("اختر القسم 👇")
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

// ==========================
// 💀 قوانين أسطورية مطوولة
// ==========================
const rules = {

general:
`📖 القوانين العامة:

1- الاحترام واجب على الجميع بدون استثناء.
2- يمنع السب، الشتم، التنمر، أو العنصرية.
3- يمنع نشر أي محتوى غير لائق أو مخالف.
4- يمنع انتحال شخصية أي عضو أو إداري.
5- يمنع إثارة المشاكل أو الفتن داخل السيرفر.
6- يمنع نشر معلومات شخصية.
7- الالتزام بتعليمات الإدارة إلزامي.
8- يمنع التهديد بأي شكل.
9- يمنع الاستفزاز أو التقليل من الآخرين.
10- يمنع التخريب أو الإزعاج المتعمد.
11- يمنع نشر محتوى +18.
12- يمنع الترويج لسيرفرات بدون إذن.
13- الإدارة لها الحق الكامل في اتخاذ القرار.
14- أي محاولة تخريب = باند.
15- دخولك السيرفر يعني موافقتك على القوانين.

🔥 خلك راقي.`,

chat:
`💬 قوانين الشات:

1- يمنع السبام أو تكرار الرسائل.
2- يمنع المنشن العشوائي.
3- يمنع نشر روابط بدون إذن.
4- يمنع إرسال محتوى مخالف.
5- التزم بموضوع الروم.
6- يمنع الاستفزاز.
7- يمنع الإعلانات.
8- استخدم أسلوب محترم.
9- يمنع الكتابة المزعجة.
10- يمنع نشر محتوى مكرر.
11- يمنع النقاشات الحادة.
12- يمنع إرسال صور غير لائقة.
13- يمنع تخريب الشات.
14- يمنع التحديات السامة.
15- أي مخالفة = ميوت.

🔥 شات نظيف.`,

voice:
`🎧 قوانين الفويس:

1- يمنع الصراخ أو الإزعاج.
2- يمنع تشغيل أصوات مزعجة.
3- احترام الموجودين واجب.
4- يمنع المقاطعة.
5- يمنع تشغيل موسيقى بدون إذن.
6- يمنع تسجيل الصوت.
7- يمنع الدخول والخروج المتكرر.
8- يمنع التخريب.
9- يمنع المؤثرات المزعجة.
10- الالتزام بالهدوء.
11- الإدارة لها حق إخراجك.
12- أي إزعاج = عقوبة.
13- لا تزعج الآخرين.
14- كن محترم.
15- استمتع بدون تخريب.

🔥 فويس راقي.`,

security:
`🛡️ قوانين الأمن:

1- يمنع نشر روابط خبيثة.
2- يمنع إرسال ملفات مجهولة.
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
13- أي تهديد = باند.
14- الأمن أولًا.
15- التزم للحماية.

🔥 أمان كامل.`,

staff:
`👑 قوانين الإدارة:

1- الإدارة تمثل السيرفر.
2- يمنع استغلال الصلاحيات.
3- يمنع إعطاء رتب بدون سبب.
4- التعامل بعدل مع الجميع.
5- الرد بأسلوب محترم.
6- يمنع الظلم.
7- أي خطأ = محاسبة.
8- يمنع التهديد بالرتبة.
9- احترام الأعضاء واجب.
10- القرار للأونر.
11- لا تحذف بدون سبب.
12- لا تسيء استخدام البوت.
13- كن قدوة.
14- الالتزام مهم.
15- الإدارة مسؤولية.

🔥 إدارة قوية.`
};

// ==========================
// 🎯 القائمة
// ==========================client.on("interactionCreate", async (interaction) => {
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
