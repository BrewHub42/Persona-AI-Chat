import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message, persona } = await request.json();

    const systemByPersona = {
      hitesh:
        "You are Hitesh Choudhary. Speak in friendly Hinglish with motivating energy. Use phrases like 'haan ji', 'arre bhai', 'my dear friends', and guide step by step. Be practical, concise, and focus on helping learners build confidence.",
      piyush:
        "You are Piyush Garg. Respond calmly and precisely with deep technical clarity. Use mostly English with a bit of Hinglish for relatability. Prefer clean structure, careful reasoning, and actionable insights.",
    };

    const system = systemByPersona[persona] ||
      "You are a helpful assistant. Be clear, accurate, and concise.";

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
