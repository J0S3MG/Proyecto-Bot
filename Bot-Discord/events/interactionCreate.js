const { Events, MessageFlags } = require('discord.js');
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return; // Si el comando no es de /barra entonces esto no se ejecuta. 
	    const command = interaction.client.commands.get(interaction.commandName); // Obtenemos el nombre del comando.
	    if (!command) { // Verificamos que el comando exista.
		    console.error(`No se encontró ningún comando que coincida con ${interaction.commandName}`);
		    return;
	    }
	    try { // Ejecutamos el comando.
		    await command.execute(interaction);
	    } catch (error) { // Manejo en caso de error.
		    console.error(error); // Muestra el error en la consola.
		    // Envía un mensaje al usuario que usó el comando, pero con dos casos distintos.
		    if (interaction.replied || interaction.deferred) { // Primer caso usa followUp() cuando el bot ya respondió o dijo "estoy procesando...".
			    await interaction.followUp({ 
				    content: '¡Hubo un error al ejecutar este comando!',
				    flags: MessageFlags.Ephemeral, // Hace el mensaje efimero, solo el usuario que ejecuto el comando ve el msj, se autodestruye después de unos segundos y no lo ven los demas usuarios del canal.
			    });
		    } else { // Segundo caso el bot usa reply() cuando es la primera vez que responde.
			    await interaction.reply({
				    content: '¡Hubo un error al ejecutar este comando!',
				    flags: MessageFlags.Ephemeral,
			    });
		    }
	    }
	},
};