"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
//import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {
    GeminiFormValues, GeminiDialog,
    // AVAILABLE_MODELS 
} from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { GEMINI_CHANNEL_NAME, } from "@/inngest/channels/gemini";
import { fetchGeminiRealtimeToken } from "./actions";

type GeminiNodeData = {
    variableName?: string;
    //model?: string;
    systemPrompt?: string;
    userPrompt?: string;
    credentialId?: string;
    //[key: string]: unknown; //never used.
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const handleOpenSettings = () => {
        setDialogOpen(true);
    };
    const { status, message } = useNodeStatus({
        nodeId: props.id,
        //channel:httpRequestChannel().name,
        channel: GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken,

    });
    const handleSubmit = (values: GeminiFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                        /*endpoint: values.endpoint,
                        method: values.method,
                        body: values.body*/
                    }
                }

            }
            return node;
        }))
    };

    const nodeData = props.data;
    const description =
        status === "error" && message
            ? `Error: ${message}`
            : nodeData?.userPrompt
                // ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 50)}...`
                ? `gemini-2.0-flash: ${nodeData.userPrompt.slice(0, 50)}...`
                : "Not configured";



    return (
        <>
            <GeminiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                /*defaultEndpoint = {nodeData.endpoint} // TODO: check if it can be improved by just sending initialValues={nodeData}
                defaultMethod = {nodeData.method}
                defaultBody = {nodeData.body}*/
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/gemini.svg"
                name="Gemini"
                status={status}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
});

GeminiNode.displayName = "GeminiNode";
