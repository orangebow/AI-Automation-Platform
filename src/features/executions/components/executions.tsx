"use client";
import {formatDistanceToNow,  } from "date-fns";

import { EntityContainer, EntityHeader, EntityPagination,LoadingView, ErrorView, EmptyView, EntityList, EntityItem } from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
//import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useExecutionsParams } from "../hooks/use-executions-params"; //useWorkflowsParams

import {ExecutionStatus} from "@/generated/prisma";
import type { Execution} from "@/generated/prisma";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";





export const ExecutionsList = () => {
    
    //throw new Error("Not implemented");
    const executions = useSuspenseExecutions();
    
    return (
        <EntityList
        items={executions.data.items}
        getKey={(execution)=>execution.id}
        renderItem={(execution)=> <ExecutionItem data={execution}/>}
        emptyView={<ExecutionsEmpty/>}
        />
    )
    
    /*if(workflows.data.items.length === 0){
        return (
            <WorkflowsEmpty/>
        );           
    }

    return (
        <div className="flex-1 flex justify-center items-center">
        <p>
            {JSON.stringify(workflows.data, null, 2)}
        </p>
        </div>
    );*/
};

export const ExecutionsHeader = ({disabled}: {disabled?: boolean}) => 
{   
   return (
    
    <EntityHeader
    title="Executions"
    description="View your workflow execution history"
    />

    
   );
};

export const ExecutionsPagination = () => {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionsParams();

    return (
        <EntityPagination
        disabled={executions.isFetching}
        totalPages={executions.data.totalPages}
        page={executions.data.page}
        onPageChange={(page) => setParams({...params, page})}
        />
    );
};


export const ExecutionsContainer = ({
    children
}:{
    children: React.ReactNode
}) => {
    return (
        <EntityContainer
        header={<ExecutionsHeader/>}
        pagination={<ExecutionsPagination/>}
        >
        {children}
        </EntityContainer>
    )

};

export const ExecutionsLoading = () => {
    return <LoadingView message="Loading executions..."/>;
    
};


export const ExecutionsError = () => {
    return <ErrorView message="Error Loading executions..."/>;
    
};


export const ExecutionsEmpty = () => {
    
    return (
    <EmptyView 
    message="You haven't created any executions yet. Get started by creating your first workflow."/>
    )
};  

const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600" />;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600" />;
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
        default:
            return <ClockIcon className="size-5 text-muted-foreground" />;
    }
};

const formatStatus = (status: ExecutionStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

export const ExecutionItem = ({
    data,
}: {
    data: Execution & {
    workflow: {
        id: string;
        name: string
    };
    };
})  => {
    const duration = data.completedAt ? Math.round((new Date (data.completedAt).getTime() - new Date(data.startedAt).getTime())/1000) : null;
    
    const subtitle = (
        <>
        {data.workflow.name} &bull; Started{" "}
        {formatDistanceToNow(data.startedAt, {addSuffix: true})}
        {duration !== null && <>&bull; Took {duration}s</>}
        </>
    );
    
    return (
        <EntityItem
        href={`/executions/${data.id}`}
        title={formatStatus(data.status)}
        subtitle= {subtitle}
        image={
            <div className="size-8 flex items-center justify-center">
                {getStatusIcon(data.status)}
            </div>
        }
        

        />

    )
}  
