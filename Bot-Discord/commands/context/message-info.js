// commands/context/message-info.js
const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Message Information')  // Click derecho en mensaje
        .setType(ApplicationCommandType.Message),
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const message = interaction.targetMessage;
        
        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('📨 Información del Mensaje')
            .addFields(
                { name: '👤 Autor', value: message.author.tag, inline: true },
                { name: '🆔 ID Autor', value: `\`${message.author.id}\``, inline: true },
                { name: '🆔 ID Mensaje', value: `\`${message.id}\``, inline: true },
                { name: '📅 Enviado', value: `<t:${Math.floor(message.createdTimestamp/1000)}:F>`, inline: false },
                { name: '📝 Contenido', value: message.content || '*Sin contenido*', inline: false },
                { name: '🔗 Enlace', value: `[Ir al mensaje](${message.url})`, inline: true }
            )
            .setFooter({ text: `Canal: #${message.channel.name}` });
        
        // Si tiene adjuntos
        if (message.attachments.size > 0) {
            embed.addFields({
                name: `📎 Adjuntos (${message.attachments.size})`,
                value: message.attachments.map(a => a.name).join(', ')
            });
        }
        
        // Si es una respuesta
        if (message.reference) {
            embed.addFields({
                name: '↩️ Responde a',
                value: `[Mensaje ${message.reference.messageId}](${message.url})`
            });
        }
        
        await interaction.editReply({ embeds: [embed] });
    }
};