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
        const formData = {
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw: body,
        };

        //Trigger an inngest job
         await sendWorkflowExecution({
            workflowId,
            initialData: {
             googleForm: formData
            },
        });

        //webhooks always needs to end with succesful return
        //so they dont retry the webhook, there is limit of retries
        return NextResponse.json(
            {success: true},
            {status: 200},
        );

    }
    catch(error){
        console.error("Google Form webhook Error:", error);
        return NextResponse.json(
            {success: false, error: "Failed to process Google Form submission"},
            {status: 500},
        );
    }
};           