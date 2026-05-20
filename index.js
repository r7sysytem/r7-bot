const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  SlashCommandBuilder,
  REST,
  Routes
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const IMAGE_URL = "https://cdn.discordapp.com/attachments/1481671050671427746/1506254111199199332/D1F1417C-4103-40AA-AE79-198E1DDDA686.png?ex=6a0d97f4&is=6a0c4674&hm=6bc71ee83f18df591a6d2d0c49a83e8e7186beae6b7980177f77044db12af832&";

const commands = [
  new SlashCommandBuilder()
    .setName("rules")
    .setDescription("يعرض قوانين السيرفر")
].map(command => command.toJSON());

client.once("ready", async () => {
  console.log("Bot online: " + client.user.tag);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands }
  );

  console.log("Slash command /rules registered");
});

client.on("interactionCreate", async interaction => {

  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === "rules") {

      const embed = new EmbedBuilder()
        .setColor("#050505")
        .setTitle("📜 قوانين سيرفر R7 COMMUNITY")
        .setDescription(`
> أهلاً بك في **R7 COMMUNITY**
> الرجاء اختيار قسم القوانين من القائمة بالأسفل.

⚠️ عدم قراءة القوانين لا يعفيك من العقوبة.
        `)
        .setImage(IMAGE_URL)
        .setFooter({
          text: "R7 COMMUNITY • Rules System",
          iconURL: client.user.displayAvatarURL()
        });

      const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("rules_menu")
          .setPlaceholder("📚 اختر قسم القوانين")
          .addOptions([
            { label: "القوانين العامة", value: "general", emoji: "📜" },
            { label: "قوانين الشات", value: "chat", emoji: "💬" },
            { label: "قوانين الفويس", value: "voice", emoji: "🎤" },
            { label: "قوانين الأمن", value: "security", emoji: "🛡️" },
            { label: "قوانين الإدارة", value: "staff", emoji: "👑" },
            { label: "قوانين التبادل", value: "trade", emoji: "🔄" },
            { label: "قوانين إضافية", value: "extra", emoji: "⚠️" }
          ])
      );

      await interaction.reply({
        embeds: [embed],
        components: [menu]
      });
    }

    return;
  }

  if (interaction.isStringSelectMenu()) {

    if (interaction.customId !== "rules_menu") return;

    const rules = {
      general: {
        title: "📜 القوانين العامة",
        text: `
• احترام جميع الأعضاء واجب مهما كانت الرتبة أو العمر.
• يمنع السب أو الاستهزاء أو التقليل من أي عضو.
• يمنع التنمر، الاستفزاز، أو محاولة إشعال المشاكل.
• يمنع نشر العنصرية أو الطائفية أو الإساءة للدين.
• يمنع التهديد أو التخويف بأي شكل.
• يمنع نشر معلومات شخصية لأي شخص.
• يمنع انتحال شخصية عضو أو إداري.
• يمنع استخدام أسماء أو صور مخالفة.
• يمنع نشر محتوى غير مناسب.
• الإدارة لها الحق في اتخاذ العقوبة المناسبة حسب الحالة.

⚠️ دخولك للسيرفر يعني موافقتك على القوانين.
`
      },

      chat: {
        title: "💬 قوانين الشات",
        text: `
• يمنع السبام والتكرار المزعج.
• يمنع إرسال نفس الرسالة أكثر من مرة.
• استخدم كل روم لغرضه الصحيح.
• يمنع الإعلانات أو الروابط بدون إذن.
• يمنع نشر روابط مشبوهة أو ملفات خطيرة.
• يمنع الكلام الخارج أو المحتوى غير اللائق.
• يمنع الإزعاج بالمنشن المتكرر.
• يمنع إثارة النقاشات الحساسة أو المشاكل.
• حافظ على أسلوب محترم مع الجميع.
• أي تخريب متعمد يعرضك للعقوبة.

🔥 الشات للتفاعل، الضحك، الفعاليات، والسوالف الجميلة.
`
      },

      voice: {
        title: "🎤 قوانين الفويس",
        text: `
• يمنع تشغيل أصوات مزعجة أو عالية.
• يمنع تخريب الفويس أو التشويش على الأعضاء.
• يمنع دخول الفويس فقط للإزعاج.
• يمنع تشغيل مقاطع مسيئة أو غير لائقة.
• يمنع السب أو الاستفزاز داخل الفويس.
• احترام الموجودين بالفويس إلزامي.
• يمنع استخدام برامج تغيير الصوت للإزعاج.
• يمنع تسجيل الأعضاء بدون إذن.
• أي إزعاج متكرر يؤدي لميوت أو عقوبة.

🎧 الفويس مكان للوناسة، مو للمشاكل.
`
      },

      security: {
        title: "🛡️ قوانين الأمن",
        text: `
• يمنع نشر روابط اختراق أو ملفات ضارة.
• يمنع محاولة تهكير أو تخريب السيرفر.
• يمنع انتحال الإدارة أو البوتات.
• يمنع إرسال روابط ديسكورد مشبوهة.
• لا تشارك معلومات حسابك مع أي شخص.
• الإدارة لا تطلب كلمة مرورك أبدًا.
• أي محاولة نصب أو تهديد = باند.
• حماية حسابك مسؤوليتك الشخصية.
• البلاغ عن أي شخص مشبوه يكون عبر التكت.

🛡️ الأمان أهم شيء داخل R7 COMMUNITY.
`
      },

      staff: {
        title: "👑 قوانين الإدارة",
        text: `
• احترام الإدارة واجب.
• يمنع الاستهزاء بقرارات الإدارة.
• يمنع طلب الرتب أو الإزعاج عليها.
• إذا عندك شكوى افتح تكت باحترام.
• الإدارة تتعامل حسب القوانين والموقف.
• يمنع الكذب على الإدارة.
• يمنع محاولة استفزاز الإداريين.
• قرارات الإدارة هدفها حماية السيرفر.
• أي إساءة للإدارة قد تعرضك للعقوبة.
• لا تناقش العقوبة في العام، افتح تكت.

👑 الإدارة لخدمة وتنظيم المجتمع.
`
      },

      trade: {
        title: "🔄 قوانين التبادل",
        text: `
• التبادل على مسؤوليتك الشخصية.
• يمنع النصب أو الاحتيال بأي شكل.
• استخدم وسيط رسمي إذا الصفقة مهمة.
• يمنع سرقة عروض الأعضاء.
• يمنع التخريب على عروض الآخرين.
• يمنع إرسال عروض وهمية.
• يمنع التلاعب أو الكذب في التبادل.
• أي نصب مثبت = باند نهائي.
• الإدارة غير مسؤولة عن تبادل خارج النظام.
• التزم برومات التبادل المخصصة.

⚠️ لا تثق بأي شخص بدون ضمان أو وسيط.
`
      },

      extra: {
        title: "⚠️ قوانين إضافية",
        text: `
• يمنع استغلال الثغرات أو الأخطاء.
• يمنع التحايل على العقوبات.
• يمنع الدخول بحسابات بديلة لتجنب العقوبة.
• يمنع نشر الشائعات أو تشويه سمعة السيرفر.
• يمنع طلب الخاص بشكل مزعج.
• يمنع نشر محتوى مخالف للديسكورد.
• يمنع إساءة استخدام البوتات.
• يمنع تخريب الفعاليات.
• دعمك وتفاعلك يساعدنا نطور السيرفر أكثر.
• العضو المحترم والمتفاعل له مكانة خاصة عندنا.

✨ خلك عضو أسطوري، واترك بصمة جميلة بالسيرفر.
`
      }
    };

    const selected = rules[interaction.values[0]];

    const embed = new EmbedBuilder()
      .setColor("#050505")
      .setTitle(selected.title)
      .setDescription(selected.text)
      .setFooter({
        text: "R7 COMMUNITY • Rules System",
        iconURL: client.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);
