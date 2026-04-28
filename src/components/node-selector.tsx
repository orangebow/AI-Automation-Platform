"use client";
import {createId} from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";

import{
    GlobeIcon,
    MousePointerIcon,
   // WebhookIcon,
} from "lucide-react";

import { useCallback, useState } from "react";
import {toast} from "sonner";
import {
Sheet,
SheetContent,
SheetDescription,
SheetHeader,
SheetTitle,
SheetTrigger,
} from "@/components/ui/sheet";

import {NodeType} from "@/generated/prisma"; 
import { Separator } from "./ui/separator";

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    icon: React.ComponentType<{ className?: string }> | string;
    description: string;
};

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Trigger manually",
        icon: MousePointerIcon,
        description: "Runs the flow on clicking a button. Good for getting started quickly",
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form ",
        //icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Forms_2019_logo.svg/2560px-Google_Forms_2019_logo.svg.png",
        icon:"/logos/googleform.svg",
        description: "Runs the flow when the Google Form is submitted",
    },
    {
        type: NodeType.STRIPE_TRIGGER,
        label: "Stripe Event",
        icon: "/logos/stripe.svg",
        description: "Runs the flow when a Stripe event is Captured",
    },
    
];


const ExecutionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        icon: GlobeIcon,
        description: "Make an HTTP request to an external API",
    },
    {
        type: NodeType.GEMINI,
        label: "Gemini",
        icon: "/logos/gemini.svg",
        description: "Uses Google Gemini to generate content/Text",
    },
    {
        type: NodeType.DISCORD,
        label: "Discord",
        icon: "/logos/discord.svg",
        description: "Send a message to discord.",
    },
    {
        type: NodeType.SLACK,
        label: "Slack",
        icon: "/logos/slack.svg",
        description: "Send a message to slack.",
    }
];

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
};


export function NodeSelector({open, onOpenChange, children}: NodeSelectorProps) {
    
    const {setNodes, getNodes, screenToFlowPosition} = useReactFlow();
    const handleNodeSelect = useCallback((selection: NodeTypeOption)=>{
        
        //check if trying to add a manual trigger when one already exists
        if(selection.type === NodeType.MANUAL_TRIGGER){
            const nodes = getNodes();
            const hasManualTrigger = nodes.some((node)=>node.type === NodeType.MANUAL_TRIGGER);
            if(hasManualTrigger){
                toast.error("Only one manual trigger is allowed per workflow");
                return;
            }
        }

        setNodes((nodes)=>{
            const hasInitialTrigger = nodes.some((node)=>node.type === NodeType.INITIAL,
            
            );
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const flowPosition = screenToFlowPosition({
                x:centerX + (Math.random()-0.5)*200, 
                y:centerY + (Math.random()-0.5)*200,
            });


            const newNode = {
                id: createId(),
                type: selection.type,
                position: flowPosition,
                data:{
                    //label: selection.label,
                },
            };

            if(hasInitialTrigger){ return [newNode];}
            
            return [...nodes, newNode];
        });

        onOpenChange(false);

    }, [getNodes, screenToFlowPosition, setNodes,onOpenChange]);
    
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
        {children}
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
            <SheetTitle>What triggers this workflow?</SheetTitle>
            <SheetDescription>
                A trigger is a step that starts a workflow. 
            </SheetDescription>
        </SheetHeader>
        <div>
            {triggerNodes.map((nodeType) =>{
                const Icon = nodeType.icon;
                return(
                    <div
                    key={nodeType.type}
                    className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                    onClick={()=> handleNodeSelect(nodeType)}
                    >
                        <div className="flex items-center gap-6 w-full overflow-hidden">
                            {typeof Icon === "string"?(
                                <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                            ):(
                              <Icon className="size-5"/>  
                            )}
                            <div className="flex flex-col items-start text-left"> 
                            <span className="font-medium text-sm">
                                {nodeType.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {nodeType.description}
                            </span>
                            </div>
                        </div>
                    </div>
                )
            })}
                
            
        </div>

            <Separator/>
            <div>
            {ExecutionNodes.map((nodeType) =>{
                const Icon = nodeType.icon;
                return(
                    <div
                    key={nodeType.type}
                    className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                    onClick={()=> handleNodeSelect(nodeType)}
                    >
                        <div className="flex items-center gap-6 w-full overflow-hidden">
                            {typeof Icon === "string"?(
                                <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                            ):(
                              <Icon className="size-5"/>  
                            )}
                            <div className="flex flex-col items-start text-left"> 
                            <span className="font-medium text-sm">
                                {nodeType.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {nodeType.description}
                            </span>
                            </div>
                        </div>
                    </div>
                )
            })}
                
            
        </div>

            
        </SheetContent>
        
        </Sheet>
    );

};