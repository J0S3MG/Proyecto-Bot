const { Events, Collection, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// ------------------------------------------ Chequeamos que el comando exista -------------------------------
		if (!interaction.isChatInputCommand()) return; // Si el comando no es de /barra entonces esto no se ejecuta. 
	    const command = interaction.client.commands.get(interaction.commandName); // Obtenemos el nombre del comando.
	    if (!command) { // Verificamos que el comando exista.
		    console.error(`No se encontró ningún comando que coincida con ${interaction.commandName}`);
		    return;
	    }
		// ------------------------------------------------------------------------------------------------------------

		// ------------------------------------- Sistema de Cooldown --------------------------------------------------
		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.data.name)) { // Crear la lista para este comando si no existe.
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now(); // La marca de tiempo actual.
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3; // Si no se especifica un cooldown por defecto sera de 3 segundos.
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000; // El cooldown especificado para el comando.
		// Convertido a milisegundos para un cálculo más sencillo.

		// Si el usuario ya ejecuto el comando
		if (timestamps.has(interaction.user.id)) { // Calculamos el tiempo que falta para acabar el cooldown.
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			if (now < expirationTime) { // Si el tiempo de espera es menor al tiempo actual mandamos un mensaje.
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				return interaction.reply({ // Esta es la respuesta.
					content: `Por favor, espere, está en cooldown el comando \`${command.comando.name}\`. Puede usarlo de nuevo en <t:${expiredTimestamp}:R>.`,
					flags: MessageFlags.Ephemeral,
				});
			}
		}

		// Eliminamos el cooldown cuando el tiempo termina.
		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		// ------------------------------------------------------------------------------------------------------------

		// ------------------------------------- Ejecutamos el comando ------------------------------------------------
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
		// ------------------------------------------------------------------------------------------------------------
	},
};