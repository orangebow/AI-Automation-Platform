import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
//import ky ,{type Options as KyOptions}from "ky";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { geminiChannel } from "@/inngest/channels/gemini";
import prisma from "@/lib/db";

//Handlebars.registerHelper("json", (context) => JSON.stringify(context,null,2));
Handlebars.registerHelper("json", (context) => {
   const jsonString = JSON.stringify(context, null, 2);
   const SafeString = new Handlebars.SafeString(jsonString);
   return SafeString;
});

//type HttpRequestData = Record<string, unknown>;
type GeminiData = {
   variableName?: string;
   credentialId?: string;
   model?: string;
   systemPrompt?: string;
   userPrompt?: string;
};



export const geminiExecutor: NodeExecutor<GeminiData> =
   async ({
      data, // data is the data that user provided in the node.
      context, //context provides the data from the previous node.
      userId, // userId is the user id of the user who created the workflow.
      nodeId, // nodeId is the node id of the node that is currently being executed.
      step, // step is the step object that provides the step tools to the node.
      publish,// publish is the publish function that is used to publish the events to the inngest.
   }) => {
      //Publish "loading" state for http request
      await publish(
         geminiChannel().status({
            nodeId,
            status: "loading",
         }),
      );

      if (!data.variableName) {
         await publish(
            geminiChannel().status({
               nodeId,
               status: "error",
            }),
         );
         throw new NonRetriableError("Gemini Node:Variable name is missing");

      }

      if (!data.credentialId) {
         await publish(
            geminiChannel().status({
               nodeId,
               status: "error",
            }),
         );
         throw new NonRetriableError("Gemini Node:Credential is required");
      }

      if (!data.userPrompt) {
         await publish(
            geminiChannel().status({
               nodeId,
               status: "error",
            }),
         );
         throw new NonRetriableError("Gemini Node:User prompt is required");
      }


      //Throw if credential is missing.
      const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";


      const userPrompt = Handlebars.compile(data.userPrompt)(context);
      //Fetch credential that user selected.
      const credential = await step.run("get-credential", () => {
         return prisma.credential.findUnique({
            where: {
               id: data.credentialId, // this can be injected from parent node.
               userId, // after fetching workflow we can get userId from there.
               //how we are secured from injection attacks?
               //we are not using any user input to fetch credential.
               //we are using userId to fetch credential.
               //In-depth we are actually using workflowId to fetch userId.
               //so we are not vulnerable to injection attacks.
               //But we are still vulnerable to injection attacks indirectly as we are using workflowId to fetch userId.
               //By using advance techniques such as 
            },
         });
      });

      if (!credential) {
         await publish(
            geminiChannel().status({
               nodeId,
               status: "error",
            }),
         );
         throw new NonRetriableError("Gemini Node:Credential not found");
      }

      const google = createGoogleGenerativeAI({
         apiKey: credential.value,
      });

      try {
         const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
               //model: google(data.model || "gemini-2.0-flash"),
               model: google(data.model || "gemini-flash-latest"),
               system: systemPrompt,
               prompt: userPrompt,
               experimental_telemetry: {
                  isEnabled: true, // we have to enable telemetry to track the inputs and outputs for debugging of the node.
                  recordInputs: true, // we have to record inputs to track the inputs for debugging of the node.
                  recordOutputs: true, // we have to record outputs to track the outputs for debugging of the node.
               },
            },
         );

         const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";
         await publish( // here we required to publish the status of the node to track the status of the node.
            geminiChannel().status({
               nodeId,
               status: "success",
            }),
         );

         return {
            ...context,
            [data.variableName]: {
               //aiResponse:text,
               text,

            },
         }

      } catch (error) {
         await publish(
            geminiChannel().status({
               nodeId,
               status: "error",
            }),
         );
         throw error;
      }

   };