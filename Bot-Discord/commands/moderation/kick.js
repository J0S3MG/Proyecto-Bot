// commands/moderation/kick.js - VERSIÓN COMPLETA
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa a un miembro del servidor')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Usuario a expulsar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Razón de la expulsión')
                .setRequired(false))
        .addIntegerOption(option =>  // Opción extra: borrar mensajes
            option.setName('delete_days')
                .setDescription('Días de mensajes a borrar (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),  // No funciona en DMs
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'Sin razón';
        const deleteDays = interaction.options.getInteger('delete_days') || 0;
        
        try {
            const targetMember = await interaction.guild.members.fetch(target.id);
            
            // Validaciones
            if (target.id === interaction.user.id) {
                return interaction.editReply('❌ No puedes expulsarte a ti mismo.');
            }
            
            if (target.id === interaction.client.user.id) {
                return interaction.editReply('❌ No puedo expulsarme a mí mismo.');
            }
            
            if (target.id === interaction.guild.ownerId) {
                return interaction.editReply('❌ No puedes expulsar al dueño del servidor.');
            }
            
            if (!targetMember.kickable) {
                return interaction.editReply(`❌ No puedo expulsar a ${target.tag}.`);
            }
            
            // Ejecutar expulsión
            await targetMember.kick({ 
                reason: `${reason} (Expulsado por: ${interaction.user.tag})`,
                deleteMessageSeconds: deleteDays * 24 * 60 * 60
            });
            
            await interaction.editReply(`✅ **Expulsado:** ${target.tag}\n📝 **Razón:** ${reason}`);
            
        } catch (error) {
            console.error('Error kick:', error);
            await interaction.editReply('❌ Error al expulsar al usuario.');
        }
    }
};