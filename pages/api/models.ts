import { OpenAIModel, OpenAIModelID, OpenAIModels } from "@/types";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    // const { key } = (await req.json()) as {
    //   key: string;
    // };

    // const target = "https://management.azure.com/subscriptions/9d864643-1d6b-4ce5-93f8-60eb1e6a2172/resourceGroups/cic-ds-openai/providers/Microsoft.CognitiveServices/accounts/pvg-azure-openai/models?api-version=2022-03-01";
    // // const target = "https://api.openai.com/v1/models";

    // const response = await fetch(target, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${key ? key : process.env.AZURE_JWT}`,
    //   }
    // });

    // if (response.status !== 200) {
    //   throw new Error("OpenAI API returned an error");
    // }

    // const json = await response.json();

    // const models: OpenAIModel[] = json.data
    //   .map((model: any) => {
    //     for (const [key, value] of Object.entries(OpenAIModelID)) {
    //       if (value === model.id) {
    //         return {
    //           id: model.id,
    //           name: OpenAIModels[value].name
    //         };
    //       }
    //     }
    //   })
    //   .filter(Boolean);

    const models: OpenAIModel[] = [{
      id: "gpt-35-turbo",
      name: "GPT 3.5 (Azure)"
    }];

    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
