'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Loader from '../../components/Loader';
import Script from 'next/script';
import Image from 'next/image';

interface Demo {
  id: string;
  clientName: string;
  projectId: string;
  environment: string;
  brandColor: string;
  backgroundPath: string;
}

const getDemos = async (clientName: string) => {
  try {
    const response = await fetch(`/api/demos?clientName=${clientName}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching demo:', error);
    return [];
  }
};

export default async function DemoPage({ params }: { params: { clientName: string } }) {
  const demos = await getDemos(params.clientName);
  const demo = demos[0];

  if (!demo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Demo Not Found</h1>
          <p className="text-gray-600">No demo found for {params.clientName}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {demo.backgroundPath && (
        <div className="absolute inset-0">
          <Image
            src={demo.backgroundPath}
            alt="Background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      )}
      <div 
        className="absolute bottom-6 right-6 z-10 w-full max-w-[400px] sm:max-w-[450px]"
        style={{ 
          '--vf-primary-color': demo.brandColor,
          '--vf-secondary-color': demo.brandColor 
        } as any}
      >
        <iframe
          src={`https://general-runtime.voiceflow.com/iframe/${demo.projectId}?mode=${demo.environment}`}
          width="100%"
          height="600px"
          allow="clipboard-write"
          className="rounded-lg shadow-lg bg-white"
        />
      </div>
    </main>
  );
}
