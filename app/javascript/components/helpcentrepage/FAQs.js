import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQs = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">General Questions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">What is FinWise365?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                FinWise365 is a comprehensive financial planning tool designed to help you manage your assets, liabilities, and cash flows effectively.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How do I create an account on FinWise365?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                To create an account, click on the "Sign Up" button on the homepage and follow the instructions to register.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How do I reset my password?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                If you have forgotten your password, click on the "Forgot Password" link on the login page and follow the instructions to reset it.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Account Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How do I update my profile information?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                You can update your profile information by navigating to the "Profile" section in your account settings.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How do I change my base currency?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                To change your base currency, go to the "Settings" section and select your preferred currency from the dropdown menu.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Financial Planning</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How do I add a new asset?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                To add a new asset, go to the "Assets" section and click on the "+" button at the bottom right of the screen. Fill in the required details and save.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How do I track my expenses?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                You can track your expenses by adding them in the "Expenses" section. You can categorize your expenses and view detailed reports.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Cash Flow Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How do I generate a cash flow report?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                To generate a cash flow report, go to the "Analyze - Cashflow" Menu Option and select "CashFlow". It will generate the cashflows based on your life expectancy settings.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How do I simulate different financial scenarios?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                You can simulate different financial scenarios using the "Insights - Simulations" feature. Enter the parameters for the scenario you want to simulate and view the results.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Security and Privacy</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How is my data secured on FinWise365?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                FinWise365 uses industry-standard encryption and security measures to protect your data. For more details, refer to our Privacy Policy.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Can I export my financial data?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Yes, you can export your financial data in Excel format by using the Download feature on the top right of each page under the Portfolio section.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Support</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How do I contact customer support?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                If you need assistance, you can contact our customer support team by clicking on the "Contact Us" link.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Where can I find tutorials and guides?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                You can find video tutorials and guides/blogs in the "Help Centre" section.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Miscellaneous</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">What should I do if I encounter a bug or issue?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                If you encounter a bug or issue, please report it to our support team through the "Contact Us" link.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQs;
