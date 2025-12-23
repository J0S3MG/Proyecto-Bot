const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Define un comando multiidioma que muestra imágenes de perros
    data: new SlashCommandBuilder()
        .setName('dog')
        // Traducciones del nombre del comando en otros idiomas
        .setNameLocalizations({
            pl: 'pies',  // Polaco
            de: 'hund',  // Alemán
        })
        .setDescription('¡Obtén una linda imagen de un perro!')
        // Traducciones de la descripción
        .setDescriptionLocalizations({
            pl: 'Słodkie zdjęcie pieska!',
            de: 'Poste ein niedliches Hundebild!',
        })
        // Opción para especificar la raza (opcional)
        .addStringOption((option) =>
            option
                .setName('raza')
                .setDescription('Raza del perro')
                .setNameLocalizations({
                    pl: 'rasa',
                    de: 'rasse',
                })
                .setDescriptionLocalizations({
                    pl: 'Rasa psa',
                    de: 'Hunderasse',
                }),
        ),
    
    async execute(interaction) {
        // Obtiene la raza si fue especificada
        const raza = interaction.options.getString('raza');
        
        try {
            let url;
            
            if (raza) {
                // Si se especificó una raza, busca una imagen de esa raza
                const response = await fetch(`https://dog.ceo/api/breed/${raza.toLowerCase()}/images/random`);
                const data = await response.json();
                
                // Si la raza no existe, la API devuelve un error
                if (data.status === 'error') {
                    return interaction.reply(`❌ No se encontró la raza "${raza}". Prueba con razas como: husky, corgi, poodle, beagle`);
                }
                
                url = data.message;
            } else {
                // Si no se especificó raza, obtiene una imagen aleatoria de cualquier perro
                const response = await fetch('https://dog.ceo/api/breeds/image/random');
                const data = await response.json();
                url = data.message;
            }
            
            // Envía la imagen del perro
            await interaction.reply({
                content: raza ? `🐕 ¡Aquí tienes un **${raza}**!` : '🐕 ¡Aquí tienes un perro aleatorio!',
                embeds: [{
                    image: { url: url },
                    color: 0x8B4513
                }]
            });
            
        } catch (error) {
            console.error(error);
            await interaction.reply('❌ Lo siento, no pude obtener una imagen de perro en este momento.');
        }
    },
};