import { WorkflowsLoading, WorksflowsList } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { WorkflowsContainer, WorkflowsError } from "@/features/workflows/components/workflows";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import{ErrorBoundary} from "react-error-boundary";
import type { SearchParams } from "nuqs";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";

type Props = {
    searchParams: Promise<SearchParams>;                     

}

const Page = async ({searchParams}: Props) => {
    await requireAuth();

    const params = await workflowsParamsLoader(searchParams);

    prefetchWorkflows(params);
    //return  <p>Workflows</p>
    return (
        <WorkflowsContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<WorkflowsError/>}>
            <Suspense fallback={<WorkflowsLoading/>}>
                <WorksflowsList/>
            </Suspense>
            </ErrorBoundary>
        </HydrateClient>
        </WorkflowsContainer>
    )
};

export default Page;