"use client"
import liff from '@line/liff';

import { useEffect, useState } from 'react'
import { text } from 'stream/consumers';

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
  const profile = await liff.getProfile()
  console.log('profile', profile)

  const idToken = liff.getDecodedIDToken()
  console.log('idToken', idToken)

  return profile
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
    return <h1 style={{textAlign:'center'}}> Loading... </h1>
  }

  return (
    <>
      <h2>USER ID LINE : {init?.userId}</h2>
      <h2>ID Token: ***Press F12 last article***{init?.idToken}</h2>
      <h2>DisplayName : {init?.displayName}</h2>
      <h2>StatusMessage : {init?.statusMessage}</h2>
      <img src={init?.pictureUrl} width={200} height={200} alt="profile" />
      <button onClick={() => logout()} style={{ width: "20%", height: "30%",marginTop:'5px',textAlign:'center' }}>Logout</button>
    </>
  );
}