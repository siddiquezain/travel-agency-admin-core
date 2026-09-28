"use client";
import React from 'react';
import { Fab, Tooltip, Box } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WHATSAPP_NUMBER = '917095787635';
const WHATSAPP_MESSAGE = 'Hi! I would like to know more about your travel services.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const WhatsAppButton = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 30,
                right: 30,
                zIndex: 9999,
                borderRadius: '50%',
                '@keyframes whatsappPulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.4)' },
                    '100%': { boxShadow: '0 0 0 20px rgba(37, 211, 102, 0)' },
                },
                animation: 'whatsappPulse 2s infinite',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
        >
            <Tooltip title="Chat on WhatsApp" placement="left">
                <Fab
                    component="a"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="large"
                    aria-label="Chat on WhatsApp"
                    sx={{
                        width: 65,
                        height: 65,
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        boxShadow: '0 10px 25px rgba(37, 211, 102, 0.5)',
                        color: 'white',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #1ebe5d 0%, #0e7a6d 100%)',
                        },
                    }}
                >
                    <WhatsAppIcon fontSize="medium" />
                </Fab>
            </Tooltip>
        </Box>
    );
};

export default WhatsAppButton;
