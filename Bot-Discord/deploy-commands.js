const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.js');
const fs = require('node:fs');
const path = require('node:path');

 
const commands = []; // Definimos un array para guardar todos los comandos.
const foldersPath = path.join(__dirname, 'commands'); // Construye la ruta al directorio de comandos. 
const commandFolders = fs.readdirSync(foldersPath); // Lee el contenido de la carpeta de forma síncrona (espera a terminar).
// Devuelve un array con los nombres de todas las carpetas dentro de commands.

for (const folder of commandFolders) { // Iteramos sobre el array con las carpetas devueltas dentro de la carpeta commands.
	const commandsPath = path.join(foldersPath, folder); 
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) { //Iteramos sobre los archivos de una carpeta especifica (Ej: utility).
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('comando' in command && 'execute' in command) { // Chequeamos que el comando tenga las propiedades comando y execute.
			commands.push(command.comando.toJSON()); // Si es así creamos un json con el comando valido.
		} else {
			console.log(`[WARNING] El comando en ${filePath}  le falta la propiedad requerida "comando" o "execute".`);
		}
	}
}

// Construye y prepara una instancia del módulo REST.
const rest = new REST().setToken(token); // Crea una instancia del módulo REST de Discord.js y la autenticamos con el token.

// Es la parte que REGISTRA/ACTUALIZA los comandos slash en Discord.
(async () => { // Se ejecuta inmediatamente al cargar el script.
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		// El método put se usa para refrescar completamente todos los comandos en el servidor con el conjunto actual.
		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
