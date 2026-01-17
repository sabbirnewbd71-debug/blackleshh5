const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");

/* ================= LIVE MESSAGE STORAGE ================= */
let welcomeText =
  "আমাদের সার্ভারে আপনাকে স্বাগতম। অনুগ্রহ করে নিয়মগুলো পড়ে নিন।";

/* ================= WEB SERVER ================= */
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Ping route
app.get("/", (req, res) => {
  res.send("✅ বট চালু আছে");
});

// Admin panel
app.get("/admin", (req, res) => {
  res.send(`
    <h2>🔴 Welcome Message Control</h2>
    <form method="POST">
      <textarea name="text" rows="6" cols="50">${welcomeText}</textarea><br><br>
      <button type="submit">Save Message</button>
    </form>
  `);
});

app.post("/admin", (req, res) => {
  welcomeText = req.body.text || welcomeText;
  res.send("✅ Message আপডেট হয়েছে! <a href='/admin'>ফিরে যাও</a>");
});

app.listen(process.env.PORT || 3000);

/* ================= DISCORD BOT ================= */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log(`🤖 বট অনলাইন: ${client.user.tag}`);
});

/* ================= JOIN DETECT ================= */
client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.cache.get("1459543428730847315");
  if (!channel) return;

  const createdAt = member.user.createdAt;
  const now = new Date();
  const days = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);

  const embed = new EmbedBuilder()
    .setColor(0xE10600)
    .setTitle(`👋 স্বাগতম ${member.user.username}`)
    .setDescription(
      `**${member.user.tag}** আমাদের **${member.guild.name}** সার্ভারে যোগ দিয়েছেন।\n\n` +
      `📝 **বার্তা:**\n${welcomeText}`
    )
    .addFields(
      { name: "🏠 সার্ভার", value: member.guild.name, inline: true },
      { name: "⏳ অ্যাকাউন্ট বয়স", value: `${years} বছর ${months} মাস`, inline: true }
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

/* ================= LOGIN ================= */
client.login(process.env.TOKEN);
