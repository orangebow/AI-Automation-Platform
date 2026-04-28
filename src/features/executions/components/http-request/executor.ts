import Handlebars from "handlebars";
import type {NodeExecutor} from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky ,{type Options as KyOptions}from "ky";
import { httpRequestChannel } from "@/inngest/channels/http-request";

//Handlebars.registerHelper("json", (context) => JSON.stringify(context,null,2));
Handlebars.registerHelper("json", (context) => {
   const jsonString = JSON.stringify(context,null,2);
   const SafeString = new Handlebars.SafeString(jsonString);
   return SafeString;
});

//type HttpRequestData = Record<string, unknown>;
type HttpRequestData = {
   variableName?: string;
   endpoint?: string;
   method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
   body?: string;
};



export const httpRequestExecutor: NodeExecutor<HttpRequestData> = 
async ({ 
   data,
   context,
   nodeId, 
   step,
   publish,// cheap
}) => {
   //TODO: Publish "loading" state for http request
   await publish(
      httpRequestChannel().status({
         nodeId,
         status: "loading",
      }),
   );


   

   //1st way://const result = await step.run("http-request", async () => context);
   //2nd way://const result = await step.fetch(data.endpoint);
   try{
   const result = await step.run("http-request", async () => {
    
    
    if(!data.endpoint){
    //Publish "error" state for http request
    await publish(
      httpRequestChannel().status({
         nodeId,
         status: "error",
      }),
   );
    throw new NonRetriableError("Http Request node: No endpoint configured");
   } 

   if(!data.variableName){
    //Publish "error" state for http request
    await publish(
      httpRequestChannel().status({
         nodeId,
         status: "error",
      }),
   );
    throw new NonRetriableError("variable name not configured");
   }

   if(!data.method){
    //Publish "error" state for http request
    await publish(
      httpRequestChannel().status({
         nodeId,
         status: "error",
      }),
   );
    throw new NonRetriableError("method not configured");
   }
    
    
    
    
   //const endpoint = data.endpoint!;
   //const endpoint = data.endpoint;
    const endpoint = Handlebars.compile(data.endpoint ||"{}")(context);
   //const method = data.method || "GET";
    const method = data.method;
   //const body = data.body;

   //validation check:




    

    const options: KyOptions = {method};

    if(["POST","PUT","PATCH"].includes(method)){
      const resolved = Handlebars.compile(data.body)(context); 
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
         "Content-Type": "application/json",
      }
    }
      const response = await ky(endpoint,options);
      //const responseData = await response.json().catch(()=>response.text());
      const contentType = response.headers.get("content-type");
      
      const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();
      
      const responsePayload = {
         httpResponse:{
            status: response.status,
            data: responseData,
            statusText: response.statusText,
         },
      };
    
      
         return {
            ...context,
            [data.variableName]: responsePayload,
         }
      

      //Fallback to direct httpResponse for backward compatibility
      /*return{
         ...context,
         ...responsePayload,
      };
      */
      
      /*return{
         ...context,
         httpResponse:{
            status: response.status,
            data: responseData,
            statusText: response.statusText,
         }
      }*/

   });
   
   //Publish "success" state for http request
   await publish(
      httpRequestChannel().status({
         nodeId,
         status: "success",
      }),
   );

   return result;
}
catch(error){
   await publish(
      httpRequestChannel().status({
         nodeId,
         status: "error",
      }),
   );
   throw error;
}
};