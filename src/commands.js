import { InlineKeyboard } from "grammy";
import { getActiveSymbols } from "./marketData.js";

export function registerCommands(bot) {

  bot.command("start", ctx =>
    ctx.reply(
      "Welcome to PipHunters Sniper Engine.\n\nUse /help to see commands."
    )
  );

  bot.command("help", ctx =>
    ctx.reply(
      "Available commands:\n\n/start - Start bot\n/help - Show commands\n/ping - Check bot\n/id - Show your ID\n/markets - List Deriv markets"
    )
  );

  bot.command("ping", ctx => ctx.reply("Pong! Bot is online."));

  bot.command("id", ctx =>
    ctx.reply(`Chat ID: ${ctx.chat.id}\nUser ID: ${ctx.from?.id}`)
  );

  bot.command("markets", async ctx => {
    await ctx.reply("Checking Deriv markets...");

    try {
      const symbols = await getActiveSymbols();

      if (!symbols.length) {
        await ctx.reply("No markets were returned by Deriv.");
        return;
      }

      const names = symbols.map(s =>
        `${s.display_name || s.symbol} — ${s.symbol}`
      );

      await ctx.reply(
        "DERIV AVAILABLE MARKETS\n\n" + names.slice(0, 100).join("\n")
      );

    } catch (error) {
      console.error("Market error:", error);
      await ctx.reply(`Market check failed: ${error.message}`);
    }
  });

  bot.callbackQuery("ping", async ctx => {
    await ctx.answerCallbackQuery({ text: "Pong!" });
  });

  bot.on("message:text", ctx => {
    if (!ctx.message.text.startsWith("/")) {
      return ctx.reply(ctx.message.text);
    }
  });
          }
