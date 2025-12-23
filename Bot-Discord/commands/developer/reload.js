const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');

// Este comando nos ayuda a recargar otros sin tener que reiniciar el bot.
module.exports = { // Creamos el comando reload.
    data: new SlashCommandBuilder().setName('reload').setDescription('Recarga los comandos.') 
	// ↓ Le pasamos un parametro obligatorio (setRequired) en este caso el comando que queremos recargar.
    .addStringOption((option) => option.setName('command').setDescription('El comando a recargar.').setRequired(true)),
    async execute(interaction) {
		// Obtener el nombre del comando.
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) { // Si no existe responde con un error.
            return interaction.reply(`No existe un comando con nombre: \`${commandName}\`!`);
       	}

        // Buscar el archivo del comando en todas las carpetas.
        const foldersPath = path.join(__dirname, '..');
        const commandFolders = require('node:fs').readdirSync(foldersPath);
        
        let commandPath = null;
        
        for (const folder of commandFolders) { // Iteramos dentro de la carpeta commands.
        	const commandsPath = path.join(foldersPath, folder);
            const commandFiles = require('node:fs').readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            
            for (const file of commandFiles) { // Iterar sobre las carpetas para buscar el archivo.
                if (file === `${commandName}.js`) {
                    commandPath = path.join(commandsPath, file);
                    break;
                }
            }
            
        	if (commandPath) break;
        }

        if (!commandPath) { // Si no ecuentra el comando responde con un error.
            return interaction.reply(`No se pudo encontrar el archivo del comando \`${commandName}\`!`);
        }

        // Eliminar el comando del cache
        delete require.cache[require.resolve(commandPath)];

        try {
            const newCommand = require(commandPath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`El comando \`${newCommand.data.name}\` fue recargado exitosamente`);
        } catch (error) {
            console.error(error);
            await interaction.reply(
                `Hubo un error al intentar recargar el comando \`${command.data.name}\`:\n\`${error.message}\``,
            );
        }
    },
};