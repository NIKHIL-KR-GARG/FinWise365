import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const CookiesPolicy = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Cookies Policy
      </Typography>
      <Typography variant="body1" paragraph>
        This Cookies Policy explains what cookies are, how we use cookies, how third-parties we may partner with may use cookies on the Service, your choices regarding cookies, and further information about cookies.
      </Typography>
      <Typography variant="h5" gutterBottom>
        What are cookies?
      </Typography>
      <Typography variant="body1" paragraph>
        Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
      </Typography>
      <Typography variant="h5" gutterBottom>
        How we use cookies
      </Typography>
      <Typography variant="body1" paragraph>
        When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="To enable certain functions of the Service" />
        </ListItem>
        <ListItem>
          <ListItemText primary="To provide analytics" />
        </ListItem>
        <ListItem>
          <ListItemText primary="To store your preferences" />
        </ListItem>
      </List>
      <Typography variant="h5" gutterBottom>
        Your choices regarding cookies
      </Typography>
      <Typography variant="body1" paragraph>
        If you would like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
      </Typography>
      <Typography variant="body1" paragraph>
        Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
      </Typography>
    </Box>
  );
};

export default CookiesPolicy;
