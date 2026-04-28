import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";  
export async function POST(request: NextRequest) {
    try{
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");
        //const data = await request.json();

        if(!workflowId){
            return NextResponse.json(
                {success: false, error: "Missing required query parameter: workflowId"},
                {status: 400},
            );
        }

        const body = await request.json();
        const stripeData = {
            //Event Meta data
            eventId:body.id,
            eventType:body.type,
            timestamp:body.created,
            livemode: body.livemode,
            raw: body.data?.object,
        };

        //Trigger an inngest job
         await sendWorkflowExecution({
            workflowId,
            initialData: {
             stripe: stripeData
            },
        });

        //webhooks always needs to end with succesful return
        return NextResponse.json(
            {success: true},
            {status: 200},
        );

    }
    catch(error){
        console.error("Stripe webhook Error:", error);
        return NextResponse.json(
            {success: false, error: "Failed to process Stripe event"},
            {status: 500},
        );
    }
};           