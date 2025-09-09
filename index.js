const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Bot configuration
const config = {
    token: 'MTQwNjc1ODcxMTg3MTAxMzAxOQ.GUG7vj.GBShDyFZ3-IepfWMXofIhsa0f-6oDJDbUoe9qQ',
    pterodactylUrl: 'https://panel.snowhost.cloud',
    pterodactylApiKey: 'ptla_qbqI0lLV4WQiHIPRAb9UVkVXPazZ9fst5MajCSyr1LJ',
    allowedChannelId: '1378786842408648915'
};

// File to save users who created accounts
const usersFilePath = './users.json';

// Read users from file - محسن لحفظ بيانات أكثر تفصيلاً
function loadUsers() {
    try {
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading users file:', error);
    }
    return []; // إرجاع مصفوفة فارغة إذا لم يوجد الملف
}

// Save users to file - محسن لحفظ بيانات أكثر تفصيلاً
function saveUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        console.log('Users data saved successfully');
    } catch (error) {
        console.error('Error saving users file:', error);
    }
}

// Function to check if user already has an account
function userHasAccount(discordId) {
    const users = loadUsers();
    return users.some(user => user.discordId === discordId);
}

// Function to add new user to database
function addUser(discordId, email, username, password) {
    const users = loadUsers();
    const newUser = {
        discordId: discordId,
        email: email,
        username: username,
        password: password,
        createdAt: new Date().toISOString(), // إضافة تاريخ الإنشاء
        pterodactylId: null // يمكن تحديثه لاحقاً بمعرف Pterodactyl
    };
    
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

// Function to get user data
function getUserData(discordId) {
    const users = loadUsers();
    return users.find(user => user.discordId === discordId);
}

// Function to update user pterodactyl ID
function updateUserPterodactylId(discordId, pterodactylId) {
    const users = loadUsers();
    const userIndex = users.findIndex(user => user.discordId === discordId);
    
    if (userIndex !== -1) {
        users[userIndex].pterodactylId = pterodactylId;
        saveUsers(users);
    }
}

// Create client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// When bot is ready
client.once('ready', () => {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
    client.user.setActivity('SnowHost Panel', { type: 'WATCHING' });
});

// Function to create main panel embed
function createMainEmbed() {
    return new EmbedBuilder()
        .setColor(0x8B7CF8)
        .setTitle('❄️ SnowHost Panel')
        .setDescription('**Welcome to SnowHost Control Panel**')
        .addFields(
            {
                name: '• Features:',
                value: '• **Minecraft Hosting** استضافة سيرفرات ماين كرافت\n' +
                       '• **Real time Monitoring** مراقبة الأداء المباشر\n' +
                       '• **Secure & Reliable** آمن وموثوق\n' +
                       '• **24/7 Support** دعم فني',
                inline: false
            },
            {
                name: '• Requirements:',
                value: '• **Email Address** ايميل\n' +
                       '• **Username** اسم المستخدم\n' +
                       '• **Password** كلمة مرور',
                inline: false
            },
            {
                name: '• Hosting:',
                value: '• **99.9% Uptime** وقت التشغيل\n' +
                       '• **Frankfurt Location** موقع فرانكفورت\n' +
                       '• **DDoS Protection** حماية ديدوس',
                inline: false
            }
        )
        .setImage('https://media.discordapp.net/attachments/1360245388816154686/1406764289922174996/line.png?ex=68a3a6d7&is=68a25557&hm=814ab13c8d00160dfd9964ba36e57516d53a5ba5c7124f9371e386927a5ac846&=&format=webp&quality=lossless')
        .setThumbnail('https://snowhost.cloud/Sequence_01_1.gif')
        .setFooter({ text: 'SnowHost • 7/5/2025 1:05 AM' })
        .setTimestamp();
}

// Function to create buttons
function createButtons() {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('create_account')
                .setLabel('Create Account')
                .setStyle(ButtonStyle.Success)
                .setEmoji('👤'),
            new ButtonBuilder()
                .setLabel('Access Panel')
                .setStyle(ButtonStyle.Link)
                .setURL(config.pterodactylUrl)
                .setEmoji('🔗'),
            new ButtonBuilder()
                .setCustomId('my_account')
                .setLabel('My Account')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📋')
        );
}

// Function to create account in Pterodactyl
async function createPterodactylAccount(email, username, firstName, lastName, customPassword = null) {
    try {
        const password = customPassword || generateRandomPassword();
        const userData = {
            email: email,
            username: username,
            first_name: firstName,
            last_name: lastName,
            password: password,
            root_admin: false
        };

        const response = await axios.post(
            `${config.pterodactylUrl}/api/application/users`,
            userData,
            {
                headers: {
                    'Authorization': `Bearer ${config.pterodactylApiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'Application/vnd.pterodactyl.v1+json'
                }
            }
        );

        return {
            success: true,
            user: response.data.attributes,
            password: password,
            pterodactylId: response.data.attributes.id
        };
    } catch (error) {
        console.error('Error creating account:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.errors || 'Unknown error'
        };
    }
}

// Generate random password
function generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Handle interactions
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        // Check allowed channel
        if (interaction.channelId !== config.allowedChannelId) {
            return await interaction.reply({
                content: '❌ You cannot use this command in this channel!',
                ephemeral: true
            });
        }

        if (interaction.customId === 'create_account') {
            // Check if user already created an account
            if (userHasAccount(interaction.user.id)) {
                return await interaction.reply({
                    content: '❌ You have already created an account! You cannot create more than one account.',
                    ephemeral: true
                });
            }

            // Create modal form
            const modal = new ModalBuilder()
                .setCustomId('account_creation_modal')
                .setTitle('❄️ SnowHost Create New Account');

            // Username input
            const usernameInput = new TextInputBuilder()
                .setCustomId('username')
                .setLabel('Username *')
                .setPlaceholder('Enter your username')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(50);

            // Email input
            const emailInput = new TextInputBuilder()
                .setCustomId('email')
                .setLabel('Email *')
                .setPlaceholder('name@gmail.com')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(100);

            // First name input
            const firstNameInput = new TextInputBuilder()
                .setCustomId('firstName')
                .setLabel('First Name *')
                .setPlaceholder('Enter your first name')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(50);

            // Last name input
            const lastNameInput = new TextInputBuilder()
                .setCustomId('lastName')
                .setLabel('Last Name *')
                .setPlaceholder('Enter your last name')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(50);

            // Password input (اختياري)
            const passwordInput = new TextInputBuilder()
                .setCustomId('password')
                .setLabel('Password (Optional)')
                .setPlaceholder('Leave empty for auto-generated password')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setMaxLength(50);

            // Create action rows
            const firstRow = new ActionRowBuilder().addComponents(usernameInput);
            const secondRow = new ActionRowBuilder().addComponents(emailInput);
            const thirdRow = new ActionRowBuilder().addComponents(firstNameInput);
            const fourthRow = new ActionRowBuilder().addComponents(lastNameInput);
            const fifthRow = new ActionRowBuilder().addComponents(passwordInput);

            // Add inputs to modal
            modal.addComponents(firstRow, secondRow, thirdRow, fourthRow, fifthRow);

            // Show modal
            await interaction.showModal(modal);
        }

        // زر عرض معلومات الحساب
        else if (interaction.customId === 'my_account') {
            const userData = getUserData(interaction.user.id);
            
            if (!userData) {
                return await interaction.reply({
                    content: '❌ You don\'t have an account yet! Please create one first.',
                    ephemeral: true
                });
            }

            const accountEmbed = new EmbedBuilder()
                .setColor(0x8B7CF8)
                .setTitle('📋 Your Account Information')
                .setDescription('**Here are your account details:**')
                .addFields(
                    { name: '📧 Email', value: userData.email, inline: true },
                    { name: '👤 Username', value: userData.username, inline: true },
                    { name: '🔐 Password', value: `||${userData.password}||`, inline: false },
                    { name: '📅 Created At', value: new Date(userData.createdAt).toLocaleDateString(), inline: true },
                    { name: '🌐 Panel URL', value: config.pterodactylUrl, inline: false }
                )
                .setFooter({ text: 'Keep this information secure!' })
                .setTimestamp();

            await interaction.reply({ embeds: [accountEmbed], ephemeral: true });
        }
    } 
    
    // Handle modal submission
    else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'account_creation_modal') {
            const username = interaction.fields.getTextInputValue('username');
            const email = interaction.fields.getTextInputValue('email');
            const firstName = interaction.fields.getTextInputValue('firstName');
            const lastName = interaction.fields.getTextInputValue('lastName');
            const customPassword = interaction.fields.getTextInputValue('password') || null;

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return await interaction.reply({
                    content: '❌ **Invalid email format!** Please enter a valid email address.',
                    ephemeral: true
                });
            }

            // Show loading message
            await interaction.reply({
                content: '⏳ **Creating your account, please wait...**',
                ephemeral: true
            });

            // Create account
            const result = await createPterodactylAccount(email, username, firstName, lastName, customPassword);
            
            if (result.success) {
                // Save user to database with full information
                const savedUser = addUser(
                    interaction.user.id,
                    email,
                    username,
                    result.password
                );

                // Update pterodactyl ID
                updateUserPterodactylId(interaction.user.id, result.pterodactylId);

                const successEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('✅ Account Created Successfully!')
                    .setDescription('**Your SnowHost account has been created successfully!**')
                    .addFields(
                        { name: '📧 Email', value: email, inline: true },
                        { name: '👤 Username', value: username, inline: true },
                        { name: '🆔 User ID', value: `#${result.pterodactylId}`, inline: true },
                        { name: '🔐 Password', value: `||${result.password}||`, inline: false },
                        { name: '🌐 Panel URL', value: config.pterodactylUrl, inline: false }
                    )
                    .setFooter({ text: '⚠️ Keep this information safe!' })
                    .setTimestamp();

                await interaction.editReply({ content: null, embeds: [successEmbed] });

                // Also send DM with account details
                try {
                    const dmEmbed = new EmbedBuilder()
                        .setColor(0x8B7CF8)
                        .setTitle('🎉 Welcome to SnowHost!')
                        .setDescription('Your account details have been sent to you privately.')
                        .addFields(
                            { name: '📧 Email', value: email, inline: true },
                            { name: '👤 Username', value: username, inline: true },
                            { name: '🔐 Password', value: `||${result.password}||`, inline: false },
                            { name: '🌐 Panel URL', value: config.pterodactylUrl, inline: false }
                        )
                        .setFooter({ text: 'SnowHost - Keep this information secure!' })
                        .setTimestamp();

                    await interaction.user.send({ embeds: [dmEmbed] });
                } catch (error) {
                    console.log('Could not send DM to user');
                }

            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('❌ Account Creation Failed')
                    .setDescription('An error occurred while creating your account. Please try again or contact administration.')
                    .addFields(
                        { name: '🔍 Possible Issues:', value: '• Username might already exist\n• Email might already be registered\n• Server connection issue' }
                    )
                    .setFooter({ text: 'SnowHost Support' });

                await interaction.editReply({ content: null, embeds: [errorEmbed] });
            }
        }
    }
});

// Command to send main panel
client.on('messageCreate', async message => {
    if (message.content === '!panel' && message.author.id === '1250502249415839785') {
        const embed = createMainEmbed();
        const buttons = createButtons();
        
        await message.channel.send({
            embeds: [embed],
            components: [buttons]
        });
    }

    // أمر لعرض إحصائيات المستخدمين (للمدير فقط)
    if (message.content === '!users' && message.author.id === '1250502249415839785') {
        const users = loadUsers();
        const statsEmbed = new EmbedBuilder()
            .setColor(0x8B7CF8)
            .setTitle('📊 User Statistics')
            .setDescription(`**Total registered users:** ${users.length}`)
            .addFields(
                { name: '📈 Recent Users:', value: users.slice(-5).map(user => `• ${user.username} (${user.email})`).join('\n') || 'No users yet', inline: false }
            )
            .setTimestamp();

        await message.reply({ embeds: [statsEmbed] });
    }
});

// Login
client.login(config.token);