'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../../components/Loader';
import Image from 'next/image';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CodeBracketIcon,
  ServerIcon,
  SwatchIcon,
  ClipboardDocumentIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';

interface Demo {
  id: string;
  clientName: string;
  projectId: string;
  environment: string;
  brandColor: string;
  backgroundPath: string;
  backgroundType?: 'screenshot' | 'raining-logo';
}

export default function AdminPage() {
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    projectId: '',
    environment: 'production',
    brandColor: '#28483F',
    backgroundPath: '',
    backgroundType: 'screenshot' as 'screenshot' | 'raining-logo',
  });

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      const response = await fetch('/api/demos');
      if (!response.ok) {
        throw new Error('Failed to fetch demos');
      }
      const data = await response.json();
      setDemos(data);
    } catch (error) {
      console.error('Error fetching demos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        const data = await response.json();
        if (data.path) {
          setFormData(prev => ({ ...prev, backgroundPath: data.path }));
          console.log('Updated background path:', data.path); // Debug log
        } else {
          throw new Error('No path returned from upload');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = selectedDemo ? 'PUT' : 'POST';
      const url = '/api/demos';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: selectedDemo?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save demo');
      }

      await fetchDemos();
      setShowModal(false);
      setSelectedDemo(null);
      setFormData({
        clientName: '',
        projectId: '',
        environment: 'production',
        brandColor: '#28483F',
        backgroundPath: '',
        backgroundType: 'screenshot',
      });
    } catch (error) {
      console.error('Error saving demo:', error);
      alert(error instanceof Error ? error.message : 'Failed to save demo');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Er du sikker på at du vil slette denne demoen?')) {
      try {
        const response = await fetch(`/api/demos?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete demo');
        }
        fetchDemos();
      } catch (error) {
        console.error('Error deleting demo:', error);
        alert('Failed to delete demo');
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 relative z-10">
            Demo Administrasjon
          </h1>
          <button
            onClick={() => {
              setSelectedDemo(null);
              setShowModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center sm:justify-start"
          >
            <PlusIcon className="h-5 w-5" />
            Ny Demo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {demos.map((demo) => (
            <div
              key={demo.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {demo.clientName}
                  </h3>
                  <p className="text-sm text-gray-600">Prosjekt ID: {demo.projectId}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    Miljø: {demo.environment === 'production' ? 'Produksjon' : 'Utvikling'}
                  </p>
                </div>

                {demo.backgroundPath && (
                  <div className="relative w-full h-32 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={demo.backgroundPath}
                      alt={`${demo.clientName} bakgrunn`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-auto">
                  <button
                    onClick={() => {
                      const embedCode = `<script type="text/javascript">
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
</script>`;
                      navigator.clipboard.writeText(embedCode);
                      alert('Kode kopiert til utklippstavlen!');
                    }}
                    className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    <span className="whitespace-nowrap">Kopier Kode</span>
                  </button>
                  <button
                    onClick={() => window.open(`/${demo.clientName}`, '_blank')}
                    className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>Forhåndsvis</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDemo(demo);
                      setFormData({
                        clientName: demo.clientName,
                        projectId: demo.projectId,
                        environment: demo.environment,
                        brandColor: demo.brandColor,
                        backgroundPath: demo.backgroundPath,
                        backgroundType: demo.backgroundType || 'screenshot',
                      });
                      setShowModal(true);
                    }}
                    className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Rediger</span>
                  </button>
                  <button
                    onClick={() => handleDelete(demo.id)}
                    className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Slett</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              {selectedDemo ? 'Rediger Demo' : 'Ny Demo'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Klientnavn
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <CodeBracketIcon className="h-5 w-5" />
                  Prosjekt ID
                </label>
                <input
                  type="text"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <ServerIcon className="h-5 w-5" />
                  Miljø
                </label>
                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="production">Produksjon</option>
                  <option value="development">Utvikling</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <SwatchIcon className="h-5 w-5" />
                  Merkefarge
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="brandColor"
                    value={formData.brandColor}
                    onChange={handleInputChange}
                    className="w-12 h-12 p-1 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    name="brandColor"
                    value={formData.brandColor}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ServerIcon className="h-5 w-5" />
                    Bakgrunnstype
                  </label>
                  <select
                    name="backgroundType"
                    value={formData.backgroundType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                  >
                    <option value="screenshot">Skjermbilde Bakgrunn</option>
                    <option value="raining-logo" disabled>Regnende Logo Bakgrunn (Kommer Snart)</option>
                  </select>
                </div>

                {/* Stylesheet Selector - Coming Soon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <SwatchIcon className="h-5 w-5" />
                    Stilark
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Kommer Snart</span>
                  </label>
                  <select
                    disabled
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm cursor-not-allowed"
                  >
                    <option value="default">Standard</option>
                    <option value="modern">Moderne</option>
                    <option value="minimal">Minimalistisk</option>
                    <option value="corporate">Bedrift</option>
                  </select>
                </div>

                {/* Extensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <PuzzlePieceIcon className="h-5 w-5" />
                    Utvidelser
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Kommer Snart</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed">
                      <input type="checkbox" disabled className="cursor-not-allowed" />
                      <span className="text-gray-600">Skjemaer</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed">
                      <input type="checkbox" disabled className="cursor-not-allowed" />
                      <span className="text-gray-600">Filopplasting</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed">
                      <input type="checkbox" disabled className="cursor-not-allowed" />
                      <span className="text-gray-600">Skann QR-kode</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <SwatchIcon className="h-5 w-5" />
                    Bakgrunnsbilde
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary/90"
                  />
                  {formData.backgroundPath && (
                    <div className="relative w-full h-32 mt-4 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={formData.backgroundPath}
                        alt="Forhåndsvisning"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDemo(null);
                    setFormData({
                      clientName: '',
                      projectId: '',
                      environment: 'production',
                      brandColor: '#28483F',
                      backgroundPath: '',
                      backgroundType: 'screenshot',
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  {selectedDemo ? 'Lagre Endringer' : 'Opprett Demo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
