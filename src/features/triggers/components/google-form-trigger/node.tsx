import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export const GoogleFormTrigger = memo((props: NodeProps) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        //channel:httpRequestChannel().name,
        channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGoogleFormTriggerRealtimeToken,

    });

    return (
        <>
            <GoogleFormTriggerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
            <BaseTriggerNode
                {...props}
                // id = {props.id}
                icon="/logos/googleform.svg"
                name="Google Form"
                description="When form is submitted"

                //status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
});