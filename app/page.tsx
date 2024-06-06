"use client"
import liff from '@line/liff';
import { useEffect, useState } from 'react'
const logout = () => {
  liff.logout();
  window.location.reload();
}
const liffId: string = '2005047404-MgGBJNxX';
const initLiff = async () => {
  await liff.init({ liffId: liffId })
  if (!liff.isLoggedIn()) {
    liff.login()
    return false
  }
  // const profile = await liff.getProfile()
  // console.log('profile', profile)
  // return profile
  const idToken = await liff.getIDToken();
  console.log(idToken);
  
}
export default function Home() {
  const [init, setInit] = useState<any>(null)
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