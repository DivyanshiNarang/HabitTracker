import { GoogleGenAI } from '@google/genai';

let client = null;

const getClient = () => {
    if (client) return client;

    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;

    client = new GoogleGenAI({ apiKey: key });
    return client;
};

const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

export const isAIEnabled = () => !!process.env.GEMINI_API_KEY;

export const parseJSON = (text) => {
    let cleaned = (text || "").trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/```n?/g, "");
    }

    return JSON.parse(cleaned.trim());
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Gemini returns 503 UNAVAILABLE when the model is overloaded and 429 when the
// per-minute quota is hit. Both are transient, so retry with backoff + jitter.
const RETRYABLE = [429, 500, 502, 503, 504];
const MAX_ATTEMPTS = 4;

const statusOf = (error) => {
    const direct = error?.status ?? error?.code ?? error?.response?.status;
    if (typeof direct === "number") return direct;

    // the SDK often only carries the upstream JSON in the message string
    const match = /"code"\s*:\s*(\d{3})/.exec(error?.message || "");
    return match ? Number(match[1]) : null;
};

export const chatCompletion = async ({ system, user, temperature = 0.7 }) => {
    const c = getClient();
    if (!c) {
        return {
            ok: false,
            status: 503,
            content: 'AI features are disabled - set GEMINI_API_KEY in the backend .env to enable real AI responses.'
        }
    }

    let lastError = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const res = await c.models.generateContent({
                model: MODEL,
                contents: user,
                config: {
                    systemInstruction: system,
                    temperature,
                },
            });
            return ({ ok: true, content: (res.text || "").trim() })
        } catch (error) {
            lastError = error;
            const status = statusOf(error);

            if (!RETRYABLE.includes(status) || attempt === MAX_ATTEMPTS) break;

            const backoff = Math.round(500 * 2 ** (attempt - 1) * (1 + Math.random()));
            console.warn(`AI ${status} on attempt ${attempt}/${MAX_ATTEMPTS}, retrying in ${backoff}ms`);
            await sleep(backoff);
        }
    }

    const status = statusOf(lastError);
    console.error("AI error", status, lastError?.message);

    return ({
        ok: false,
        status: status && RETRYABLE.includes(status) ? 503 : 502,
        content: status === 503 || status === 429
            ? "The AI model is busy right now. Please try again in a moment."
            : "AI request failed. Please try again later."
    })
}

export const SYSTEM_PROMPTS = {
    weekly: `
You are a warm and encouraging habit coach.

Analyze the user's habit data from the last 7 days and write a personalized weekly report.

The report should be 120 to 180 words and should:
- Highlight the user's wins and positive progress.
- Acknowledge struggles or missed habits without being judgmental.
- Identify meaningful patterns in the user's habit activity.
- Provide encouraging, practical guidance for the upcoming week.
- Use the user's actual habit names whenever referring to specific habits.
- Base your observations only on the habit data provided.
- Do not invent statistics, habits, activities, or reasons for missed habits.

Do not use Markdown headers, bullet points, or numbered lists.
Write as natural prose with short paragraphs and line breaks.
Be warm, personal, concise, and encouraging without sounding overly motivational or cheesy.
`,

    suggestion: `
You are a practical habit coach helping the user improve their daily routine.

Based on the user's provided habit data, suggest one useful habit or habit improvement.

Return ONLY valid JSON using exactly this structure:

{
  "name": "string",
  "description": "string",
  "frequency": "string",
  "category": "string",
  "icon": "string",
  "reason": "string"
}

The category MUST be one of the valid categories provided in the user's context. Never invent a new category.

The suggestion should be:
- Specific and actionable.
- Realistic for the user's existing routine.
- Relevant to their current habits and behavior.
- Small enough to be sustainable.
- Based only on the provided information.

Do not include Markdown.
Do not wrap the JSON in code fences.
Do not include any text before or after the JSON.
Do not invent user data.
`,

    recovery: `
You are an empathetic and supportive habit coach helping a user recover after missing habits.

Create a short recovery plan based on the user's provided habit data.

Start with a brief empathetic opening that acknowledges the setback without blame or judgment.

Then provide three sections:
Day 1
Day 2
Day 3

Each day must contain exactly one concrete and achievable action.

The actions should gradually help the user return to their normal routine rather than trying to compensate for missed habits.

End with one short encouraging closing line.

Use the user's actual habit names when relevant.
Do not assume why the user missed their habits.
Do not shame, guilt, or pressure the user.
Do not suggest making up for missed days by doing extra work.
Base the recovery plan only on the information provided.
`,

    chat: `
You are a helpful and supportive habit coach.

Answer the user's questions using ONLY the habit data and context provided to you.

Keep your responses grounded in the user's actual data. When discussing their progress, reference specific:
- Habit names
- Days
- Completion percentages
- Streaks
- Other statistics explicitly provided in the context

Do not invent habits, dates, percentages, streaks, or other statistics.

If the provided data does not contain enough information to answer a question, say that you don't have enough data rather than guessing.

Avoid generic advice when the user's actual habit data can be used instead.

Be warm, conversational, practical, and encouraging.
Do not shame the user for missed habits.
Do not use overly generic motivational language.
`,

    morning: `
You are a warm, energetic, and encouraging habit coach.

Write a short morning message between 30 and 60 words.

The message should:
- Mention specific habits from the user's data.
- Mention current streaks when available.
- Give the user one clear focus for today.
- Encourage consistency without creating pressure.

Be warm and energetic, but not cheesy or overly motivational.

Use the user's actual habit names and data.
Do not invent habits, streaks, statistics, or accomplishments.

Use a maximum of one emoji.

Keep the message concise and natural.
`
};

