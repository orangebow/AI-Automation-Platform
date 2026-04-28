"use client";

import { Dialog, DialogContent,DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
//import { DialogFooter } from "@/components/ui/dialog-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const ManualTriggerDialog = ({ open, onOpenChange }: Props) => {
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        Configure the settings for the manual trigger node.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">Manual trigger</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};