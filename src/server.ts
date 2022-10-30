import "dotenv/config";

import { Markup, Telegraf } from "telegraf";
import { add, getList, remove } from "./shoppinglist";

const bot = new Telegraf(process.env.TELEGRAM_KEY ?? "");

const yesNo = (key: string) =>
  Markup.inlineKeyboard([
    Markup.button.callback("Yes", `yes ${key}`),
    Markup.button.callback("No", "no"),
  ]);

bot.start((ctx) => ctx.reply("Welcome to Shopping List"));

bot.command("list", async (ctx, next) => {
  const list = await getList();

  ctx.reply(
    "List",
    Markup.inlineKeyboard(
      list.map((p) => [Markup.button.callback(p.text, `delete ${p.text}`)])
    )
  );
  next();
});

bot.command("test", async (ctx, next) => {
  ctx.reply("Bot está em teste");
});

bot.on("text", async (ctx, next) => {
  if (ctx.message.text != "/list") {
    await add(ctx.message.text);

    const list = await getList();

    ctx.reply(
      "List",
      Markup.inlineKeyboard(
        list.map((p) => [Markup.button.callback(p.text, `delete ${p.text}`)])
      )
    );
  }
  next();
});

bot.action(/delete (.+)/, (ctx, next) => {
  ctx.reply(`Delete ${ctx.match[1]}`, yesNo(ctx.match[1]));
  next();
});

bot.action(/yes (.+)/, async (ctx, next) => {
  await remove(ctx.match[1]);

  const list = await getList();

  ctx.reply(
    "List",
    Markup.inlineKeyboard(
      list.map((p) => [Markup.button.callback(p.text, `delete ${p.text}`)])
    )
  );
  next();
});

bot.action(/no (.+)/, async (ctx, next) => {
  const list = await getList();

  ctx.reply(
    "List",
    Markup.inlineKeyboard(
      list.map((p) => [Markup.button.callback(p.text, `delete ${p.text}`)])
    )
  );
  next();
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
