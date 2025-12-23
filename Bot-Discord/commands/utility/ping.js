// El SlashCommandBuilder nos permite crear comandos de /.
const { SlashCommandBuilder } = require('discord.js');

module.exports = {             // Nombre del comando, Descripcion del comando.
	data: new SlashCommandBuilder().setName('ping').setDescription('Responde con Pong!'), // Variable donde se guarda el comando.
	cooldown: 5, // Tiempo de espera hasta poder volver a usar el comando. 
	async execute(interaction) { // Definimos lo que pasara al usar el comando ping.
		await interaction.reply('Pong!'); // Este método reconoce la interacción y envía un nuevo mensaje de respuesta.
	},
};