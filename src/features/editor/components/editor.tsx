"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import {useSuspenseWorkflow} from "@/features/workflows/hooks/use-workflows";
import {useState, useCallback, useMemo} from "react";

import{
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Edge,
    type Node,
    type NodeChange,
    type EdgeChange,
    type Connection,
    Background,
    MiniMap,
    Controls,
    Panel,
    
} from "@xyflow/react";


import '@xyflow/react/dist/style.css'; // eslint-disable-line
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";

import {useSetAtom} from "jotai";
import { editorAtom } from "../store/atom";
import { NodeType } from "@/generated/prisma";
import { ExecuteWorkflowButton } from "./execute-workflow-button";


export const EditorLoading = () =>{
    return <LoadingView message="Loading Editor..." />;
};

export const EditorError = () => {
    return <ErrorView message="Failed to load editor" />;
};

/*
const initialNodes = [
{id: 'n1', position:{x:0, y:0}, data: {label: 'Node 1'}},
{id: 'n2', position:{x:0, y:100}, data: {label: 'Node 2'}},
];


const initialEdges = [
    {id: 'n1-n2', source: 'n1', target: 'n2'}
];
*/

export const Editor = ({workflowId}: {workflowId: string}) => {
    const {data: workflow} = useSuspenseWorkflow(workflowId);

    const setEditor = useSetAtom(editorAtom);
    

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const onNodesChange = useCallback((changes: NodeChange[]) => 
        setNodes((nodesSnapshot: Node[]) => applyNodeChanges(changes, nodesSnapshot)),
     [],);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => 
        setEdges((edgesSnapshot: Edge[]) => applyEdgeChanges(changes, edgesSnapshot)),
     [],);

    const onConnect = useCallback((params: Connection) => 
        setEdges((edgesSnapshot: Edge[]) => addEdge(params, edgesSnapshot)),
     [],);


    
    const hasManualTrigger = useMemo(() => {
        return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
     }, [nodes]);
    
    return (
        <div className='size-full'>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        fitView
        onInit={setEditor} 

        snapGrid={[10,10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        /*proOptions={{
         hideAttribution: true,   
        }}*/
        >
        <Background />
        
        <Controls />
        <MiniMap />
        <Panel position="top-right">
        <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
            <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId}/>
            </Panel>
        )}
        </ReactFlow>
        </div>
        
    );
};