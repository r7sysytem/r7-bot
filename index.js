const {
  AttachmentBuilder
} = require("discord.js");

const {
  createCanvas,
  loadImage,
  GlobalFonts
} = require("@napi-rs/canvas");

const WELCOME_CHANNEL_ID = "1481342024891371674";
const AZKAR_CHANNEL_ID = "1376496339935952896";

const WELCOME_BACKGROUND =
  "https://cdn.discordapp.com/attachments/1481671050671427746/1504469636895477760/IMG_0964.jpg?ex=6a071a09&is=6a05c889&hm=8a4c62d8bf86c4c2d0a6e347f3d8af064eaccc61d80aaff8036c1b5dccd19d3c&";

const azkarList = [
  "📿 سبحان الله وبحمده، سبحان الله العظيم.",
  "🤍 لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.",
  "📿 أستغفر الله العظيم وأتوب إليه.",
  "🤍 اللهم صل وسلم على نبينا محمد.",
  "📿 لا حول ولا قوة إلا بالله.",
  "🤍 حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.",
  "📿 سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر.",
  "🤍 اللهم اجعل هذا اليوم خيراً، وراحة، وطمأنينة لكل من قرأ."
];

client.on("guildMemberAdd", async function (member) {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return;

  try {
    const canvas = createCanvas(1024, 500);
    const ctx = canvas.getContext("2d");

    const background = await loadImage(WELCOME_BACKGROUND);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const avatarURL = member.user.displayAvatarURL({
      extension: "png",
      size: 512
    });

    const avatar = await loadImage(avatarURL);

    ctx.save();
    ctx.beginPath();
    ctx.arc(512, 150, 95, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 417, 55, 190, 190);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(512, 150, 100, 0, Math.PI * 2, true);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    ctx.font = "bold 46px Arial";
    ctx.fillText(member.user.username, 512, 300);

    ctx.font = "bold 34px Arial";
    ctx.fillText("نورت السيرفر يا جميل 🤍", 512, 355);

    ctx.font = "26px Arial";
    ctx.fillText("وجودك زاد المكان جمال، نتمنى لك وقت ممتع معنا", 512, 405);

    const attachment = new AttachmentBuilder(await canvas.encode("png"), {
      name: "welcome.png"
    });

    await channel.send({
      content:
        member.toString() +
        "\n\n" +
        "ياهلا والله 🤍\n" +
        "نورت السيرفر، وجودك بيننا يسعدنا ويشرفنا.\n" +
        "استمتع معنا، وخلّك قريب من الفعاليات والتبادل وكل جديد.",
      files: [attachment]
    });
  } catch (error) {
    console.log(error);
  }
});

client.once("ready", function () {
  setInterval(async function () {
    const channel = client.channels.cache.get(AZKAR_CHANNEL_ID);
    if (!channel) return;

    const random =
      azkarList[Math.floor(Math.random() * azkarList.length)];

    channel.send(random).catch(function () {});
  }, 7200000);
});
