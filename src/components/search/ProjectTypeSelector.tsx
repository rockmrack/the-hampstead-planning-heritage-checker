'use client';

import { useState } from 'react';
import { 
  ProjectType, 
  ProjectCategory,
  getPopularProjects, 
  PROJECT_CATEGORIES, 
  getProjectsByCategory 
} from '@/lib/config/project-types';

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
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);

  const getHeritageWarning = (_projectType: ProjectType): string | null => {
    if (heritageStatus === 'RED') {
      return 'Requires Listed Building Consent';
    }

    if (heritageStatus === 'AMBER') {
      return 'May require permission in conservation area';
    }

    return null;
  };

  const getProjectsForCategory = (categoryId: ProjectCategory): ProjectType[] => {
    return getProjectsByCategory(categoryId);
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
        {PROJECT_CATEGORIES.map((category) => {
          const projectsInCategory = getProjectsForCategory(category.id as ProjectCategory);
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id as ProjectCategory
              )}
              className={`
                p-4 rounded-xl border-2 transition-all text-left
                ${selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                }
              `}
            >
              <span className="text-2xl mb-2 block">{category.icon}</span>
              <span className="font-medium text-gray-900">{category.name}</span>
              <span className="text-sm text-gray-500 block mt-1">
                {projectsInCategory.length} options
              </span>
            </button>
          );
        })}
      </div>

      {/* Project Types for Selected Category */}
      {selectedCategory && (
        <div className="bg-gray-50 rounded-2xl p-6 animate-fadeIn">
          <h3 className="font-semibold text-gray-900 mb-4">
            {PROJECT_CATEGORIES.find(c => c.id === selectedCategory)?.name ?? 'Projects'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getProjectsForCategory(selectedCategory).map((projectType) => {
              const warning = getHeritageWarning(projectType);
              const isSelected = selectedType?.id === projectType.id;

              return (
                <button
                  key={projectType.id}
                  onClick={() => onSelect(projectType)}
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
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <span>{projectType.icon}</span>
                      <span>{projectType.name}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {projectType.description}
                    </div>
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
          {getPopularProjects().slice(0, 6).map((projectType) => {
            const isSelected = selectedType?.id === projectType.id;
            return (
              <button
                key={projectType.id}
                onClick={() => onSelect(projectType)}
                className={`
                  px-4 py-2 rounded-full text-sm transition-all
                  ${isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {projectType.name}
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
