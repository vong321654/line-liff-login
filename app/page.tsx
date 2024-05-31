"use client"
import liff from '@line/liff';
import { useEffect, useState } from 'react';

const liffId: string = '2005047404-MgGBJNxX';

const initLiff = async () => {
  try {
    await liff.init({ liffId: liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
      return false;
    }
    const profile = await liff.getProfile();
    console.log('profile', profile);

    const idToken = liff.getDecodedIDToken();
    console.log('idToken', idToken);

    // รวม ID Token ไว้ในโปรไฟล์
    const profileWithToken = { ...profile, idToken: idToken };

    return profileWithToken;
  } catch (error) {
    console.error('initLiff error', error);
    return null;
  }
}

const logout = () => {
  liff.logout();
  window.location.reload();
}

export default function Home() {
  const [init, setInit] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useEffect');
    initLiff().then((res: any) => {
      if (res) {
        setInit(res);
      } else {
        setError('Failed to initialize LIFF');
      }
    }).catch((err) => {
      console.error('useEffect error', err);
      setError('Failed to initialize LIFF');
    });
  }, []);

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!init) {
    return <h1>Loading...</h1>;
  }

  // ตรวจสอบการแสดงผลของแต่ละค่าก่อนที่จะเรนเดอร์
  return (
    <>
      {JSON.stringify(init)}
      <h2>USER ID LINE: {init?.userId || 'N/A'}</h2>
      <h2>ID Token: {init?.idToken || 'N/A'}</h2>
      <h2>DisplayName: {init?.displayName || 'N/A'}</h2>
      <h2>StatusMessage: {init?.statusMessage || 'N/A'}</h2>
      {init?.pictureUrl ? (
        <img src={init.pictureUrl} width={200} height={200} alt="profile"/>
      ) : (
        <p>No profile picture</p>
      )}
      <div>
        <button onClick={() => logout()} style={{ width: "50%", height: "30px" }}>Logout</button>
      </div>
    </>
  );
}
