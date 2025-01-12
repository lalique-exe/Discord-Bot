// Dependencies
const { giveawayDB, Ranks, Warning } = require('../modules/database/models'),
	{ MessageEmbed } = require('discord.js');

// When the bot leaves a guild
module.exports = async (bot, guild) => {
	bot.logger.log(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
	// Delete server settings
	await bot.DeleteGuild(guild);

	// Send message to channel that bot has left a server
	try {
		const embed = new MessageEmbed()
			.setTitle(`[GUILD LEAVE] ${guild.name}`)
			.setImage(guild.iconURL({ dynamic: true, size: 1024 }))
			.setDescription(`Guild ID: ${guild.id}\nOwner: ${guild.owner.user.tag}\nMemberCount: ${guild.memberCount}`);
		const channel = bot.channels.cache.get(bot.config.SupportServer.GuildChannel);
		if (channel) channel.send(embed);
	} catch (err) {
		bot.logger.error('Unable to fetch guild information.');
	}

	// Clean up database (delete all guild data)
	try {
		await Ranks.deleteMany({
			guildID: guild.id,
		});
	} catch (err) {
		bot.logger.error(`Failed to delete Ranked data, error: ${err.message}`);
	}

	try {
		await giveawayDB.deleteMany({
			guildID: guild.id,
		});
	} catch (err) {
		bot.logger.error(`Failed to delete Giveaway data, error: ${err.message}`);
	}

	try {
		await Warning.deleteMany({
			guildID: guild.id,
		});
	} catch (err) {
		bot.logger.error(`Failed to delete Warning data, error: ${err.message}`);
	}
};
