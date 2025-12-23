const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Define un comando que repite lo que el usuario escribe
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Repite tu mensaje')
        // Requiere un texto obligatorio que el usuario debe proporcionar
        .addStringOption((option) => 
            option
                .setName('mensaje')
                .setDescription('El mensaje a repetir')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        // Obtiene el texto que escribió el usuario
        const mensaje = interaction.options.getString('mensaje');
        
        // Repite el texto de vuelta
        await interaction.reply(mensaje);
    },
};