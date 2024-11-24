'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loader from '../../components/Loader';
import Script from 'next/script';

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Demo ikke funnet</p>
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
                  versionID: '${demo.environment}'
                });
              }
              v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
          })(document, 'script');
        `}
      </Script>

      <main className="fixed inset-0 w-screen h-screen">
        {demo.backgroundPath && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${demo.backgroundPath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </main>
    </>
  );
}
