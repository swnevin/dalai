'use client';

import { useEffect, useState } from 'react';
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

export default function DemoPage() {
  const params = useParams();
  const [demo, setDemo] = useState<Demo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const response = await fetch(`/api/demos?clientName=${params.clientName}`);
        const demos = await response.json();
        if (demos.length > 0) {
          setDemo(demos[0]);
        }
      } catch (error) {
        console.error('Error fetching demo:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.clientName) {
      fetchDemo();
    }
  }, [params.clientName]);

  if (loading) {
    return <Loader />;
  }

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
    <>
      <Script id="voiceflow-widget" strategy="afterInteractive">
        {`
          (function(d, t) {
              var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
              v.onload = function() {
                window.voiceflow.chat.load({
                  verify: { projectID: '${demo.projectId}' },
                  url: 'https://general-runtime.voiceflow.com',
                  versionID: '${demo.environment}',
                  css: {
                    borderRadius: '10px',
                    button: {
                      backgroundColor: '${demo.brandColor}',
                      size: 'medium',
                    }
                  }
                });
              }
              v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
          })(document, 'script');
        `}
      </Script>

      <main className="fixed inset-0 w-screen h-screen overflow-hidden">
        {demo.backgroundPath && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={demo.backgroundPath}
              alt="Background"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              quality={100}
              style={{ objectFit: 'cover' }}
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
          <div
            style={{
              '--vf-primary-color': demo.brandColor,
              '--vf-secondary-color': demo.brandColor,
            } as any}
            data-projectid={demo.projectId}
            data-version={demo.environment}
          />
        </div>
      </main>
    </>
  );
}
