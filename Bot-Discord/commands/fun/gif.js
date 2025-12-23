const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Define un comando que envía un GIF según la categoría elegida
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Envía un gif aleatorio')
        .addStringOption((option) =>
            option
                .setName('categoria')
                .setDescription('La categoría del gif')
                .setRequired(true)
                // Proporciona opciones predefinidas para que el usuario elija
                .addChoices(
                    { name: 'Gracioso', value: 'gif_funny' },
                    { name: 'Meme', value: 'gif_meme' },
                    { name: 'Película', value: 'gif_movie' },
                ),
        ),
    
    async execute(interaction) {
        // Obtiene la categoría elegida por el usuario
        const categoria = interaction.options.getString('categoria');
        
        // GIFs de ejemplo para cada categoría (en producción usarías una API como Tenor o Giphy)
        const gifs = {
            gif_funny: [
                'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
                'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif',
            ],
            gif_meme: [
                'https://media.giphy.com/media/Wgb2FBSaGmk8E/giphy.gif',
                'https://media.giphy.com/media/11mwI67GLeMvgA/giphy.gif',
            ],
            gif_movie: [
                'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
                'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif',
            ],
        };
        
        // Selecciona un GIF aleatorio de la categoría elegida
        const gifsSeleccionados = gifs[categoria];
        const gifAleatorio = gifsSeleccionados[Math.floor(Math.random() * gifsSeleccionados.length)];
        
        // Envía el GIF como respuesta
        await interaction.reply({
            content: `¡Aquí tienes un GIF de **${categoria.replace('gif_', '')}** para ti! 🎬`,
            embeds: [{
                image: { url: gifAleatorio },
                color: 0xFF69B4
            }]
        });
    },
};