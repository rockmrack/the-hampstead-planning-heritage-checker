'use client';

import { useState } from 'react';
import { ProjectType, getProjectTypeInfo, PROJECT_TYPE_CATEGORIES } from '@/lib/config/project-types';

interface ProjectTypeSelectorProps {
  onSelect: (projectType: ProjectType) => void;
  selectedType?: ProjectType;
  heritageStatus?: 'RED' | 'AMBER' | 'GREEN';
}

export default function ProjectTypeSelector({
  onSelect,
  selectedType,
  heritageStatus = 'GREEN',
}: ProjectTypeSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = PROJECT_TYPE_CATEGORIES;

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'extensions': '🏠',
      'loft': '🏗️',
      'outbuildings': '🏡',
      'windows-doors': '🚪',
      'roofing': '🏚️',
      'solar-green': '☀️',
      'external': '🌳',
      'internal': '🔨',
    };
    return icons[category] || '📦';
  };

  const getHeritageWarning = (projectType: ProjectType): string | null => {
    const info = getProjectTypeInfo(projectType);
    if (!info) return null;

    if (heritageStatus === 'RED') {
      if (info.heritageConsiderations?.listed === 'not-allowed') {
        return 'Not permitted for listed buildings';
      }
      return 'Requires Listed Building Consent';
    }

    if (heritageStatus === 'AMBER') {
      if (info.heritageConsiderations?.conservationArea === 'restricted') {
        return 'Restricted in conservation area';
      }
      return 'May require permission in conservation area';
    }

    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What do you want to do?
      </h2>
      <p className="text-gray-600 mb-6">
        Select a project type to see if you need planning permission
      </p>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
            className={`
              p-4 rounded-xl border-2 transition-all text-left
              ${selectedCategory === key
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
              }
            `}
          >
            <span className="text-2xl mb-2 block">{getCategoryIcon(key)}</span>
            <span className="font-medium text-gray-900">{category.name}</span>
            <span className="text-sm text-gray-500 block mt-1">
              {category.types.length} options
            </span>
          </button>
        ))}
      </div>

      {/* Project Types for Selected Category */}
      {selectedCategory && (
        <div className="bg-gray-50 rounded-2xl p-6 animate-fadeIn">
          <h3 className="font-semibold text-gray-900 mb-4">
            {categories[selectedCategory].name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories[selectedCategory].types.map((type) => {
              const info = getProjectTypeInfo(type);
              const warning = getHeritageWarning(type);
              const isSelected = selectedType === type;

              return (
                <button
                  key={type}
                  onClick={() => onSelect(type)}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-left flex justify-between items-start
                    ${isSelected
                      ? 'border-blue-500 bg-white shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                    ${warning?.includes('Not permitted') ? 'opacity-60' : ''}
                  `}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {info?.name || type}
                    </div>
                    {info?.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {info.description}
                      </div>
                    )}
                    {warning && (
                      <div className={`text-xs mt-2 ${
                        warning.includes('Not permitted') 
                          ? 'text-red-600' 
                          : 'text-amber-600'
                      }`}>
                        ⚠️ {warning}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <span className="text-blue-500 ml-2">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <h3 className="font-semibold text-gray-900 mb-4">
          Popular Projects
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            ProjectType.REAR_EXTENSION,
            ProjectType.LOFT_CONVERSION,
            ProjectType.GARDEN_ROOM,
            ProjectType.SOLAR_PANELS,
            ProjectType.WINDOWS,
            ProjectType.DRIVEWAY,
          ].map((type) => {
            const info = getProjectTypeInfo(type);
            return (
              <button
                key={type}
                onClick={() => onSelect(type)}
                className={`
                  px-4 py-2 rounded-full text-sm transition-all
                  ${selectedType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {info?.name || type}
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
