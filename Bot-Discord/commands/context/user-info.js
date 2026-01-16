// commands/context/user-info-simple.js
const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Ver Información')
        .setType(ApplicationCommandType.User),
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const user = interaction.targetUser;
        const member = interaction.targetMember;
        
        const embed = new EmbedBuilder()
            .setColor(member?.displayHexColor || 0x0099FF)
            .setTitle(`Información de ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ size: 256 }))
            .addFields(
                { name: '👤 Nombre', value: user.tag, inline: true },
                { name: '🆔 ID', value: `\`${user.id}\``, inline: true },
                { name: '🤖 Bot', value: user.bot ? '✅ Sí' : '❌ No', inline: true }
            );
        
        if (member) {
            embed.addFields(
                { name: '📅 Se unió', value: `<t:${Math.floor(member.joinedTimestamp/1000)}:R>`, inline: true },
                { name: '👑 Rol alto', value: member.roles.highest?.name || 'Ninguno', inline: true },
                { name: '🎭 Roles', value: `${member.roles.cache.size - 1} roles`, inline: true }
            );
        }
        
        embed.addFields(
            { name: '📅 Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp/1000)}:R>`, inline: false }
        );
        
        await interaction.editReply({ embeds: [embed] });
    }
};