"use client"
import liff from '@line/liff';

import { useEffect, useState } from 'react'

const liffId: string = '2004442336-Og19r7oK';
const initLiff = async () => {
  await liff.init({ liffId: liffId })
  if (!liff.isLoggedIn()) {
    liff.login()
    return false
  }
  const profile = await liff.getProfile()
  console.log('profile', profile)

  const getEmail = liff.getDecodedIDToken()
  console.log('getEmail', getEmail)


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
    return <h1> Loading... </h1>
  }

  return (
    <>
      <h2>  liffId: {liffId}</h2>
      {JSON.stringify(init)}
      <h2>USER ID LINE : {init?.userId}</h2>
      <h2>DisplayName : {init?.displayName}</h2>
      <h2>StatusMessage : {init?.statusMessage}</h2>
      <img src={init?.pictureUrl} width={200} height={200} alt="profile" />
    </>
  );
}
