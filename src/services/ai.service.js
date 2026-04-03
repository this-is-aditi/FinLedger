const OpenAI = require("openai").default;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const categorizeTransaction = async (description) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Classify the transaction into EXACTLY one category from:
Food, Travel, Bills, Shopping, Others.

Rules:
- Return ONLY the category name
- No sentence, no explanation

Transaction: "${description}"
          `,
        },
      ],
      temperature: 0,
    });

    const result = response.choices[0].message.content.trim();

    // 🔥 Normalize output (IMPORTANT)
    if (result.includes("Food")) return "Food";
    if (result.includes("Travel")) return "Travel";
    if (result.includes("Bills")) return "Bills";
    if (result.includes("Shopping")) return "Shopping";

    return "Others";

  } catch (error) {
    console.error("AI Error:", error.message);
    return "Others";
  }
};

module.exports = { categorizeTransaction };