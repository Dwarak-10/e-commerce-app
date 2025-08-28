import { Box, Typography, Button } from '@mui/material';

const ErrorFallback = ({ onRetry }) => (
  <Box
    className="flex flex-col justify-center items-center h-screen w-screen"
    sx={{ textAlign: 'center', p: 2 }}
  >
    <Typography variant="h6" color="error" gutterBottom>
      Something went wrong.
    </Typography>
    <Typography variant="body2" color="text.secondary" mb={2}>
      Please try again or contact support if the issue persists.
    </Typography>
    {onRetry && (
      <Button variant="contained" color="error" onClick={onRetry}>
        Retry
      </Button>
    )}
  </Box>
);
export default ErrorFallback;