const { Events, Collection, MessageFlags } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // ================================== MANEJAR AUTOCOMPLETADO ===================================================
        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No se encontró el comando para autocompletar: ${interaction.commandName}`);
                return;
            }
            if (!command.autocomplete) {
                console.error(`El comando ${interaction.commandName} no tiene función autocomplete`);
                return;
            }
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(`Error en autocomplete de ${interaction.commandName}:`, error);
            }
            return;
        }
        // =============================================================================================================   

        // ======================================== MANEJAR CONTEXT MENUS ==============================================
        if (interaction.isContextMenuCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            
            if (!command) {
                console.error(`Context menu no encontrado: ${interaction.commandName}`);
                return;
            }
            
            try {
                // Ejecutar el context menu
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error en context menu ${interaction.commandName}:`, error);
                
                // Manejo de errores para context menus
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: '❌ Error ejecutando el comando',
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.reply({
                        content: '❌ Error ejecutando el comando',
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
            return; // ¡IMPORTANTE! Salir después de manejar context menu
        }
        // =============================================================================================================

        // ======================================== MANEJAR COMANDOS SLASH =============================================
        if (!interaction.isChatInputCommand()) return;
        
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No se encontró el comando: ${interaction.commandName}`);
            return;
        }
        // =============================================================================================================
        
        // ============================================ SISTEMA DE COOLDOWN ============================================
        if (!interaction.client.cooldowns) {
            interaction.client.cooldowns = new Collection();
        }
        const { cooldowns } = interaction.client;
        
        
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
        
        // Verificar si el usuario está en cooldown
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1_000);
                return interaction.reply({
                    content: `Por favor, espere, está en cooldown el comando \`${command.data.name}\`. Puede usarlo de nuevo <t:${expiredTimestamp}:R>.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
        
        // Establecer nuevo cooldown
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        // =============================================================================================================
        
        // =========================================== EJECUTAR EL COMANDO =============================================
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error ejecutando comando ${interaction.commandName}:`, error);
            
            // Verificar si la interacción aún es válida
            if (!interaction.isRepliable()) {
                console.log(`La interacción ${interaction.commandName} ya no es respondible`);
                return;
            }
            
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: '¡Hubo un error al ejecutar este comando!',
                        flags: MessageFlags.Ephemeral,
                    });
                } else {
                    await interaction.reply({
                        content: '¡Hubo un error al ejecutar este comando!',
                        flags: MessageFlags.Ephemeral,
                    });
                }
            } catch (replyError) {
                console.error('No se pudo notificar el error al usuario:', replyError);
            }
        }
        // =============================================================================================================
    },
};