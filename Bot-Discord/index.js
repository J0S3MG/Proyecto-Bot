const fs = require('node:fs'); // Lee e identifica nuestros comandos definidos en la carpeta commands.
const path = require('node:path'); // Construye las rutas para acceder a archivos y directorios.
// Importamos las siguientes clases de Discord.js
const { Client, Collection, GatewayIntentBits} = require('discord.js');
const { token } = require('./config.js');// Tambien traemos la variable de entorno configurada.

// Creamos una instancia del cliente.
// intents: Definen qué eventos debe enviar Discord a tu bot.
// Con Guilds se refieren a un Servidor de discrod.
const cliente = new Client({ intents: [GatewayIntentBits.Guilds] });

cliente.commands = new Collection(); // Creamos una lista para almacenar y recuperar comandos de forma eficiente para su ejecución.
cliente.cooldowns = new Collection(); // Creamos una lista para alamacenar los cooldowns de los comandos ejecutados.
const foldersPath = path.join(__dirname, 'commands'); // Nos dirijimos a la carpeta commands.
const commandFolders = fs.readdirSync(foldersPath); // Crea un array con las carpetas dentro de commands (En este caso utility).

for (const folder of commandFolders) { // Itera dentro de la carpeta utility.
	const commandsPath = path.join(foldersPath, folder);  // ↓ Lee la ruta y devuelve un array con los archivos .js
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) { // itera sobre cada archivo.
		const filePath = path.join(commandsPath, file);
		const command = require(filePath); // Una vez filtrados los comandos los agregamos al cliente.
		if ('data' in command && 'execute' in command) {
			cliente.commands.set(command.data.name, command);
			console.log(`Comando cargado: ${command.data.name}`);
		} else {
			console.log(`[WARNING] El comando en ${filePath} le falta una propiedad "comando" o "execute" requerida.`);
		}
	}
}

// Hacemos algo similar a lo de arriba pero con eventos.
const eventsPath = path.join(__dirname, 'events'); // Nos dirijimos a la carpeta evento y filtramos los archivos .js
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
for (const file of eventFiles) { // Tomamos cada evento y lo guardamos en un array de eventos.
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) { // Separamos entre los eventos que se ejecutan una vez y los que no.
		cliente.once(event.name, (...args) => event.execute(...args));
	} else {
		cliente.on(event.name, (...args) => event.execute(...args));
	}
}

// Inicia sesión en Discord con el token de tu cliente.
cliente.login(token);

