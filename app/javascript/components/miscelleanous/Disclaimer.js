import React from 'react';
import { Box, Typography } from '@mui/material';

const Disclaimer = () => {
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Disclaimer
            </Typography>
            <Typography variant="body1">
                The information provided by FinWise365 is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </Typography>
            <Typography variant="body1">
                <br />
                Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
            </Typography>
            {/* <Typography variant="body1">
                The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
            </Typography> */}
            <Typography variant="body1">
                <br />
                We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site or any website or feature linked in any banner or other advertising. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.
            </Typography>
        </Box>
    );
};

export default Disclaimer;
