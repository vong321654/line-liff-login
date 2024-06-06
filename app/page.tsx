"use client"
import liff from '@line/liff';
import { useEffect, useState } from 'react'
import { UserDataModel } from './Type/UserDataModel';

//const liffId: string = '2005047404-MgGBJNxX';
const liffId: string = process.env.LINE_CLIENT_ID as string;
const initLiff = async () => {
  await liff.init({ liffId: liffId })
  if (!liff.isLoggedIn()) {
    liff.login()
    return false
  }
  const idToken = liff.getIDToken();
  console.log(idToken);
  return idToken
}

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
  }, [])
  if (!init) {
    return <h1> Loading... </h1>
  }

  return (
    <>
      <h2>ID Token: {init?.idToken}</h2>
      <button onClick={() => logout()} style={{ width: "20%", height: "30%" }}>Logout</button>
    </>
  );
}