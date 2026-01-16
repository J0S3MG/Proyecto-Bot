// commands/moderation/unban-enhanced.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Desbanea a un usuario (con lista de baneados)')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('Usuario a desbanear (ID o nombre)')
                .setRequired(true)
                .setAutocomplete(true))  // ¡Autocompletado!
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Razón del desbaneo'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    // Autocompletado con lista de baneados
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        
        try {
            // Obtener lista de baneos
            const bans = await interaction.guild.bans.fetch();
            const choices = [];
            
            // Convertir a array de opciones
            bans.forEach(ban => {
                const user = ban.user;
                choices.push({
                    name: `${user.tag} (ID: ${user.id})`,
                    value: user.id
                });
            });
            
            // Filtrar según lo que el usuario escribe
            const filtered = choices.filter(choice => 
                choice.name.toLowerCase().includes(focusedValue.toLowerCase())
            ).slice(0, 25);  // Discord limita a 25 opciones
            
            await interaction.respond(filtered);
            
        } catch (error) {
            console.error('Error en autocomplete unban:', error);
            await interaction.respond([]);
        }
    },
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });  // Visible para todos
        
        const userId = interaction.options.getString('user');
        const reason = interaction.options.getString('reason') || 'Sin razón';
        
        try {
            // Obtener info del usuario baneado
            const banInfo = await interaction.guild.bans.fetch(userId);
            const user = banInfo.user;
            
            // Desbanear
            await interaction.guild.bans.remove(userId, 
                `Desbaneado por: ${interaction.user.tag} | Razón: ${reason}`
            );
            
            await interaction.editReply({
                content: `✅ **${user.tag} ha sido desbaneado.**\n` +
                        `📝 **Razón:** ${reason}\n` +
                        `👮 **Moderador:** ${interaction.user.tag}`
            });
            
        } catch (error) {
            console.error('Error unban:', error);
            
            if (error.code === 10026) {
                await interaction.editReply({
                    content: `❌ **Error:** El usuario con ID \`${userId}\` no está baneado.`
                });
            } else {
                await interaction.editReply({
                    content: `❌ **Error:** ${error.message}`
                });
            }
        }
    }
};