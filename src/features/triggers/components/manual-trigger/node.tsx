import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANAUL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manaul-trigger";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        //channel:httpRequestChannel().name,
        channel: MANAUL_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchManualTriggerRealtimeToken,

    });

    return (
        <>
            <ManualTriggerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
            <BaseTriggerNode
                {...props}
                // id = {props.id}
                icon={MousePointerIcon}
                name="When clicking 'Execute workflow'"

                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
});