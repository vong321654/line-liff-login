'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import liff from '@line/liff';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { UserDataModel } from './Type/UserDataModel';
import { Button } from '@mui/material';
//import { sendProfileToBackend } from '../api/api'; // นำเข้าฟังก์ชันที่แยกออกมา

const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;
console.log('LIFF ID:', liffId);

const LineLogin: React.FC = () => {
  const [profile, setProfile] = useState<UserDataModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false); // เพิ่มสถานะ completed
  const router = useRouter();

  const sendProfileToBackend = async (idToken: string): Promise<string> => {
    try {
      //const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch('https://larry-api.larry-cctv.com/ma-bkk/sit/v1/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken }) // ส่ง idToken เป็น JSON
      });
      if (!response.ok) {
        throw new Error('Failed to send profile to backend');
      }
      return 'Profile sent to backend successfully';
    } catch (error) {
      console.error('Error sending profile to backend:', error);
      throw new Error('Error sending profile to backend');
    }
  };

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
          await sendProfileToBackend(idToken); // ส่ง idToken ถ้ามีค่า
          setCompleted(true); // กำหนดให้ completed เป็น true เมื่อส่งข้อมูลเสร็จสิ้น
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
      router.push('/Signup/register');
    }
  }, [completed, router]);

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