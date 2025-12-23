const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Define el comando con dos subcomandos: 'user' para info de usuario y 'server' para info del servidor
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Obtén información sobre un usuario o el servidor')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('user')
                .setDescription('Información sobre un usuario')
                // Opción opcional: permite mencionar un usuario específico, sino usa el que ejecuta el comando
                .addUserOption((option) => 
                    option.setName('nombre').setDescription('El usuario')
                ),
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('server')
                .setDescription('Información sobre el servidor')
        ),
    
    async execute(interaction) {
        // Detecta qué subcomando eligió el usuario
        if (interaction.options.getSubcommand() === 'user') {
            // Obtiene el usuario mencionado, o si no hay, usa quien ejecutó el comando
            const user = interaction.options.getUser('nombre') || interaction.user;
            
            // Responde con información del usuario
            await interaction.reply(
                `**Nombre de usuario:** ${user.username}\n` +
                `**Tag:** ${user.tag}\n` +
                `**ID:** ${user.id}\n` +
                `**Cuenta creada:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>\n` +
                `**Avatar:** [Haz clic aquí](${user.displayAvatarURL()})`
            );
        } 
        else if (interaction.options.getSubcommand() === 'server') {
            // Responde con información del servidor
            await interaction.reply(
                `**Nombre del servidor:** ${interaction.guild.name}\n` +
                `**Total de miembros:** ${interaction.guild.memberCount}\n` +
                `**Creado:** <t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:F>\n` +
                `**Dueño:** <@${interaction.guild.ownerId}>\n` +
                `**ID del servidor:** ${interaction.guild.id}`
            );
        }
    },
};