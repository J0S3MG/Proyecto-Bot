// El SlashCommandBuilder nos permite crear comandos de /.
const { SlashCommandBuilder } = require('discord.js');

module.exports = {             // Nombre del comando, Descripcion del comando.
	comando: new SlashCommandBuilder().setName('ping').setDescription('Responde con Pong!'),
	async execute(interaction) { // Definimos lo que pasara al usar el comando ping.
		await interaction.reply('Pong!'); // Este método reconoce la interacción y envía un nuevo mensaje de respuesta.
	},
};