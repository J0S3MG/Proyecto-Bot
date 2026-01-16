// commands/moderation/banlist.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription('Muestra la lista de usuarios baneados')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Página a mostrar (10 por página)')
                .setMinValue(1))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const page = interaction.options.getInteger('page') || 1;
        const itemsPerPage = 10;
        
        try {
            const bans = await interaction.guild.bans.fetch();
            const totalBans = bans.size;
            
            if (totalBans === 0) {
                return interaction.editReply({
                    content: '✅ **No hay usuarios baneados en este servidor.**'
                });
            }
            
            // Calcular páginas
            const totalPages = Math.ceil(totalBans / itemsPerPage);
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            // Crear embed
            const embed = new EmbedBuilder()
                .setTitle(`🔨 Lista de Baneados (${totalBans} usuarios)`)
                .setColor(0xFF0000)
                .setFooter({ text: `Página ${page}/${totalPages} • Usa /banlist page:${page+1} para siguiente` });
            
            // Agregar usuarios (máximo 10 por página)
            let description = '';
            let count = 0;
            
            const banArray = Array.from(bans.values()).slice(startIndex, endIndex);
            
            banArray.forEach((ban, index) => {
                const user = ban.user;
                const reason = ban.reason || 'Sin razón';
                count++;
                
                description += `**${startIndex + count}. ${user.tag}**\n`;
                description += `   👤 ID: \`${user.id}\`\n`;
                description += `   📝 Razón: ${reason.substring(0, 100)}${reason.length > 100 ? '...' : ''}\n\n`;
            });
            
            embed.setDescription(description || 'No hay más usuarios en esta página.');
            
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error banlist:', error);
            await interaction.editReply({
                content: '❌ Error al obtener la lista de baneos.'
            });
        }
    }
};