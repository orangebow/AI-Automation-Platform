import {channel, topic} from "@inngest/realtime";

export const MANAUL_TRIGGER_CHANNEL_NAME = "manual-trigger-execution";

export const manualTriggerChannel = channel(MANAUL_TRIGGER_CHANNEL_NAME)
.addTopic(
    topic("status").type<{
    nodeId: string,
    status: "loading" | "success" | "error";
}>(),
);