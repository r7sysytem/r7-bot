const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  SlashCommandBuilder,
  REST,
  Routes
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("rules")
    .setDescription("عرض قوانين السيرفر")
].map(command => command.toJSON());

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: commands }
  );

  console.log("Rules command registered ✅");
});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "rules") {
        const embed = new EmbedBuilder()
          .setColor(0x6c2cff)
          .setTitle("📜 قوانين سيرفر R7")
          .setDescription("اختر قسم القوانين من القائمة بالأسفل 👇")
          .setFooter({ text: "SERVER R7 | Rules Panel" });

        const menu = new StringSelectMenuBuilder()
          .setCustomId("rules_menu")
          .setPlaceholder("اختر قسم القوانين")
          .addOptions(
            {
              label: "القوانين العامة",
              description: "الاحترام والنظام العام",
              value: "general",
              emoji: "📖"
            },
            {
              label: "قوانين الشات",
              description: "قوانين الكتابة والتفاعل",
              value: "chat",
              emoji: "💬"
            },
            {
              label: "قوانين الفويس",
              description: "قوانين الرومات الصوتية",
              value: "voice",
              emoji: "🎧"
            },
            {
              label: "قوانين الأمن",
              description: "الحماية والروابط والحسابات",
              value: "security",
              emoji: "🛡️"
            },
            {
              label: "قوانين الإدارة",
              description: "قوانين طاقم الإدارة",
              value: "staff",
              emoji: "👑"
            }
          );

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
          embeds: [embed],
          components: [row]
        });
      }
    }

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId !== "rules_menu") return;

      const rules = {
        general: {
          title: "📖 القوانين العامة",
          text:
            "1- الاحترام واجب للجميع دون استثناء.\n" +
            "2- يمنع السب أو الشتم أو التنمر بأي شكل.\n" +
            "3- يمنع نشر أي محتوى غير لائق أو مخالف.\n" +
            "4- يمنع انتحال شخصية أي عضو أو إداري.\n" +
            "5- يمنع إثارة المشاكل أو الفتن بين الأعضاء.\n" +
            "6- الالتزام بتعليمات الإدارة أمر إلزامي.\n" +
            "7- يمنع نشر أو طلب معلومات شخصية.\n" +
            "8- دخولك السيرفر يعني موافقتك على القوانين."
        },
        chat: {
          title: "💬 قوانين الشات",
          text:
            "1- يمنع السبام وتكرار الرسائل.\n" +
            "2- يمنع المنشن العشوائي بدون سبب.\n" +
            "3- يمنع نشر روابط أو إعلانات بدون إذن.\n" +
            "4- التزم بموضوع كل روم.\n" +
            "5- يمنع الاستفزاز وإثارة المشاكل.\n" +
            "6- استخدم أسلوب محترم مع الجميع.\n" +
            "7- يمنع نشر محتوى مكرر أو مزعج."
        },
        voice: {
          title: "🎧 قوانين الفويس",
          text:
            "1- يمنع الإزعاج أو تشغيل أصوات عالية.\n" +
            "2- يمنع الصراخ أو المقاطعة المتعمدة.\n" +
            "3- يمنع تشغيل موسيقى بدون إذن الموجودين.\n" +
            "4- يمنع تسجيل الصوت بدون موافقة.\n" +
            "5- يمنع الدخول والخروج المتكرر للإزعاج.\n" +
            "6- احترام الموجودين في الروم واجب."
        },
        security: {
          title: "🛡️ قوانين الأمن",
          text:
            "1- يمنع نشر روابط مشبوهة أو خبيثة.\n" +
            "2- يمنع إرسال ملفات غير موثوقة.\n" +
            "3- يمنع النصب أو الاحتيال بأي شكل.\n" +"4- لا تشارك كلمة مرورك أو توكنك.\n" +
            "5- أي محاولة تهكير = باند مباشر.\n" +
            "6- يمنع استغلال البوتات أو الثغرات.\n" +
            "7- الإبلاغ عن أي خطر يساعد على حماية السيرفر."
        },
        staff: {
          title: "👑 قوانين الإدارة",
          text:
            "1- الإدارة تمثل السيرفر ويجب التحلي بالاحترام.\n" +
            "2- يمنع إساءة استخدام الصلاحيات.\n" +
            "3- يمنع إعطاء رتب بدون سبب واضح.\n" +
            "4- يجب التعامل مع الأعضاء بعدل وبدون تحيز.\n" +
            "5- أي مخالفة إدارية قد تؤدي لسحب الرتبة.\n" +
            "6- القرار النهائي يرجع للأونر."
        }
      };

      const selected = rules[interaction.values[0]];

      const embed = new EmbedBuilder()
        .setColor(0x6c2cff)
        .setTitle(selected.title)
        .setDescription(selected.text)
        .setFooter({ text: "SERVER R7 | Rules" });

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }
  } catch (error) {
    console.error(error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "صار خطأ، جرّب مرة ثانية.",
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
