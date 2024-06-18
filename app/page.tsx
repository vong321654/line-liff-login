'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { UserDataModel } from './Type/UserDataModel';

const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;

const LineLogin: React.FC = () => {
  const [profile, setProfile] = useState<UserDataModel | null>(null);
  const [loading, setLoading] = useState(true);

  const initLiff = async () => {
    try {
      await liff.init({ liffId: liffId });
      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }
      const idToken = liff.getIDToken();
      console.log(idToken);
      setLoading(false);
    } catch (error) {
      console.error('LIFF initialization failed', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    initLiff();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box textAlign="center" mt={5}>
      <h2>ID Token: {profile?.idToken}</h2>
    </Box>
  );
};

export default LineLogin;
