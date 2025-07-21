// sendToTelegram.ts

type SendToTelegramParams = {
  name: string;
  phone: string;
  score: number;
  level: string;
  feedback: string;
};

export const sendToTelegram = async ({ name, phone, score, level, feedback }: SendToTelegramParams) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("❌ Telegram token yoki chat ID topilmadi. .env faylni tekshiring!");
    return;
  }

  // 1. Umumiy natijani yuborish
  const summaryText = `
📝 *Yangi test natijasi:*
👤 Ism: ${name}
📞 Tel: ${phone}
✅ Ball: ${score}
🎯 Daraja: ${level}
`;

  try {
    const summaryRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: summaryText,
        parse_mode: "Markdown",
      }),
    });

    if (!summaryRes.ok) {
      console.error("❌ Umumiy natija yuborilmadi:", await summaryRes.text());
    } else {
      console.log("✅ Umumiy natija Telegramga yuborildi!");
    }

    // 2. Feedbackni fayl qilib yuborish
    const blob = new Blob([feedback], { type: "text/plain" });
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("caption", `📝 To‘liq savol-javob natijalari`);
    formData.append("document", blob, `feedback_${name}_${Date.now()}.txt`);

    const fileRes = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      body: formData,
    });

    if (!fileRes.ok) {
      console.error("❌ Feedback fayl yuborilmadi:", await fileRes.text());
    } else {
      console.log("✅ Feedback fayl Telegramga yuborildi!");
    }
  } catch (error) {
    console.error("❌ Xatolik yuz berdi:", error);
  }
};
