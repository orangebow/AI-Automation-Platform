import {Inngest} from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";


// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "nodebase",
    middleware:[realtimeMiddleware()], 
});

// Create an empty array where we'll export future Inngest functions
//export const functions = [];