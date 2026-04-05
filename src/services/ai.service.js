const OpenAI = require("openai").default;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const categorizeTransaction = async (description) => {
  try {
    console.log("AI FUNCTION CALLED");
    console.log("INPUT:", description);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Classify this transaction into ONE category:
Food, Travel, Bills, Shopping, Others.

Transaction: "${description}"

Return only the category name.`,
        },
      ],
      temperature: 0,
    });

    const result = response.choices[0].message.content.trim().toLowerCase();

    console.log("RAW AI RESPONSE:", result);

    if (result.includes("food")) return "Food";
    if (result.includes("travel")) return "Travel";
    if (result.includes("bill")) return "Bills";
    if (result.includes("shop")) return "Shopping";

    return "Others";

  } catch (error) {
    console.error("AI ERROR:", error.message);
    return "Others";
  }
};

module.exports = { categorizeTransaction };