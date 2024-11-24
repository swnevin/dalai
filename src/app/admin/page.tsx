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
} from '@heroicons/react/24/outline';

interface Demo {
  id: string;
  clientName: string;
  projectId: string;
  environment: string;
  brandColor: string;
  backgroundPath: string;
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
      });
    } catch (error) {
      console.error('Error saving demo:', error);
      alert(error instanceof Error ? error.message : 'Failed to save demo');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this demo?')) {
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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Demo Administration
          </h1>
          <button
            onClick={() => {
              setSelectedDemo(null);
              setShowModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add New Demo
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
                  <p className="text-sm text-gray-600">Project ID: {demo.projectId}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    Environment: {demo.environment}
                  </p>
                </div>

                {demo.backgroundPath && (
                  <div className="relative w-full h-32 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={demo.backgroundPath}
                      alt={`${demo.clientName} background`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  <button
                    onClick={() => {
                      setSelectedDemo(demo);
                      setFormData(demo);
                      setShowModal(true);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(demo.id)}
                    className="flex-1 px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
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
              {selectedDemo ? 'Edit Demo' : 'Add New Demo'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment
                </label>
                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="production">Production</option>
                  <option value="development">Development</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Color
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedDemo ? 'Change Background Image' : 'Upload Background Image (Optional)'}
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Upload a screenshot of the client's website as the background image
                </p>
                <div className="space-y-4">
                  {selectedDemo && selectedDemo.backgroundPath && (
                    <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={selectedDemo.backgroundPath}
                        alt="Current background"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary/90"
                  />
                  {formData.backgroundPath && (
                    <p className="text-sm text-green-600">
                      Background image uploaded: {formData.backgroundPath}
                    </p>
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
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  {selectedDemo ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
