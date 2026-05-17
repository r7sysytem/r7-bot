const {
  Client,
  GatewayIntentBits,
  Partials,
  AttachmentBuilder
} = require("discord.js");

const {
  createCanvas,
  loadImage
} = require("@napi-rs/canvas");

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

const WELCOME_CHANNEL_ID = "1481342024891371674";
const RULES_CHANNEL_ID = "1481351750634963054";
const CHAT_CHANNEL_ID = "1376496339935952896";

const WELCOME_BACKGROUND =
  "https://cdn.discordapp.com/attachments/1481671050671427746/1504469636895477760/IMG_0964.jpg?ex=6a071a09&is=6a05c889&hm=8a4c62d8bf86c4c2d0a6e347f3d8af064eaccc61d80aaff8036c1b5dccd19d3c&";

const azkarList = [
  "📿 سبحان الله وبحمده، سبحان الله العظيم.",
  "🤍 لا إله إلا الله وحده لا شريك له.",
  "📿 أستغفر الله العظيم وأتوب إليه.",
  "🤍 اللهم صل وسلم على نبينا محمد.",
  "📿 لا حول ولا قوة إلا بالله.",
  "🤍 حسبي الله ونعم الوكيل.",
  "📿 سبحان الله، والحمد لله، والله أكبر.",
  "🤍 الله يكتب لكم راحة وسعادة لا تنتهي."
];

client.once("ready", async function () {

  console.log("Bot online: " + client.user.tag);

  /* تسجيل أوامر السلاش */
  client.application.commands.set([
    {
      name: "ping",
      description: "معرفة حالة البوت"
    },
    {
      name: "avatar",
      description: "عرض صورة شخص",
      options: [
        {
          name: "user",
          description: "اختر الشخص",
          type: 6,
          required: false
        }
      ]
    },
    {
      name: "server",
      description: "معلومات السيرفر"
    },
    {
      name: "azkar",
      description: "أذكار عشوائية"
    },
    {
      name: "roulette",
      description: "لعبة الروليت"
    },
    {
      name: "mafia",
      description: "لعبة المافيا"
    },
    {
      name: "say",
      description: "إرسال رسالة",
      options: [
        {
          name: "text",
          description: "اكتب الرسالة",
          type: 3,
          required: true
        }
      ]
    }
  ]);

  /* الأذكار كل ساعتين */
  setInterval(async function () {

    const channel =
      client.channels.cache.get(CHAT_CHANNEL_ID);

    if (!channel) return;

    const random =
      azkarList[
        Math.floor(Math.random() * azkarList.length)
      ];

    channel.send(
      "╭・🌙・تذكير لطيف\n\n" +
      random +
      "\n\n🤍 لا تنسون الذكر والصلاة على النبي.\n" +
      "💬 شاركوا بالشات وتفاعلوا وخلو المكان مليان طاقة جميلة.\n" +
      "✨ وجودكم يصنع فرق بالسيرفر."
    ).catch(function () {});

  }, 7200000);

});

/* نظام الترحيب */
client.on("guildMemberAdd", async function (member) {

  const channel =
    member.guild.channels.cache.get(
      WELCOME_CHANNEL_ID
    );

  if (!channel) return;

  try {

    const canvas =
      createCanvas(1024, 500);

    const ctx =
      canvas.getContext("2d");

    const background =
      await loadImage(WELCOME_BACKGROUND);

    ctx.drawImage(
      background,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle =
      "rgba(0,0,0,0.45)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const avatarURL =
      member.user.displayAvatarURL({
        extension: "png",
        size: 512
      });

    const avatar =
      await loadImage(avatarURL);

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      512,
      150,
      95,
      0,
      Math.PI * 2,
      true
    );

    ctx.closePath();

    ctx.clip();

    ctx.drawImage(
      avatar,
      417,
      55,
      190,
      190
    );

    ctx.restore();

    ctx.beginPath();

    ctx.arc(
      512,
      150,
      100,
      0,
      Math.PI * 2,
      true
    );

    ctx.lineWidth = 8;

    ctx.strokeStyle = "#ffffff";

    ctx.stroke();

    ctx.fillStyle = "#ffffff";

    ctx.textAlign = "center";

    ctx.font = "bold 48px Arial";

    ctx.fillText(
      member.user.username,
      512,
      320
    );

    ctx.font = "bold 34px Arial";

    ctx.fillText(
      "نورت السيرفر يا جميل 🤍",
      512,
      380
    );

    const attachment =
      new AttachmentBuilder(
        await canvas.encode("png"),
        {
          name: "welcome.png"
        }
      );

    await channel.send({
      content:
        "╭・🎉・ياهلا والله " +
        member.toString() +
        "\n\n🤍 نورت السيرفر بالكامل، وجودك بيننا يسعدنا ويضيف جو رهيب للمكان.\n" +
        "✨ نتمنى لك وقت ممتع، فعاليات، سوالف، ناس فخمة وتفاعل أسطوري.\n\n" +
        "📜 لتجنب أي عقوبة أو مخالفة نرجو قراءة القوانين:\n" +
        "<#" +
        RULES_CHANNEL_ID +
        ">\n\n💬 ولا تنسى تشارك بالشات وتتعرف على الأعضاء:\n" +
        "<#" +
        CHAT_CHANNEL_ID +
        ">\n\n🔥 شد حيلك بالتفاعل ويمكن تصير من المشهورين بالسيرفر.\n" +
        "🤍 استمتع معنا وخلك قريب من الجميع.",
      files: [attachment]
    });

  } catch (error) {

    console.log(error);

  }

});

/* أوامر السلاش */
client.on("interactionCreate", async interaction => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {

    interaction.reply("🏓 البوت شغال!");

  }

  if (interaction.commandName === "avatar") {

    const user =
      interaction.options.getUser("user") ||
      interaction.user;

    interaction.reply({
      embeds: [
        {
          color: 0xffffff,
          title: `🖼️ صورة ${user.username}`,
          image: {
            url:
              user.displayAvatarURL({
                size: 1024
              })
          }
        }
      ]
    });

  }

  if (interaction.commandName === "server") {

    interaction.reply({
      embeds: [
        {
          color: 0xffffff,
          title: "📊 معلومات السيرفر",
          description:
            `👥 الأعضاء: ${interaction.guild.memberCount}\n` +
            `🆔 الأيدي: ${interaction.guild.id}\n` +
            `👑 المالك: <@${interaction.guild.ownerId}>`
        }
      ]
    });

  }

  if (interaction.commandName === "azkar") {

    const azkar = [
      "📿 سبحان الله وبحمده سبحان الله العظيم",
      "🤍 اللهم صل وسلم على نبينا محمد",
      "📿 أستغفر الله العظيم وأتوب إليه",
      "🤍 لا حول ولا قوة إلا بالله",
      "📿 لا إله إلا الله وحده لا شريك له"
    ];

    const random =
      azkar[
        Math.floor(Math.random() * azkar.length)
      ];

    interaction.reply(random);

  }

  if (interaction.commandName === "roulette") {

    const number =
      Math.floor(Math.random() * 6) + 1;

    if (number === 1) {

      interaction.reply(
        "💀 طلعت عليك الرصاصة وخسرت!"
      );

    } else {

      interaction.reply(
        "😮‍💨 نجوت هالمرة!"
      );

    }

  }

  if (interaction.commandName === "mafia") {

    const roles = [
      "🕵️ مافيا",
      "👮 شرطي",
      "💉 دكتور",
      "😎 مواطن"
    ];

    const role =
      roles[
        Math.floor(Math.random() * roles.length)
      ];

    interaction.reply(
      `🎭 دورك هو: ${role}`
    );

  }

  if (interaction.commandName === "say") {

    const text =
      interaction.options.getString("text");

    interaction.reply({
      content: "✅ تم الإرسال",
      ephemeral: true
    });

    interaction.channel.send(text);

  }

});

client.login(TOKEN);
