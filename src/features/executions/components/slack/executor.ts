import Handlebars from "handlebars";
import {decode} from "html-entities";
import type { NodeExecutor } from "@/features/executions/types";

import { NonRetriableError } from "inngest";

import { slackChannel } from "@/inngest/channels/slack";

import ky from "ky";

//Handlebars.registerHelper("json", (context) => JSON.stringify(context,null,2));
Handlebars.registerHelper("json", (context) => {
   const jsonString = JSON.stringify(context, null, 2);
   const SafeString = new Handlebars.SafeString(jsonString);
   return SafeString;
});

//type HttpRequestData = Record<string, unknown>;
type SlackData = {
   variableName?: string;
   webhookUrl?: string;
   content?: string;
   
};



export const slackExecutor: NodeExecutor<SlackData> =
   async ({
      data, // data is the data that user provided in the node.
      context, //context provides the data from the previous node.
      nodeId, // nodeId is the node id of the node that is currently being executed.
      step, // step is the step object that provides the step tools to the node.
      publish,// publish is the publish function that is used to publish the events to the inngest.
   }) => {
      //Publish "loading" state for http request
      await publish(
         slackChannel().status({
            nodeId,
            status: "loading",
         }),
      );

      

      

      if (!data.content) {
         await publish(
            slackChannel().status({
               nodeId,
               status: "error",
            }),
         );
         throw new NonRetriableError("Slack Node:Content is required");
      }

      const rawContent = Handlebars.compile(data.content)(context);
      const content = decode(rawContent);
      
      try {
         const result = await step.run("slack-webhook", async () => {
            
            if (!data.webhookUrl) {
         await publish(
            slackChannel().status({
               nodeId,
               status: "error",
            }),
         );
         throw new NonRetriableError("Slack Node:Webhook URL is required");
      }
            
            await ky.post(data.webhookUrl, {
               json: {
                  content:content, // The key depends on workflow config.
               },
            });
         if (!data.variableName) {
         await publish(
            slackChannel().status({
               nodeId,
               status: "error",
            }),
         );
         throw new NonRetriableError("Slack Node:Variable name is missing");

      }
            return {
               ...context,
               [data.variableName]: {
                  //discordMessageSent: true, // this was thought but next line is enough to convey the same.
                  messageContent: content.slice(0, 2000),//Explain how they convey the same message? as in if the message is sent then the messageContent will be there and if not then it will not be there.
               },
            }
         });


         await publish( // here we required to publish the status of the node to track the status of the node.
            slackChannel().status({
               nodeId,
               status: "success",
            }),
         );

         return result;

      } catch (error) {
         await publish(
            slackChannel().status({
               nodeId,
               status: "error",
            }),
         );
         throw error;
      }

   };