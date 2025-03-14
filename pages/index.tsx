import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // No home page, so it redirects to login
    router.replace('/login');
  }, [router]);

  return null;
};

export default Home;
