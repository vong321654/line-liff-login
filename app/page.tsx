"use client"

import liff from '@line/liff';
import { useEffect, useState } from 'react';
import { UserDataModel } from './Type/UserDataModel';
import { configDotenv } from 'dotenv';

const liffId = process.env.NEXT_PUBLIC_LINE_LIFF_ID as string;
console.log("LIFF ID:", process.env.NEXT_PUBLIC_LINE_LIFF_ID);

const initLiff = async () => {
  try {
    await liff.init({ liffId: liffId});
    if (!liff.isLoggedIn()) {
      liff.login();
      return null;
    }
    const idToken = liff.getIDToken();
    console.log(idToken);
    return idToken;
  } catch (error) {
    console.error("Error initializing LIFF:", error);
    return null;
  }
};

const logout = () => {
  liff.logout();
  window.location.reload();
}

export default function Home() {
  const [init, setInit] = useState<UserDataModel | null>(null);

  useEffect(() => {
    console.log('useEffect')
    initLiff()
      .then((res: any) => {
        setInit(res)
      })
      .catch(error => {
        console.error("Error initializing LIFF:", error);
      });
  }, []);

  if (!init) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {init ? (
        <>
          <h2>ID Token: {init.idToken}</h2>
          <button onClick={() => logout()} style={{ width: "20%", height: "30%" }}>Logout</button>
        </>
      ) : (
        <h1>No ID Token found</h1>
      )}
    </>
  );
}
