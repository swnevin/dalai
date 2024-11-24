'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative w-32 h-32">
        <Image
          src="/logos/star.png"
          alt="Loading..."
          width={128}
          height={128}
          className="animate-loader object-contain"
          priority
        />
      </div>
    </div>
  );
}
