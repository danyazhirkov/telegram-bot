const TelegramApi = require("node-telegram-bot-api");

const token = "6224478255:AAH-0F0empGZ92SSYXdmZZTgRw6mVTCMr9s";

const bot = new TelegramApi(token, { polling: true });

const { gameOptions, againOptions } = require("./options.js");

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "загадал число");
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "оТгадай сука", gameOptions);
};

const start = () => {
    bot.on("message", async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        bot.setMyCommands([
            { command: "/start", description: "Начальное приветствие" },
            { command: "/info", description: "Получить ифнормацию о еГОРЕ" },
            { command: "/game", description: "Поиграть с егором" },
        ]);

        if (text === "/start") {
            await bot.sendSticker(
                chatId,
                `https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/2.webp`
            );
            return bot.sendMessage(chatId, `добро пожаловать`);
        }
        if (text === "/info") {
            return bot.sendMessage(
                chatId,
                `тебя зовут ${msg.from.first_name} ${msg.from.username}`
            );
        }

        if (text === "/game") {
            return startGame(chatId);
        }

        return bot.sendMessage(
            chatId,
            `${msg.from.username}, я тебя не понимать, пошел нахуй`
        );
    });
    bot.on("callback_query", (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === "/again") {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(
                chatId,
                `${msg.from.first_name}, хорош братик, угадал ${chats[chatId]}`,
                againOptions
            );
        } else {
            return bot.sendMessage(
                chatId,
                `${msg.from.first_name}, ты не угадал цифру ${chats[chatId]}, лох`,
                againOptions
            );
        }
    });
};

start();
