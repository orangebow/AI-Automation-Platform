"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
//import { DialogFooter } from "@/components/ui/dialog-footer";
import z from "zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";



import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";


/*export const AVAILABLE_MODELS = [ // need to be removed.
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-pro",
] as const; */


const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { message: "Variable name must start with a letter or underscore and container only letters, numbers, and underscores" }),
   
    
    content : z
    .string()
    .min(1, { message: "Message Content is required" })
    .max(4000, { message: "Discord messages cannot exceed 4000 characters" }),
    webhookUrl: z.string().min(1, "Webhook URL is required")// we are using string and not zod url because we are not validating it. In otherwords, we are not checking if it is a valid url. If we have use the zod url it will not work for the webhook url which contains special characters like @, #, etc.
});

export type SlackFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<SlackFormValues>;
    /*defaultEndpoint?: string;
    defaultMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    defaultBody?: string;*/
};

export const SlackDialog = ({ open, onOpenChange,
    onSubmit,
    defaultValues = {}
}: Props) => {
    
    //Below function is used to set the default values of the form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            content: defaultValues.content || "",
            webhookUrl: defaultValues.webhookUrl || "",
        },
    });


    //No need for watchMethod 
    const watchVariableName = form.watch("variableName") || "mySlack";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                content: defaultValues.content || "",
                webhookUrl: defaultValues.webhookUrl || "",
            });
        }
    }, [open, defaultValues, form]);



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Slack node for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4">

                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="mySlack"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in the other nodes:{" "}
                                        {`{{${watchVariableName}.aiResponse}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control = {form.control}
                            name = "webhookUrl"
                            render={({field})=>(
                            <FormItem>
                            <FormLabel>Webhook URL</FormLabel>
                            <FormControl>
                            <Input 
                            placeholder="https://discord.com/api/webhooks/...."  
                            {...field}
                            />
                            </FormControl>
                            <FormDescription>
                            Get this from Slack: workspace Settings - Integrations - Workflows - New Webhook
                            </FormDescription>  
                            <FormMessage/>
                            </FormItem>
                            )}
                            />


                        {/*<FormField // this form field need to be removed.
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {AVAILABLE_MODELS.map((model) => (
                                                <SelectItem key={model} value={model}>
                                                    {model}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The Google Gemini model to use for completion.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />*/}









                        <FormField //this controls the message that is sent to discord
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Summary: {{myGemini.text}}"
                                            className="min-h-[80px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The message to send. Use {"{{variables}}"} for simple values or {"{{jsonvariable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />


                         


                        <DialogFooter className="mt-4">


                            <Button type="submit">Save</Button>
                        </DialogFooter>


                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};