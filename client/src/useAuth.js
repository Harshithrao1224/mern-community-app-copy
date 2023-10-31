import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookies] = useCookies(['access_token']);
  useEffect(() => {
   
    const token = cookies.access_token;
    setIsAuthenticated(!!token);
  }, [cookies]);

  return isAuthenticated;
}
