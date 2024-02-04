const { Telegraf } = require("telegraf");
const { searchMedia } = require("./tmdb");
const { addMedia } = require("./firebase/config");
const {
  formatText,
  createMessageText,
  formatTextForFirestore,
} = require("./utils");

require("dotenv").config();

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN);
console.log("nodemon started running");
var list;

bot.start(async (ctx) => {
  const message = await ctx.reply("Bot is in working condition");
  setTimeout(() => {
    ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
  }, 2000);
});

bot.command("movie", async (ctx) => {
  const message = ctx.message.text.replace("/movie", "").trim();
  if (message.length === 0) {
    ctx.reply("Please provide a movie name");
    return;
  }
  let reply = await ctx.reply("searching...");

  const list = await searchMedia(message, "movie");
  ctx.telegram.editMessageText(
    reply.chat.id,
    reply.message_id,
    null,
    formatText(list)
  );
});

bot.command("series", async (ctx) => {
  const message = ctx.message.text.replace("/series", "").trim();
  if (message.length === 0) {
    ctx.reply("Please provide a series name");
    return;
  }
  let reply = await ctx.reply("searching...");

  const list = await searchMedia(message, "tv");
  ctx.telegram.editMessageText(
    reply.chat.id,
    reply.message_id,
    null,
    formatText(list)
  );
});

bot.on("inline_query", async (ctx) => {
  const query = ctx.inlineQuery.query;
  if (!query) return;
  try {
    list = await searchMedia(query, "movie");
    const inlineResults = list.map((result, index) => ({
      type: "article",
      id: index,
      title: result.title,
      description: `(${result.year})`,
      thumb_url: `https://image.tmdb.org/t/p/w342/${result.poster_path}`,
      input_message_content: {
        message_text: createMessageText(result),
        parse_mode: "HTML",
      },
    }));
    ctx.answerInlineQuery(inlineResults);
  } catch (error) {
    console.log(error);
  }
});

bot.on("chosen_inline_result", async (ctx) => {
  const chosenResult = ctx.chosenInlineResult;
  let index = parseInt(chosenResult.result_id, 10);
  const data = formatTextForFirestore(list[index]);
  const state = await addMedia(data);
  if (state) {
    console.log("uploaded to the datbase");
  } else {
    console.log("unable to upload to the database");
  }
});

bot.launch();
console.log("The bot has been started...");
