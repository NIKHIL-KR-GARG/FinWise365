import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const BlogsArticles = () => {
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" component="div" align="center" fontWeight="bold">
                How To's
            </Typography>
            <Accordion sx={{ width: '100%', mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Login/Sign-up</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        Before using the application, you will need to create an account so that your data can be saved for future use. If you already have an account, you can login by clicking on the Login button on the top right corner of the screen. Else use the Sign-up button to create an account.
                        <br />
                        The account creation, login and related features are integrated with Auth 0 which is a secure and widely used industry standard. You can either create a login using an email and password or you can use your Google account directly.
                        <br />
                        At the moment this does not support multi-factor authentication, but in the future, we will integrate this with multiple identification methods using Google Authenticator or an authentication code on email or SMS.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">User Account Management</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        Once you have created an account and logged into the system, you would need to setup your profile. Click the settings icon on the top right corner of the screen which will open a pop-up menu. Use the “My Profile” link to open the user account settings screen.
                        <br />
                        On this page you can update your profile details like Name, Gender, Date of Birth, Phone number, Country of Residence etc.
                        <br />
                        The three most important fields are:
                        <br />
                        1. Nationality - which drives property calculations.
                        <br />
                        2. Life Expectancy - which is used for cashflow generation.
                        <br />
                        3. Base Currency - in which all the asset/liability values are converted.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Demo Data feature</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        In the header, you can see a button to turn on and off the demo data. This is a special feature created for new users who can use the already provided dummy data to play around with the various screens in the application.
                        <br />
                        The demo data has been pre-entered and is available in the Read-only mode for all users.
                        <br />
                        Once you are comfortable with the application features and would like to start using it with your own real-world data, just “Switch Off Demo Data” and start on the journey of financial wisdom and control!
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Support pages – About Us, Disclaimer, Contact Us, Coming Soon</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        There are a number of support pages in the application which are available from the header or footer menus on the application landing page or from the Left side menu after the login. These are:
                        <br />
                        1. About Us: What is FinWise365? What is our goal? and what we hope the user would be able to achieve with this application?
                        <br />
                        2. Contact Us: if you have any question, comment, feedback, please send us an email at contactus@finwise365.com or use the form on the Contact Us page to send us a message.
                        <br />
                        3. Coming Soon: A list of features which are work in progress and would be available in the near future. If you would like to see some other feature as part of the application, please do reach out to us via email or contact us page.
                        <br />
                        4. Help Centre: Contains FAQ’s, product videos and blogs/articles to help you on your financial journey.
                        <br />
                        5. Disclaimer/Policy: And finally, some standard disclaimers and cookies policy.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Incomes – What is incomes? How to add an income.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        Let’s talk about the Portfolio Menu. The first on the list is Income.
                        <br />
                        These are the regular or one-time income like Salary, Bonus, Rental and others. Of these, Rental, Dividend, Coupon, Lease and Payout income is automatically generated from various assets like properties, vehicles and portfolios.
                        <br />
                        The graph at the top of the screen shows the income for the current month.
                        <br />
                        For adding an Income, click on the bottom right “+” hover button. This will open an “Add Income” page where you can add a one-time or recurring income with Start Date, End date, frequency and growth rate.
                        <br />
                        Add your income streams here to simulate your future cashflows and fine tune your plans to meet your financial goals.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Expenses – What are expenses? How to add an expense</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        Expense or debt can be one-time or recurring liabilities which can be added from Expenses menu item under Portfolio.
                        <br />
                        You can add Home or Property expenses, Credit card or Personal Loan debt or any generic expenses. Some of the other expenses like EMI, Mortgage, SIP and taxes are automatically derived from the Assets like property, vehicle and portfolio.
                        <br />
                        The graph at the top of the screen shows the pie-chart for the current month expenses.
                        <br />
                        For adding an expense, click on the bottom right “+” hover button which opens a pop-up menu. Choose the expense type that you want to add and fill in the fields required for that expense type. For example, choosing Home brings us to “Add Household Living Expenses” screen. Here we can add various home expenses like Rental, Groceries and others. End date can be left blank and will then be considered forever. Inflation can be added for each expense line item separately.
                        <br />
                        The Grid shows the various expenses under each category which are active at this time and you can Edit or Delete any expense from the grid.
                        <br />
                        You can also toggle the “Include Past…” toggle button to see the expenses which were in the past and are hence not showing now in the grid.
                        <br />
                        Add your expense items here to simulate your future needs and fine tune your plans to meet your financial goals.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Assets – What are assets? How to add an asset.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        Your current assets can be added from Assets menu item under Portfolio.
                        <br />
                        The currently supported assets are Properties, Vehicles, Bank accounts, Deposits, Stocks, Bonds portfolios and a generic category for any asset. More asset types would be added in the future versions.
                        <br />
                        The graph at the top of the screen shows the value of your Liquid assets (accounts, deposits, portfolios) and Overall assets (including properties, vehicles and others) as of this month.
                        <br />
                        For adding an asset, click on the bottom right “+” hover button which opens a pop-up menu. Choose the asset type that you want to add and fill in the fields required for that asset type. Different assets have different fields with different calculations for mortgage, interest, SIP and payouts as required.
                        <br />
                        The asset type Property for example has fields to capture location, currency, property number, purchase date, price and others. Some of the calculations for stamp duty are built in but flexibility is provided for them to be modified if required. It also captures whether the property is under construction. Also, loan details which then calculates the EMI based on the loan duration and interest rate. Finally, the form captures if the property has been put on rent. This then drives the rental income in the incomes screen.
                        <br />
                        Similarly, other screens capture the attributes for the other asset classes. The overall asset portfolio feeds into the cashflows leading to your desired financial and retirement plan.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Dreams/Goals – What are dreams? How to add dreams.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        Future goals and plans can be added from Dreams/Goals menu item under Portfolio.
                        <br />
                        Any future goals lead to planned expenses and assets which are classified under the page as Lumpsum expenses, recurring expense and future income.
                        <br />
                        All the future plans can be captured under Dreams whether it buying a property, planning for your kid’s education or even travel plans. Hence, all the asset and liabilities which are planned for future can only be captured under the dreams bucket.
                        <br />
                        For adding a Dream example Education, click on the bottom right “+” hover button which opens a pop-up menu. Choose the dream type that you want to add and fill in the fields required for that dream type. Different dreams have different fields with specific calculations for expense date, interest and EMI subject to whether the goal is recurring and it if is funded by a loan.
                        <br />
                        Add all your goals here for tracking and to simulate your future assets and expenses towards creating a stable financial plan.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Cashflow – what is cashflow? How it works? What to keep in mind?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        Any data is only as good as the information it can produce!
                        <br />
                        Once you have all your income, expenses, assets and goals added to the application, it’s time to see how your future plan looks like and is your financial plan in in line with your retirement goals? Would your current planned financial trajectory sufficient to sustain you for your lifetime?
                        <br />
                        Having this information is critical to know if you need to make any corrections to your income and expenses at any point in time. Equipped with this information you can stop making any guesses and assumptions and focus on making the right decisions now and forever.
                        <br />
                        To generate a lifetime cashflow, use the Generate Cashflow option under the Analyse Menu item. This takes all your income, expenses, assets and goals. It then runs calculations from today to the end of your life and shows your net position, liquid assets and overall net worth on a yearly basis. The line graph gives you a good bird’s eye view of the strength of your financial plan and a more detailed grid and table is available if you are a numbers person.
                        <br />
                        The application also generates key insights to highlight focus areas example when you would have the lowest cash in hand and how much, final leftover cash and when is your highest Increase in Income Year-On-Year and how much.
                        <br />
                        For more details, cashflow for assets and liabilities are also available for you to dig deep down into any particular asset or expense to make appropriate changes to your financial plan and goals.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Simulations (When can I Retire)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        The defining moment for us is to be able to get answers to complex financial questions.
                        <br />
                        The Insights Menu item aims to make it easy for you to get answer to questions which are complex and hence you were forced to make guesses or assumptions for them in the past.
                        <br />
                        One of the questions on the top of everyone’s mind is – Are my current savings and planned income enough to retire at a particular time or even more generally when can I retire?
                        <br />
                        The system runs hundreds of simulations to adjust your income streams to come up with an answer to this question. It tells you whether you can retire as per your plan or earlier than planned or you would need to keep earning for a longer duration and hence delay your retirement.
                        <br />
                        What was a guesstimate in the past is now answered on a click of a button! That’s financial power and wisdom!
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Simulations (Recurring income)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        The defining moment for us is to be able to get answers to complex financial questions.
                        <br />
                        The Insights Menu item aims to make it easy for you to get answer to questions for which you were forced to make guesses or assumptions in the past.
                        <br />
                        One of the key insight questions is – how about my recurring income? Can I reduce my income and hence take up a partial retirement now or is my income not enough and I need to find a way to increase it?
                        <br />
                        The system runs hundreds of simulations to adjust your income streams to come up with an answer to this question. It tells you whether you can reduce your income or if your current income is not enough and you need to find a way to increase it?
                        <br />
                        What was a guesstimate in the past is now answered on a click of a button! That’s financial power and wisdom!
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Simulations (Can I take a Sabbatical)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        The Insights Menu item aims to make it easy for you to get answer to questions for which you were forced to make guesses or assumptions in the past.
                        <br />
                        One of the key insight questions is – Can I take a sabbatical? At a particular time for a few months? What impact does it have on my financial plan?
                        <br />
                        The system runs hundreds of simulations to adjust your income streams to come up with an answer to this question. It tells you whether you can afford to take a sabbatical and still meet your financial goals or it is not possible to take a sabbatical as it would derail your future plans.
                        <br />
                        Even if the answer is that you cannot afford a sabbatical, you can use the cashflow data and insight results to deep dive into the gaps and see how you can mitigate the negative impact of a sabbatical and hence make a sabbatical still possible!
                        <br />
                        What was a guesstimate in the past is now answered on a click of a button! That’s financial power and wisdom!
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Simulations (When would I reach a particular amount of liquid assets?)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        The Insights Menu item aims to make it easy for you to get answer to questions for which you were forced to make guesses or assumptions in the past.
                        <br />
                        One of the questions on the top of everyone’s mind is – When would I reach a particular amount of liquid assets?
                        <br />
                        The system runs hundreds of simulations to come up with an answer to this question. It then tells you whether you will reach you target cash-in-hand or liquid assets and if yes, when? The system then goes beyond this simple answer to also check if what you consider your target corpus would be enough to sustain you for your lifetime?
                        <br />
                        What was a guesstimate in the past is now answered on a click of a button! That’s financial power and wisdom!
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default BlogsArticles;