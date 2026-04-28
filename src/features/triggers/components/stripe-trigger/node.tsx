import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";
import { fetchStripeTriggerRealtimeToken } from "./actions";

export const StripeTriggerNode = memo((props: NodeProps) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        //channel:httpRequestChannel().name,
        channel: STRIPE_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchStripeTriggerRealtimeToken,

    });

    return (
        <>
            <StripeTriggerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
            <BaseTriggerNode
                {...props}
                // id = {props.id}
                icon="/logos/stripe.svg"
                name="Stripe"
                description="When stripe event is captured"

                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
});