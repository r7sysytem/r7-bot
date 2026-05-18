const {
  Client,
  GatewayIntentBits,
  AttachmentBuilder,
  Partials
} = require("discord.js");

const {
  createCanvas,
  loadImage
} = require("@napi-rs/canvas");

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const WELCOME_CHANNEL_ID = "1481342024891371674";
const RULES_CHANNEL_ID = "1481351750634963054";
const CHAT_CHANNEL_ID = "1376496339935952896";

const BACKGROUND =
"https://cdn.discordapp.com/attachments/1481671050671427746/1504469636895477760/IMG_0964.jpg?ex=6a071a09&is=6a05c889&hm=8a4c62d8bf86c4c2d0a6e347f3d8af064eaccc61d80aaff8036c1b5dccd19d3c&";

const reminders = [
  "📿 سبحان الله وبحمده، سبحان الله العظيم.",
  "🤍 اللهم صل وسلم على نبينا محمد.",
  "📿 أستغفر الله العظيم وأتوب إليه.",
  "🤍 لا حول ولا قوة إلا بالله.",
  "📿 لا إله إلا الله وحده لا شريك له."
];

client.once("ready", function () {

  console.log("Bot online: " + client.user.tag);

  setInterval(async function () {

    const channel =
      client.channels.cache.get(CHAT_CHANNEL_ID);

    if (!channel) return;

    const random =
      reminders[Math.floor(Math.random() * reminders.length)];

    channel.send(
      "╭・🌙・تذكير لطيف\n\n" +
      random +
      "\n\n🤍 لا تنسون الذكر والصلاة على النبي."
    ).catch(function () {});

  }, 7200000);

});

client.on("guildMemberAdd", async function (member) {

  try {

    const channel =
      member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

    if (!channel) return;

    const canvas =
      createCanvas(1024, 500);

    const ctx =
      canvas.getContext("2d");

    const background =
      await loadImage(BACKGROUND);

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

    const avatar =
      await loadImage(
        member.user.displayAvatarURL({
          extension: "png",
          size: 512
        })
      );

    ctx.save();

    ctx.beginPath();

    ctx.arc(
      512,
      170,
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
      75,
      190,
      190
    );

    ctx.restore();

    ctx.beginPath();

    ctx.arc(
      512,
      170,
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
      360
    );

    ctx.font = "bold 34px Arial";

    ctx.fillText(
      "نورت السيرفر يا جميل 🤍",
      512,
      420
    );

    const attachment =
      new AttachmentBuilder(
        await canvas.encode("png"),
        {
          name: "welcome.png"
        }
      );

    channel.send({
      content:
        "╭・🎉・ياهلا والله " +
        member.toString() +
        "\n\n🤍 نورت السيرفر بالكامل.\n" +
        "📜 القوانين: <#" + RULES_CHANNEL_ID + ">\n" +
        "💬 الشات: <#" + CHAT_CHANNEL_ID + ">",
      files: [attachment]
    });

  } catch (error) {

    console.log(error);

  }

});

client.login(TOKEN);
