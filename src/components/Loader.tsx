'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 relative">
          <Image
            src="/star.png"
            alt="Loading"
            fill
            className="animate-spin"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
      </div>
    </div>
  );
}
