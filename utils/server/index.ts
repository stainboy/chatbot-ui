import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (model: OpenAIModel, systemPrompt: string, key: string, messages: Message[]) => {

  // const target = "https://api.openai.com/v1/chat/completions";
  const target = process.env.AZURE_COMPLETION_ENDPOINT as string;

  const res = await fetch(target, {
    headers: {
      "Content-Type": "application/json",
      "api-key": `${process.env.AZURE_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: model.id,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.0,
      stream: true
    })
  });

  if (res.status !== 200) {
    const statusText = res.statusText; 
    throw new Error(`OpenAI API returned an error: ${statusText}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};
