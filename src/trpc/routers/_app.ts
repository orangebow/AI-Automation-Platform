//import {z} from 'zod';
//import { inngest } from '@/inngest/client';
//import { baseProcedure,createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import { credentialsRouter } from '@/features/credentials/server/routers';
import { createTRPCRouter } from '../init';
//import prisma from '@/lib/db';
import { workflowsRouter } from '@/features/workflows/server/routers';
import { executionsRouter } from '@/features/executions/server/routers';

//import { google } from '@ai-sdk/google';
//import { generateText } from 'ai';

/*
export const appRouter = createTRPCRouter({
    //testAi: protectedProcedure
    testAi: premiumProcedure.mutation(async ()=>{
        /*const { text } = await generateText({

        model: google('gemini-2.5-flash'),
        prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });
     return text;*/
     /*
     await inngest.send({
        name: "execute/ai",
     });
        return {success: true, message: "Job queued"}
    }),


    *///REMOVE THIS
    /*
    getWorkflows: protectedProcedure
    .query(({ctx})=>{
        //console.log({userId: ctx.auth.user.id});
        
        return prisma.workflow.findMany();
        
    }), 
      //---------------------------------//
    /*createWorkflow: protectedProcedure.mutation(() =>{
        return prisma.workflow.create({
            data: {
                name: "test-workflow"
            },
        });
    }),*/
    //----------------------------------//
    /*createWorkflow: protectedProcedure.mutation(async () =>{
        await inngest.send({
            name: "test/hello.world",
            data:{
                email:"anand@gmail.com"
            },
        })*/
        //------------------------------//
        /*return prisma.workflow.create({
            data: {
                name: "test-workflow"
            },
        });*/
        //----------------------------//
       /* return {success: true, message:"job queued"}
    }),*/

    //---------------------------------//
    /* suppose i am fetching a video, then i have to do following:
     then how to smooth-line: 
    
    // async function
    createWorkflow: protectedProcedure.mutation( async () =>{
         
        // Fetch the video
        await new Promise((resolve)=> setTimeout(resolve, 5_000));

        //Transcribe the video
        await new Promise((resolve)=> setTimeout(resolve, 5_000));

        //send the Transcription to OpenAI.
        await new Promise((resolve)=> setTimeout(resolve, 5_000));
    
        return prisma.workflow.create({
            data: {
                name: "test-workflow"
            },
        });
    }),
    */

    //---------------------------//
//});

export const appRouter = createTRPCRouter({
    workflows: workflowsRouter,
    credentials: credentialsRouter,
    executions: executionsRouter,     
});


//export type definition of API
export type AppRouter = typeof appRouter;