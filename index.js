const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

/* ================= PING SERVER ================= */
const app = express();
app.get("/", (req, res) => {
  res.send("Bot is alive ✅");
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
  console.log(`${client.user.tag} is online`);
});

/* ================= JOIN DETECT ================= */
client.on("guildMemberAdd", member => {

  const channel = member.guild.channels.cache.get("1459543428730847315");
  if (!channel) return;

  // Account age
  const created = member.user.createdAt;
  const now = new Date();
  const years = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(
    ((now - created) / (1000 * 60 * 60 * 24 * 30)) % 12
  );

  const embed = new EmbedBuilder()
    .setColor(0xE10600) // 🔴 Professional Red
    .setTitle(`WELCOME • ${member.user.username}`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
    .setDescription(
      `**${member.user.tag}** has joined **${member.guild.name}**.\n\n` +
      `Please read the rules and enjoy your stay.`
    )
    .addFields(
      { name: "🏠 Server", value: member.guild.name, inline: true },
      { name: "⏳ Account Age", value: `${years}y ${months}m`, inline: true }
    )
    .setFooter({
      text: `${member.guild.name} • Welcome System`,
      iconURL: member.guild.iconURL({ dynamic: true })
    })
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

/* ================= LOGIN ================= */
client.login(process.env.TOKEN);
