client.on("messageCreate", async message => {

if (message.author.bot) return;

if (message.content === "قوانين") {

const {
EmbedBuilder,
ActionRowBuilder,
StringSelectMenuBuilder
} = require("discord.js");

const rulesEmbed = new EmbedBuilder()

.setColor("#050505")

.setAuthor({
name: "R7 COMMUNITY",
iconURL: client.user.displayAvatarURL()
})

.setTitle("📜 قوانين سيرفر R7 COMMUNITY")

.setDescription(`
> مرحبًا بك في **R7 COMMUNITY**
> نرجو منك قراءة القوانين كاملة قبل التفاعل داخل السيرفر لتجنب أي مخالفة أو عقوبة.
> هدفنا صناعة مجتمع احترافي، ممتع وآمن للجميع 🔥

━━━━━━━━━━━━━━━━━━

🧠 | **القوانين العامة**
• احترام جميع الأعضاء واجب مهما كانت الرتبة أو العمر.  
• يمنع السب، التنمر، الاستفزاز أو التقليل من الآخرين.  
• يمنع نشر العنصرية أو الكلام المسيء للدين.  
• يمنع التهديد أو التخويف أو إثارة المشاكل عمدًا.  
• يمنع نشر معلومات شخصية لأي شخص بدون إذنه.  

━━━━━━━━━━━━━━━━━━

💬 | **قوانين الشات**
• يمنع السبام، التكرار أو التخريب بالشاتات.  
• استخدم كل روم في الغرض المخصص له فقط.  
• يمنع إرسال روابط مشبوهة أو إعلانات بدون إذن.  
• يمنع المحتوى غير اللائق أو المزعج.  
• حافظ على أسلوبك وخل تفاعلك محترم 🔥

━━━━━━━━━━━━━━━━━━

🎤 | **قوانين الفويس**
• يمنع الإزعاج أو تشغيل أصوات مزعجة.  
• يمنع تخريب جلسات الفويس أو التشويش المتعمد.  
• احترام الموجودين داخل الفويس إلزامي.  
• يمنع تشغيل المقاطع المسيئة أو المخلة.  

━━━━━━━━━━━━━━━━━━

🛡️ | **قوانين الأمن**
• يمنع انتحال شخصيات الإدارة أو الأعضاء.  
• يمنع نشر أي ملفات أو روابط ضارة.  
• أي محاولة تهكير أو تخريب تعرضك للباند النهائي.  
• الحفاظ على حسابك مسؤوليتك الشخصية.  

━━━━━━━━━━━━━━━━━━

👑 | **قوانين الإدارة**
• الإدارة موجودة لتنظيم السيرفر وليس للظلم.  
• يمنع التقليل من الإدارة أو الاستهزاء بقراراتها.  
• يمنع طلب الرتب أو الإزعاج عليها.  
• إذا عندك مشكلة افتح تكت بكل احترام.  

━━━━━━━━━━━━━━━━━━

🔄 | **قوانين التبادل**
• التبادل على مسؤوليتك الشخصية.  
• يمنع النصب أو الاحتيال بجميع أنواعه.  
• استخدم الوسطاء الرسميين عند الحاجة.  
• يمنع سرقة العروض أو التخريب على الأعضاء.  
• أي عملية نصب مثبتة = حظر نهائي بدون نقاش ⚠️

━━━━━━━━━━━━━━━━━━

📢 | **التفاعل والدعم**
• تفاعلك يصنع مجتمع أقوى 🔥  
• شارك بالشات والفويس والفعاليات.  
• دعمك للسيرفر يساعدنا نقدم أنظمة وتطويرات أفضل.  
• الأعضاء المتفاعلين يحصلون على مميزات مستقبلية 👀

━━━━━━━━━━━━━━━━━━

⚠️ | **مهم جدًا**
> لتجنب أي عقوبة نرجو الالتزام الكامل بالقوانين.  
> الإدارة لها الحق الكامل باتخاذ القرار المناسب للحفاظ على أمان المجتمع.

━━━━━━━━━━━━━━━━━━

✨ | **R7 COMMUNITY**
مجتمع احترافي • فعاليات • تفاعل • تبادل • دعم • أمان 🔥
`)

.setImage("https://cdn.discordapp.com/attachments/1481671050671427746/1506254111199199332/D1F1417C-4103-40AA-AE79-198E1DDDA686.png?ex=6a0d97f4&is=6a0c4674&hm=6bc71ee83f18df591a6d2d0c49a83e8e7186beae6b7980177f77044db12af832&")

.setFooter({
text: "R7 COMMUNITY • Rules System",
iconURL: client.user.displayAvatarURL()
})

.setTimestamp();

const rulesMenu = new ActionRowBuilder().addComponents(

new StringSelectMenuBuilder()

.setCustomId("rules_menu")

.setPlaceholder("📚 اختر قسم القوانين")

.addOptions([

{
label: "القوانين العامة",
description: "General Rules",
value: "general",
emoji: "📜"
},

{
label: "قوانين الشات",
description: "Chat Rules",
value: "chat",
emoji: "💬"
},

{
label: "قوانين الفويس",
description: "Voice Rules",
value: "voice",
emoji: "🎤"
},

{
label: "قوانين الأمن",
description: "Security Rules",
value: "security",
emoji: "🛡️"
},

{
label: "قوانين الإدارة",
description: "Staff Rules",
value: "staff",
emoji: "👑"
},

{
label: "قوانين التبادل",
description: "Trading Rules",
value: "trade",
emoji: "🔄"
},

{
label: "قوانين إضافية",
description: "Extra Rules",
value: "extra",
emoji: "⚠️"
}

])

);

message.channel.send({
embeds: [rulesEmbed],
components: [rulesMenu]
});

}

});

client.login(TOKEN);
