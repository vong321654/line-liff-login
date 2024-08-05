import { ResponseData } from '../Type/responData';
import axios from 'axios';

export const fetchLineUidData = async (lineUid: string) => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await axios.post<ResponseData>(
      `${baseURL}/fetchlinedata`,
      { lineUid: lineUid },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error; // ส่งต่อ error เพื่อให้สามารถจัดการได้ในภายหลัง
  }
};