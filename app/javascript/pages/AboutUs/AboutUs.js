import React from 'react';
import { Typography, Box } from '@mui/material';
import LandingHeader from '../../components/landingpage/LandingHeader';
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles'; // Import useTheme

const AboutUs = () => {
  
  const theme = useTheme(); // Get the theme object
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define media query for mobile

  return (
    <Box
      sx={{
        width: '100%', 
        alignItems: 'center',
        justifyContent: 'center',
        px: 0, 
      }}
    >
      <LandingHeader sourcePage={'AboutUs'} />
      <Box
        sx={{
          width: '100%',
          bgcolor: '#e0f7fa',
          position: 'relative',
          mt: 8,
          paddingLeft: 1,
          minHeight: '100vh', 
          paddingTop: isMobile ? '96px' : 0, // Adjust padding top for mobile to account for header
        }}
      >
        <br />
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to FinWise365!
        </Typography>
        <Typography variant="body1">
          At FinWise365, we are dedicated to helping you achieve your financial goals with ease and confidence. Our platform offers comprehensive tools and resources for effective financial planning, ensuring you make informed decisions every step of the way.
        </Typography>
        <Typography variant="body1">
          Whether you're looking to budget your expenses, save for the future, or invest wisely, FinWise365 provides personalized solutions tailored to your unique needs. Our user-friendly interface and expert advice make financial planning accessible to everyone.
        </Typography>
        <br />
        <Typography variant="h5" component="h2" gutterBottom>
          Achieving Financial Calm
        </Typography>
        <Typography variant="body1">
          Being calm isn’t about avoiding challenges but managing them effectively in the face of uncertainty. Likewise, achieving financial calm comes from never losing sight of your financial goals even with all the distractions around you. And having the right tools and resources can make all the difference in helping you form a plan to meet these goals.
        </Typography>
        <br />
        <Typography variant="h5" component="h2" gutterBottom>
          What Matters to You (and How to Get There)
        </Typography>
        <Typography variant="body1">
          Not much of a planner? Or not even sure where to begin? Start by balancing both your emotional desires (what you want) and practical needs (what you need). Whether you’re focused on growing your savings, planning for retirement, budgeting for your home, or managing your healthcare expenses, discover how to manage and optimise your assets, income and expenses so you can reach those goals with confidence.
        </Typography>
        <br />
        <Typography variant="h5" component="h2" gutterBottom>
          Look into the Future of Your Money
        </Typography>
        <Typography variant="body1">
          See how you are doing currently. Gain insight into your spending habits, set a budget, and better plan your cashflow in Money In & Out.
        </Typography>
        <br />
        <Typography variant="h5" component="h2" gutterBottom>
          Are You Financially Ready
        </Typography>
        <Typography variant="body1">
          How do you know if you're financially ready for your goals and retirement? We analyse your financial habits and plot your future cashflow and net worth. In a few questions, you can learn:
          <ul>
          <li>How your goals impact the future</li>
          <li>Plan for your home, education, wedding</li>
          <li>What you can do to improve your finances</li>
          <li>If you can retire by a certain age</li>
          <li>Get an idea of how much you'll need</li>
        </ul>
        </Typography>
        <br />
        <Typography variant="h5" component="h2" gutterBottom>
          Join us on the journey to financial freedom and take control of your financial future with FinWise365.
        </Typography>
        <br />
      </Box>
    </Box>
  );
};

export default AboutUs;
