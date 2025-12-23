const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5, // Tiempo de espera hasta poder volver a usar el comando. 
	data: new SlashCommandBuilder().setName('user').setDescription('Proporciona información sobre el usuario.'),
	async execute(interaction) {
		await interaction.reply(
			`Este comando fue ejecutado por ${interaction.user.username}, que se unió ${interaction.member.joinedAt}.`,
		);
	},
};
// interaction.user es el objeto que representa al usuario que ejecutó el comando.
// interaction.member es el objeto GuildMember, que representa al usuario en una guild específica.