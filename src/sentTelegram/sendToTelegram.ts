// sendToTelegram.ts
type SendToTelegramParams = {
  name: string;
  phone: string;
  score: number;
};

export const sendToTelegram = async ({ name, phone, score }: SendToTelegramParams) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  console.log(name, phone, score)

  if (!token || !chatId) {
    console.error("❌ Telegram token yoki chat ID topilmadi. .env faylni tekshiring!");
    return;
  }

  const text = `
📝 *Yangi test natijasi:*
👤 Ism: ${name}
📞 Tel: ${phone}
✅ Ball: ${score}
`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });

    if (!res.ok) {
      console.error("❌ Xabar yuborilmadi:", await res.text());
    } else {
      console.log("✅ Telegramga xabar yuborildi!");
    }
  } catch (err) {
    console.error("❌ Telegramga yuborishda xatolik:", err);
  }
};
