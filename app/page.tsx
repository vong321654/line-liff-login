'use client'

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { UserDataModel } from './Type/UserDataModel';
//import { sendProfileToBackend } from '../../../pages/api/loginline/api'; // นำเข้าฟังก์ชันที่แยกออกมา
import router from 'next/router';

const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;
console.log('LIFF ID:', liffId);

const LineLogin: React.FC = () => {
  const [profile, setProfile] = useState<UserDataModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false); // เพิ่มสถานะ completed

  const sendProfileToBackend = async (idToken: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseURL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken }) // ส่ง idToken เป็น JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to send profile to backend');
      }
  
      const data = await response.json();
      return data; // ส่งค่าผลลัพธ์กลับมา
    } catch (error) {
      console.error('Error sending profile to backend:', error);
      throw error; // โยนข้อผิดพลาดกลับไปยังผู้เรียกใช้
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
          const profileData = await sendProfileToBackend(idToken); // ส่ง idToken ถ้ามีค่า
          setProfile(profileData.data); // เก็บข้อมูล profile ที่ได้รับจาก backend
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
  }, [completed]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return null; // เนื่องจากไม่ต้องการแสดงข้อมูลอื่นในขณะที่ loading
};

export default LineLogin;