"use client"
import liff from '@line/liff';
import { useEffect, useState } from 'react';


const liffId: string = '2005047404-MgGBJNxX';

const initLiff = async () => {
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
}

const logout = () => {
  liff.logout();
  window.location.reload();
}

export default function Home() {
  const [init, setInit] = useState<any>(null);

  useEffect(() => {
    console.log('useEffect');
    initLiff().then((res: any) => {
      setInit(res);
    });
  }, []);

  if (!init) {
    return <h1> Loading... </h1>;
  }

  return (
    <>
      {JSON.stringify(init)}
      <h2>USER ID LINE : {init?.userId}</h2>
      <h2>ID Token : {init?.idToken}</h2>
      <h2>DisplayName : {init?.displayName}</h2>
      <h2>StatusMessage : {init?.statusMessage}</h2>
      <img src={init?.pictureUrl} width={200} height={200} alt="profile"/>
      <div>
        <button onClick={() => logout()} style={{ width: "50%", height: "30", }}>Logout</button>
      </div>
    </>
  );
}
