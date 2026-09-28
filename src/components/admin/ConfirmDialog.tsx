"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    body: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isPending?: boolean;
}

export function ConfirmDialog({
    open,
    title,
    body,
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false,
    onConfirm,
    onCancel,
    isPending = false
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={isPending ? undefined : onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {danger && <AlertTriangle color="#ef4444" size={24} />}
                {title}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" color="text.secondary">
                    {body}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button 
                    onClick={onCancel} 
                    disabled={isPending} 
                    color="inherit" 
                    variant="outlined"
                    sx={{ borderRadius: "8px" }}
                >
                    {cancelText}
                </Button>
                <Button 
                    onClick={onConfirm} 
                    disabled={isPending} 
                    color={danger ? "error" : "primary"} 
                    variant="contained"
                    sx={{ borderRadius: "8px" }}
                >
                    {isPending ? "Processing..." : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
