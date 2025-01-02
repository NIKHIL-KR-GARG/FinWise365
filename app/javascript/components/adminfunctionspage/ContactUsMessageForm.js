import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, TextField, Typography } from '@mui/material';

const ContactUsMessageForm = ({ userMessage }) => {

    return (
        <Box sx={{ fontSize: 'xx-small', p: 2, maxHeight: '100vh' }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ pb: 2 }}>
                User Message Details
            </Typography>
            <Grid container spacing={1}>
                <Grid item size={12}>
                    <TextField
                        label="Name"
                        value={userMessage.name}
                        required
                        fullWidth
                        margin="dense"
                        slotProps={{ input: { readOnly: true } }}
                    />
                </Grid>
                <Grid item size={12}>
                    <TextField
                        label="Company"
                        value={userMessage.company}
                        fullWidth
                        margin="dense"
                        slotProps={{ input: { readOnly: true } }}
                    />
                </Grid>
                <Grid item size={12}>
                    <TextField
                        label="Email"
                        type="email"
                        value={userMessage.email}
                        required
                        fullWidth
                        margin="dense"
                        slotProps={{ input: { readOnly: true } }}
                    />
                </Grid>
                <Grid item size={12}>
                    <TextField
                        label="Message"
                        value={userMessage.message}
                        multiline
                        required
                        rows={4}
                        fullWidth
                        margin="dense"
                        slotProps={{ input: { readOnly: true } }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ContactUsMessageForm;