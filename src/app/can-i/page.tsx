'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ProjectTypeSelector from '@/components/search/ProjectTypeSelector';
import FeasibilityResults from '@/components/results/FeasibilityResults';
import ProfessionalMarketplace from '@/components/marketplace/ProfessionalMarketplace';
import { ProjectType } from '@/lib/config/project-types';
import { FeasibilityReport, assessFeasibility, PropertyContext, ProjectSpecification } from '@/lib/services/feasibility-engine';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

type Step = 'search' | 'project' | 'details' | 'results' | 'professionals';

interface PropertyData {
  address: string;
  postcode: string;
  borough: string;
  lat: number;
  lng: number;
  heritageStatus: 'RED' | 'AMBER' | 'GREEN';
  listedGrade?: 'I' | 'II*' | 'II';
  conservationAreaName?: string;
  hasArticle4: boolean;
  listingDescription?: string;
}

export default function CanIPage() {
  const [step, setStep] = useState<Step>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [projectDetails, setProjectDetails] = useState<Partial<ProjectSpecification>>({});
  const [feasibilityReport, setFeasibilityReport] = useState<FeasibilityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // Call the existing property check API
      const response = await fetch('/api/property-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setPropertyData({
          address: data.property?.address || searchQuery,
          postcode: data.property?.postcode || '',
          borough: data.property?.borough || 'Unknown',
          lat: data.property?.coordinates?.lat || 51.5557,
          lng: data.property?.coordinates?.lng || -0.1743,
          heritageStatus: data.heritageStatus || 'GREEN',
          listedGrade: data.listedBuilding?.grade,
          conservationAreaName: data.conservationArea?.name,
          hasArticle4: data.hasArticle4 || false,
          listingDescription: data.listedBuilding?.description,
        });
        setStep('project');
      } else {
        // Fallback for demo
        setPropertyData({
          address: searchQuery,
          postcode: 'NW3 1AA',
          borough: 'Camden',
          lat: 51.5557,
          lng: -0.1743,
          heritageStatus: 'AMBER',
          conservationAreaName: 'Hampstead',
          hasArticle4: false,
        });
        setStep('project');
      }
    } catch (error) {
      console.error('Search error:', error);
      // Demo fallback
      setPropertyData({
        address: searchQuery,
        postcode: 'NW3 1AA',
        borough: 'Camden',
        lat: 51.5557,
        lng: -0.1743,
        heritageStatus: 'AMBER',
        conservationAreaName: 'Hampstead',
        hasArticle4: false,
      });
      setStep('project');
    }
    setIsLoading(false);
  };

  const handleProjectSelect = (projectType: ProjectType) => {
    setSelectedProject(projectType);
    setStep('details');
  };

  const handleDetailsSubmit = async () => {
    if (!propertyData || !selectedProject) return;

    setIsLoading(true);

    // Build the property context
    const property: PropertyContext = {
      address: propertyData.address,
      postcode: propertyData.postcode,
      borough: propertyData.borough,
      coordinates: { lat: propertyData.lat, lng: propertyData.lng },
      propertyType: 'semi-detached', // Would come from form
      heritageStatus: propertyData.heritageStatus,
      listedGrade: propertyData.listedGrade,
      conservationAreaName: propertyData.conservationAreaName,
      hasArticle4: propertyData.hasArticle4,
      floors: 2,
      isInFloodZone: false,
      hasTPO: false,
      isAONB: false,
      isGreenBelt: false,
    };

    // Build the project specification
    const project: ProjectSpecification = {
      projectType: selectedProject,
      width: projectDetails.width,
      depth: projectDetails.depth,
      height: projectDetails.height,
      isVisibleFromHighway: projectDetails.isVisibleFromHighway || false,
      affectsNeighbors: projectDetails.affectsNeighbors || false,
      neighborConsulted: false,
    };

    try {
      // Call API or assess locally
      const report = assessFeasibility(property, project);
      setFeasibilityReport(report);
      setStep('results');
    } catch (error) {
      console.error('Feasibility check error:', error);
    }

    setIsLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'search':
        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Can I do this at my property?
              </h1>
              <p className="text-xl text-gray-600">
                Find out instantly if you need planning permission
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your property address
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g., 10 Hampstead High Street, NW3"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Check'}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Answers</h3>
                <p className="text-gray-600 text-sm">
                  Know immediately if your project needs permission
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">Approval Prediction</h3>
                <p className="text-gray-600 text-sm">
                  AI-powered prediction of your approval chances
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-4">🔨</div>
                <h3 className="font-semibold text-gray-900 mb-2">Find Professionals</h3>
                <p className="text-gray-600 text-sm">
                  Connect with verified architects and builders
                </p>
              </div>
            </div>
          </div>
        );

      case 'project':
        return (
          <div>
            {/* Property Summary */}
            {propertyData && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {propertyData.address}
                    </h2>
                    <p className="text-gray-600">{propertyData.postcode} • {propertyData.borough}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    propertyData.heritageStatus === 'RED'
                      ? 'bg-red-100 text-red-700'
                      : propertyData.heritageStatus === 'AMBER'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {propertyData.heritageStatus === 'RED' && '🏛️ Listed Building'}
                    {propertyData.heritageStatus === 'AMBER' && '🏘️ Conservation Area'}
                    {propertyData.heritageStatus === 'GREEN' && '✅ No Restrictions'}
                  </span>
                </div>
                {propertyData.conservationAreaName && (
                  <p className="mt-2 text-sm text-gray-500">
                    Conservation Area: {propertyData.conservationAreaName}
                  </p>
                )}
                <button
                  onClick={() => setStep('search')}
                  className="mt-4 text-blue-600 text-sm hover:underline"
                >
                  Change property
                </button>
              </div>
            )}

            <ProjectTypeSelector
              onSelect={handleProjectSelect}
              selectedType={selectedProject || undefined}
              heritageStatus={propertyData?.heritageStatus}
            />
          </div>
        );

      case 'details':
        return (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setStep('project')}
              className="text-blue-600 mb-6 hover:underline flex items-center gap-2"
            >
              ← Back to project selection
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Project Details
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={projectDetails.width || ''}
                      onChange={(e) => setProjectDetails({ ...projectDetails, width: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="e.g., 4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depth (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={projectDetails.depth || ''}
                      onChange={(e) => setProjectDetails({ ...projectDetails, depth: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="e.g., 3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={projectDetails.height || ''}
                      onChange={(e) => setProjectDetails({ ...projectDetails, height: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectDetails.isVisibleFromHighway || false}
                      onChange={(e) => setProjectDetails({ ...projectDetails, isVisibleFromHighway: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span>Visible from the street?</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectDetails.affectsNeighbors || false}
                      onChange={(e) => setProjectDetails({ ...projectDetails, affectsNeighbors: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span>May affect neighbors (light, privacy)?</span>
                  </label>
                </div>

                <button
                  onClick={handleDetailsSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Analyzing...' : 'Check Feasibility'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'results':
        return (
          <div>
            <button
              onClick={() => setStep('details')}
              className="text-blue-600 mb-6 hover:underline flex items-center gap-2"
            >
              ← Back to details
            </button>

            {feasibilityReport && (
              <FeasibilityResults
                report={feasibilityReport}
                onGetStarted={() => {
                  // Navigate to application generator
                }}
                onFindProfessional={() => setStep('professionals')}
              />
            )}
          </div>
        );

      case 'professionals':
        return (
          <div>
            <button
              onClick={() => setStep('results')}
              className="text-blue-600 mb-6 hover:underline flex items-center gap-2"
            >
              ← Back to results
            </button>

            <ProfessionalMarketplace
              projectType={selectedProject?.id?.toLowerCase().replace('_', '-')}
              borough={propertyData?.borough}
              heritageStatus={propertyData?.heritageStatus}
            />
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600">
              Heritage & Planning Engine
            </a>
            <div className="flex items-center gap-6">
              <a href="/check" className="text-gray-600 hover:text-gray-900">Heritage Check</a>
              <a href="/can-i" className="text-blue-600 font-medium">Can I Do This?</a>
              <a href="/track" className="text-gray-600 hover:text-gray-900">Track Applications</a>
              <a href="/alerts" className="text-gray-600 hover:text-gray-900">Alerts</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      {step !== 'search' && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              {['Property', 'Project', 'Details', 'Results'].map((label, index) => {
                const stepMap: Step[] = ['search', 'project', 'details', 'results'];
                const currentIndex = stepMap.indexOf(step);
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${isCurrent ? 'bg-blue-600 text-white' : isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}
                    `}>
                      {isActive && index < currentIndex ? '✓' : index + 1}
                    </div>
                    <span className={`text-sm ${isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {label}
                    </span>
                    {index < 3 && (
                      <div className={`w-12 h-0.5 ${isActive ? 'bg-blue-200' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {renderStep()}
      </div>
    </main>
  );
}
