const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guide')  // Nombre del comando: /guide
		.setDescription('¡Busca en discordjs.guide!')  // Descripción
		.addStringOption((option) => option.setName('query')  // Primera opción: texto
			.setDescription('Frase a buscar')  // Descripción de la opción
			.setAutocomplete(true))  // Activa autocompletado para esta opción
		.addStringOption((option) => option.setName('version')  // Segunda opción: versión
			.setDescription('Versión en la que buscar')
			.setAutocomplete(true)),  // También tiene autocompletado
	
	// Función de autocompletado (se ejecuta al escribir en las opciones)
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);  // Obtiene la opción que se está escribiendo
		let choices;  // Array de sugerencias
		
		// Si la opción enfocada es 'query' (búsqueda)
		if (focusedOption.name === 'query') {
			choices = [  // Sugerencias predefinidas
				'Temas Populares: Hilos (Threads)',
				'Fragmentación (Sharding): Comenzando',
				'Biblioteca: Conexiones de Voz',
				'Interacciones: Respondiendo a comandos slash',
				'Temas Populares: Vista previa de Embeds',
			];
		}
		
		// Si la opción enfocada es 'version'
		if (focusedOption.name === 'version') {
			choices = ['v9', 'v11', 'v12', 'v13', 'v14'];  // Versiones disponibles
		}
		
		// Filtrar las sugerencias según lo que el usuario ha escrito
		const filtered = choices.filter((choice) => 
			choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
		);
		
		// Enviar las sugerencias filtradas a Discord
		await interaction.respond(
			filtered.map((choice) => ({ 
				name: choice,  // Lo que se muestra al usuario
				value: choice   // Lo que se envía cuando se selecciona
			}))
		);
	},
	
	async execute(interaction) {
		// Aquí iría la lógica para responder al comando completo
		// Por ejemplo, buscar en la guía de Discord.js
		const query = interaction.options.getString('query');
		const version = interaction.options.getString('version');
		
		await interaction.reply({
			content: `🔍 Buscando: "${query}" en la versión ${version || 'la más reciente'}...`,
			ephemeral: true  // Solo lo ve quien ejecutó el comando
		});
	},
};