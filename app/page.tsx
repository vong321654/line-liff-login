'use client';

import { useEffect} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useFuncPage from '@/function/funcpage';

const LineLogin: React.FC = () => {

  const{
    router,
    completed,
    loading,
    initLiff,
    fetchData
  } = useFuncPage();

  useEffect(() => {
    initLiff();
    fetchData();
  }, [initLiff, fetchData, completed, router]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return null;
};

export default LineLogin;
