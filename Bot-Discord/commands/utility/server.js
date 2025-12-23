const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5, // Tiempo de espera hasta poder volver a usar el comando. 
	data: new SlashCommandBuilder().setName('server').setDescription('Proporciona información sobre el servidor.'),
	async execute(interaction) {
		// interaction.guild es el objeto que representa la guild (Servidor) en el que se ejecutó el comando.
		await interaction.reply(
			`Este servidor es ${interaction.guild.name} y tiene ${interaction.guild.memberCount} miembros.`,
		);
	},
};