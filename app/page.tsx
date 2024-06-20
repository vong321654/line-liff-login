'use client';

import { useEffect, useState } from 'react';

import liff from '@line/liff';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { UserDataModel } from './Type/UserDataModel';
import { Button } from '@mui/material';
import { sendProfileToBackend } from '../../../pages/api/loginline/api'; // นำเข้าฟังก์ชันที่แยกออกมา
import router from 'next/router';

const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;
console.log('LIFF ID:', liffId);

const LineLogin: React.FC = () => {
  const [profile, setProfile] = useState<UserDataModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false); // เพิ่มสถานะ completed  const router = useRouter();

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: liffId });
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const idToken = liff.getIDToken();
        console.log(idToken);
        if (idToken) {
          const response = await fetch('/api/login', { // เปลี่ยน path ให้ถูกต้อง
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken })
          });
          if (response.ok) {
            const data = await response.json();
            console.log('User data:', data);
            setCompleted(true); // กำหนดให้ completed เป็น true เมื่อส่งข้อมูลเสร็จสิ้น
          } else {
            console.error('Failed to send idToken to backend');
          }
        } else {
          console.error('ID Token is null');
        }
        setLoading(false);
      } catch (error) {
        console.error('LIFF initialization failed', error);
        setLoading(false);
      }
    };

    initLiff();
  }, []);

  useEffect(() => {
    if (completed) {
      // เมื่อส่งข้อมูลไป backend เรียบร้อยแล้ว ให้ทำการเปลี่ยนเส้นทางไปยังหน้า /Signup/register
     // router.push('/Signup/register');
    }
  }, [completed]);

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