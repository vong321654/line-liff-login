import { useRouter } from 'next/navigation';
import { useState } from 'react';
import liff from '@line/liff';
import { fetchLineUidData } from '@/app/api/linedata';

const useFuncPage = () => {
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false); // เพิ่มสถานะ completed  const router = useRouter();
    const router = useRouter();
    const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;
    console.log('LIFF ID:', liffId);

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
            const response = await fetch('/api/login', {
              // เปลี่ยน path ให้ถูกต้อง
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ idToken })
            });
            console.log('response = ', response);
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

      const fetchData = async () => {
        try {
          if (completed) {
            const response = await fetch('/api/getSession', {}); // เรียกใช้ API ที่ตั้งค่า session
            const data = await response.json();
            // เมื่อส่งข้อมูลไป backend เรียบร้อยแล้ว ให้ทำการเปลี่ยนเส้นทางไปยังหน้า /Signup/register
            const registerStatus = await fetchLineUidData(data.lineUid);
            if (registerStatus.data.registered) {
              //console.log('registerStatus_true');
              router.push('/Reqform/viewreqform');
            } else {
              //console.log('registerStatus_false');
              router.push('/signup');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

    return{
        router,
        completed,
        loading,
        initLiff,
        fetchData
    };

}
export default useFuncPage;