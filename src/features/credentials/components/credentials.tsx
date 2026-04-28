"use client";
import {formatDistanceToNow,  } from "date-fns";

import { EntityContainer, EntityHeader, EntitySearch,EntityPagination,LoadingView, ErrorView, EmptyView, EntityList, EntityItem } from "@/components/entity-components";
import {  useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
//import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params"; //useWorkflowsParams
import { useEntitySearch } from "@/hooks/use-entity-search";

import {CredentialType} from "@/generated/prisma";
import type {Credential} from "@/generated/prisma";
import { WorkflowIcon } from "lucide-react";
import Image from "next/image";

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialsParams();
    const {searchValue,onSearchChange} = useEntitySearch({
        params,
        setParams,
    });
    return (
        <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search credentials"
        />
);
}


export const CredentialsList = () => {
    
    //throw new Error("Not implemented");
    const credentials = useSuspenseCredentials();
    
    return (
        <EntityList
        items={credentials.data.items}
        getKey={(credential)=>credential.id}
        renderItem={(credential)=> <CredentialItem data={credential}/>}
        emptyView={<CredentialsEmpty/>}
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

export const CredentialsHeader = ({disabled}: {disabled?: boolean}) => 
{   
   return (
    
    <EntityHeader
    title="credentials"
    description="create and manage your credentials"
    newButtonHref="/credentials/new"
    newButtonLabel="New credential"
    disabled = {disabled}
    
    />

    
   );
};

export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams();

    return (
        <EntityPagination
        disabled={credentials.isFetching}
        totalPages={credentials.data.totalPages}
        page={credentials.data.page}
        onPageChange={(page) => setParams({...params, page})}
        />
    );
};


export const CredentialsContainer = ({
    children
}:{
    children: React.ReactNode
}) => {
    return (
        <EntityContainer
        header={<CredentialsHeader/>}
        search={<CredentialsSearch/>}
        pagination={<CredentialsPagination/>}
        >
        {children}
        </EntityContainer>
    )

};

export const CredentialsLoading = () => {
    return <LoadingView message="Loading credentials..."/>;
    
};


export const CredentialsError = () => {
    return <ErrorView message="Error Loading credentials..."/>;
    
};


export const CredentialsEmpty = () => {
    
    const router = useRouter();
    const handleCreate = () => {
        
                router.push(`/credentials/new`);
            
    };
    return (
    <EmptyView 
    onNew={handleCreate}
    message="You haven't created any credentials yet. Get started by creating your first credential."/>
    )
};  

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.GEMINI]: "/logos/gemini.svg",
    [CredentialType.OPENAI]: "/logos/openai.svg",
    [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
};


export const CredentialItem = ({
    data,
}: {
    data: Credential;
})  => {

    const removeCredential = useRemoveCredential();
    const handleRemove = () => {
        removeCredential.mutate({id: data.id});
    };
    const logo = credentialLogos[data.type] || "/logos/openai.svg"; 
    return (
        <EntityItem
        href={`/credentials/${data.id}`}
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt, {addSuffix: true})}{" "}
            &bull; Created{" "}
            {formatDistanceToNow(data.createdAt, {addSuffix: true})}
            </>
        }
        image={
            <div className="size-8 flex items-center justify-center">
            <Image
            src={logo}
            alt={data.type}
            width={16}
            height={16}
            />
            </div>
        }
        onRemove={handleRemove}
        isRemoving={removeCredential.isPending}

        />

    )
}  
