const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const queue = new Map();
const request = require("request");
const mention = "@";
let prefix = "s!"
let prefixLog = "[!]"
var client = new Discord.Client();


var bot = new Discord.Client();

var servers = {};

bot.on("ready", function () {
    bot.user.setActivity("SlenderBot - " + prefix + "help | Par Ilian")
    console.log("\SlenderBot - Connecté");
    console.log("\nInfos :\nNombre de serveurs : " + bot.guilds.size + "\nNombre d'utilisateurs : " + bot.users.size);
    var allservers = bot.guilds.array(); for (var i in allservers) {
        console.log("\nServeur numéro " + i + " :" + "\n- Nom du serveur : " + allservers[i].name + "\n- ID du serveur : " + allservers[i].id + "\n- Propriétaire du serveur : " + allservers[i].owner.displayName + " (" + allservers[i].owner.id + ")\n")
    }
});

bot.on('message', function (msg) {
    if (msg.content.indexOf(prefix) === 0) {
        var cmdTxt = msg.content.split(" ")[0].substring(prefix.length);
        var cmd = commands[cmdTxt];
        var member = msg.member;
        var suffix = msg.content.substring(cmdTxt.length + prefix.length + 1);
        if (cmd !== undefined) {
            cmd.process(msg, suffix);
        } else {
            cmdTxt = cmdTxt.replace('`', '');
            if (cmdTxt === '') {
                var cmdTxt = "none";
            }
        }
    }
});

var commands = {
    "join": {
        process: function (msg, suffix) {
            const channel = msg.member.voiceChannel;
            if (!channel) return msg.channel.send(':warning: | **Tu est pas dans un salon vocal.**');
            if (!msg.member.voiceChannel.joinable) {
                msg.channel.send(":warning: | **Je n'ai pas les permissions suffisantes pour diffuser la radio dans ce salon...**");
                return;
            }
            msg.member.voiceChannel.join();
            msg.channel.send(":loudspeaker: | **Je suis là !**");
        }
    },

    "radio": {
        process: function (msg, suffix) {
            const channel = msg.member.voiceChannel;
            if (!channel) return msg.channel.send("**Tu n'est pas dans un salon vocal.**");
            if (suffix) {
                if (suffix === "Modern" || suffix === "modern") {
                    msg.channel.send(":musical_note: | **Radio Modern**");
                    var radio = "RadioModern";
                } else if (suffix === "NRJ" || suffix === "nrj") {
                    msg.channel.send(":musical_note: | **NRJ**");
                    var radio = "NRJPremium";
                } else {   
                    msg.channel.send("Erreur, taper ``" + prefix + "radiolist`` pour voir les radio disponible");
                    return;
                }
                msg.member.voiceChannel.join().then(connection => {
                    require('http').get("http://streaming.radionomy.com/" + radio, (res) => {
                        connection.playStream(res);
                    })
                })
                    .catch(console.error);
            } else {
                msg.channel.send("Erreur taper ``" + prefix + "radiolist`` pour voir les radio disponible");
            }
        },
    },

    "stop": {
        process: function (msg, suffix) {
            const voiceChannel = msg.member.voiceChannel;
            if (voiceChannel) {
                msg.channel.send("**Je suis plus là !**");
                msg.member.voiceChannel.leave();
            } else {
                msg.channel.send("**Je ne suis pas dans un salon vocal.**");
            }
        }
    },

    "help": {
        process: function (msg, suffix) {
            var help_embed = new Discord.RichEmbed()
                .addField(prefix + 'play', "Pour lancer de la musique. *Merci de vérifié que je ne suis déjà pas dans un salon vocale !* ( Les Playlist ne fonctionne pas ! )")
                .addField(prefix + "skip", "Pour passez une musique dans la queue ! ( *Si le " + prefix + "stop ne marche pas utiliser cette cmd* )")
                .addField(prefix + "stop", "Pour couper la musique !")
                .addField(prefix + "radiohelp", "Pour affichier l'aide des radio.")                
                .addField(prefix + "vcs", "Pour envoyer un message vcs.")
                .addField(prefix + "radiolist", "Pour voir la liste des radio disponnibles.")
                .setColor("#F7FE2E")
                .setFooter("Par Ilian ! ^^")
                .setAuthor("Message d'aide")
                .setTimestamp()
                msg.channel.send(help_embed)
        },
    },

    "radiolist": {
        process: function (msg, suffix) {
            var radio_embed = new Discord.RichEmbed()
                    .addField(prefix + "radio modern", "**Pour jouer la Radio Modern** !", true)
                    .addField(prefix  + "radio nrj", "**Pour écouter NRJ !**", true)
                .setColor("#F7FE2E")
                .setFooter("Par Ilian ! ^^")
                .setAuthor("Liste des Radio")
                .setTimestamp()
                msg.channel.send(radio_embed)
        },
    },

    "help": {
        process: function (msg, suffix) {
            var help_embed = new Discord.RichEmbed()
                .addField(prefix + "join", "Pour que je rejoigne ton salon vocal.")
                .addField(prefix + "stop", "Pour que je quitte ton salon vocal.")
                .addField(prefix + "radiolist", "Pour voir la liste des radio disponnibles.")
                .setColor("#F7FE2E")
                .setFooter("Par Ilian ! ^^")
                .setAuthor("Message d'aide")
                .setTimestamp()
                msg.channel.send(help_embed)
        },
    },    

    "purge": {
        process: function (msg, suffix) {
            msg.delete(1000)  
        }
    }
}

bot.on("message", async function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    var args2 = message.content.split(" ").slice(1);

    var suffix = args2.join(" ");

    var reason = args2.slice(1).join(" ");

    var reasontimed = args2.slice(2).join(' ')

    var user = message.mentions.users.first();

    var guild = message.guild;

    var member = message.member;

    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {  
        case "play":
        if (!args[1]) {
            message.channel.send(":loudspeaker:[``SlenderBot Musique``] - **Vous devez mettre un lien**.");
            return;
        }
        var play_embed = new Discord.RichEmbed()
            .addField("Titre", "[**EN DEV**](https://" + args + ")")
            .addField("Uploader", "**EN DEV**", true)
            .addField("Ajouter par", message.author.toString(), true)
            .setColor("#3333cc")
            .setTimestamp()
        if (!message.member.voiceChannel) {
            message.channel.send(":loudspeaker:[``SlenderBot Musique`] - **Vous devez être dans un salon vocal**.");
            return;
        }

        if (!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        };

        var server = servers[message.guild.id];
        message.channel.send(":loudspeaker:[``SlenderBot Musique``] - **Musique en cour ** : ``" + args[1] + "``");
        message.channel.send(play_embed)
        server.queue.push(args[1]);

        if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
            play(connection, message)
        });
    break;

    case "skip":
        if (!message.member.voiceChannel) {
            message.channel.send(":loudspeaker:[``SlenderBot Musique``] - **Vous devez être dans un salon vocal**.");
            return;
        }
        var server = servers[message.guild.id];
        message.channel.send(":loudspeaker:[`SlenderBot Musique`] - **Passage à la musique suivante**");
        if (server.dispatcher) server.dispatcher.end();
    break;

    case "stop":
        if (!message.member.voiceChannel) {
            message.channel.send(":warning:[``SlenderBot Musique``] - **Vous devez être dans un salon vocal**.");
            return;
        }
        const serverQueue = queue.get(message.guild.id);
        var server = servers[message.guild.id];
        if (!serverQueue) return message.channel.send(":warning:[``SlenderBot Musique``] - **Fin de la session de musique.**")
        if (!message.guild.voiceConnection) message.member.voiceChannel.leave().then(function (connection) {
            stop(connection, message)
        });
    break;

    case "vcs":
    let vcsmog = message.content.split(" ").slice(1);
    let msgvcs = vcsmog.join(' ')
    var xo02 = message.guild.channels.find('name','vcs-sk');
    if(!xo02) return message.reply("Le channel #vcs-sk est introuvable !")
    if(message.channel.name !== 'vcs-sk') return message.reply("Cette commande est à effectuer seulement dans le salon dans #vcs-sk de n'importe quel serveur.")
    if(!msgvcs) return message.channel.send("Merci d'écrire un message à envoyer dans le VCS.") 
    if(message.author.id === "337863324983230474") {
        const fonda_embed = new Discord.RichEmbed()
        .setColor("#B40404")
            .addField("Fondateur - " + message.author.username + " – VCS", msgvcs)
            .addField("----------------------", "Provenance du message : ``" + message.guild.name + "``", true)
        .setThumbnail(message.author.avatarURL)
        .setFooter("Par Ilian^^ !")
        .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-sk').map(channel => channel.send(fonda_embed));
    }else if(message.author.id === "193092758267887616") {
        const dev_embed = new Discord.RichEmbed()
        .setColor("#6600cc")
            .addField("Développeur - " + message.author.username + " – VCS", msgvcs)
            .addField("----------------------", "Provenance du message : ``" + message.guild.name + "``", true)
        .setThumbnail(message.author.avatarURL)
        .setFooter("Par Ilian^^ !")
        .setTimestamp()
    message.delete()
    bot.channels.findAll('name', 'vcs-sk').map(channel => channel.send(dev_embed));
    }else {   
    const vcs_embed = new Discord.RichEmbed()
    .setColor("#F7FE2E")
        .addField("Utilisateur - " + message.author.username + " – VCS", msgvcs)
        .addField("----------------------", "Provenance du message : ``" + message.guild.name + "``", true)
    .setThumbnail(message.author.displayAvatarURL)
    .setFooter("Par Ilian^^ !")
    .setTimestamp()
    message.delete()
    bot.channels.findAll('name', "vcs-sk").map(channel => channel.send(vcs_embed));
    }
    break;  
    }
});

bot.login(process.env.TOKEN);
