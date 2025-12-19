const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady, // Indicamos el evento que tendra este archivo.
	once: true, // Especifica si el evento debe ejecutarse solo una vez.
	execute(cliente) { // Lo que hara el evento.
		console.log(`Conexion exitosa a discord con el tag: ${cliente.user.tag}`);
	},
};