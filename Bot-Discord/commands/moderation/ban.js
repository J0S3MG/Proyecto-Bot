const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban') // Nombre del comando: /ban
		.setDescription('Selecciona un miembro y banealo.') // Descripción
		.addUserOption((option) => option // Primera opción: usuario
			.setName('target') // Nombre: target
			.setDescription('El miembro a banear') // Descripción
			.setRequired(true)) // Requerido
		.addStringOption((option) => option // Segunda opción: texto
			.setName('reason') // Nombre: reason
			.setDescription('La razón del baneo')) // Opcional
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Solo usuarios con permiso "Ban Members" pueden ver/ejecutar
		.setContexts(InteractionContextType.Guild), // Solo funciona en servidores (no en DMs)
    
    async execute(interaction) {
		const target = interaction.options.getUser('target'); // Obtiene el usuario objetivo
		const reason = interaction.options.getString('reason') ?? 'Sin razón proporcionada'; // Razón o texto por defecto
		
		await interaction.reply(`Baneando a ${target.username} por razón: ${reason}`); // Responde primero
		await interaction.guild.members.ban(target); // Ejecuta el baneo real
	},
};