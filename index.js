// Discord.js
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

// Firebase v9 Modular SDK (Node.js)
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set } = require("firebase/database");

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDgcOMktV2WUxwJoh0ySBPzfhwicxxb7sM",
  authDomain: "admin-4bc65.firebaseapp.com",
  databaseURL: "https://admin-4bc65-default-rtdb.firebaseio.com",
  projectId: "admin-4bc65",
  storageBucket: "admin-4bc65.firebasestorage.app",
  messagingSenderId: "1049052911788",
  appId: "1:1049052911788:web:17343a2b41154c7e0d2709",
  measurementId: "G-03ZQ7CJTSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Discord Bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Flashy embed arrays
const colors = [0xFF0000,0xFF4500,0xFF6347,0xFF1493,0xFF69B4];
const titleEmojis = ["✨","🎉","💫","🌟","🔥"];
const fancyFonts = ["𝗪𝗘𝗟𝗖𝗢𝗠𝗘","𝓦𝓔𝓛𝓒𝓞𝓜𝓔","𝑾𝑬𝑳𝑪𝑶𝑴𝑬","🄆🄴🄻🄲🄾🄼🄴","🌟WELCOME🌟"];
const textEmojis = ["💌","📢","📯","🎈","🌈"];

let joinQueue = []; // Carousel queue

client.once("ready", ()=>console.log(`🤖 Bot online: ${client.user.tag}`));

// New member join
client.on("guildMemberAdd", async member=>{
  joinQueue.push(member);
  if(joinQueue.length === 1){
    runCarousel(member.guild);
  }
});

// Carousel function
async function runCarousel(guild){
  while(joinQueue.length > 0){
    const member = joinQueue[0];
    const channel = guild.channels.cache.get("1459543428730847315");
    if(!channel){
      joinQueue.shift();
      continue;
    }

    const createdAt = member.user.createdAt;
    const now = new Date();
    const days = Math.floor((now - createdAt)/(1000*60*60*24));
    const years = Math.floor(days/365);
    const months = Math.floor((days%365)/30);
    const memberCount = guild.memberCount;

    // Inviter detection
    let inviter = "Unknown";
    try{
      const invites = await guild.invites.fetch();
      invites.forEach(inv=>{
        if(inv.uses>0) inviter=inv.inviter.tag;
      });
    }catch(e){}

    const gifThumbnail = "https://cdn.jsdelivr.net/gh/dsabbir111/yghjjhhjK@refs/heads/main/350kb.gif";

    // Get live welcome message from Firebase
    const snapshot = await get(ref(db, 'welcomeMessage'));
    const liveMessage = snapshot.exists()?snapshot.val():"✨ আমাদের সার্ভারে স্বাগতম 🎉";

    const embed = new EmbedBuilder()
      .setColor(colors[0])
      .setTitle(`${titleEmojis[0]} ${fancyFonts[0]} • ${member.user.username} ${titleEmojis[0]}`)
      .setThumbnail(gifThumbnail)
      .setDescription(`${textEmojis[0]} **${member.user.tag}** আমাদের **${guild.name}** সার্ভারে যোগ দিয়েছেন!\n\n${textEmojis[1]} ${liveMessage}`)
      .addFields(
        { name:"🏠 সার্ভারের নাম", value:guild.name, inline:true },
        { name:"⏳ অ্যাকাউন্ট বয়স", value:`${years} বছর ${months} মাস`, inline:true },
        { name:"👤 Invite দ্বারা join করেছেন", value:inviter, inline:true },
        { name:"👥 মোট সদস্য সংখ্যা", value:`${memberCount}`, inline:true }
      )
      .setFooter({ text:"🌈 স্বাগতম সিস্টেম", iconURL:guild.iconURL({dynamic:true}) })
      .setTimestamp();

    const message = await channel.send({embeds:[embed]});

    // Animate embed carousel
    let index = 1;
    const interval = setInterval(()=>{
      if(index >= colors.length) index = 0;
      const newEmbed = EmbedBuilder.from(embed)
        .setColor(colors[index])
        .setTitle(`${titleEmojis[index]} ${fancyFonts[index]} • ${member.user.username} ${titleEmojis[(index+1)%titleEmojis.length]}`)
        .setDescription(`${textEmojis[index]} **${member.user.tag}** আমাদের **${guild.name}** সার্ভারে যোগ দিয়েছেন!\n\n${textEmojis[(index+1)%textEmojis.length]} ${liveMessage}`);
      message.edit({embeds:[newEmbed]});
      index++;
    }, 3000);

    // Wait 15 sec per member
    await new Promise(r => setTimeout(r,15000));
    clearInterval(interval);
    joinQueue.shift();
  }
}

// Express ping endpoint (keep alive for free host)
const express = require("express");
const appServer = express();
appServer.get("/", (req,res)=>res.send("✅ Bot is running"));
appServer.listen(process.env.PORT || 3000, ()=>console.log("🌐 Web server started"));

client.login(process.env.TOKEN);
