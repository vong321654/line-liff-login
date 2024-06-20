export const sendProfileToBackend = async (idToken: string): Promise<any> => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiURL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken }) // ส่ง idToken เป็น JSON
      });
      if (!response.ok) {
        throw new Error('Failed to send profile to backend');
      }
      const data = await response.json(); // รับค่า response เป็น JSON
      return data;
    } catch (error) {
      console.error('Error sending profile to backend:', error);
      throw new Error('Error sending profile to backend');
    }
  };