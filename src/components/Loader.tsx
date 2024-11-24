'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000); // Set minimum display time to 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="relative w-32 h-32">
        <Image
          src="/star.png"
          alt="Loading..."
          fill
          className="animate-spin"
          style={{ animationDuration: '3s' }}
          priority
        />
      </div>
    </div>
  );
}
