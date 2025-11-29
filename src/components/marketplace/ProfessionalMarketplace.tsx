'use client';

import { useState, useMemo } from 'react';
import { 
  Professional, 
  ProfessionalCategory,
  PROFESSIONAL_DIRECTORY,
  findProfessionals 
} from '@/lib/config/professionals';

interface ProfessionalMarketplaceProps {
  projectType?: string;
  borough?: string;
  heritageStatus?: 'RED' | 'AMBER' | 'GREEN';
  onSelect?: (professional: Professional) => void;
}

export default function ProfessionalMarketplace({
  projectType,
  borough,
  heritageStatus,
  onSelect,
}: ProfessionalMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProfessionalCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience'>('rating');

  const categories: { value: ProfessionalCategory | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All Professionals', icon: '👥' },
    { value: 'architect', label: 'Architects', icon: '📐' },
    { value: 'planning_consultant', label: 'Planning Consultants', icon: '📋' },
    { value: 'heritage_consultant', label: 'Heritage Specialists', icon: '🏛️' },
    { value: 'builder', label: 'Builders', icon: '🔨' },
    { value: 'surveyor', label: 'Surveyors', icon: '📏' },
    { value: 'structural_engineer', label: 'Structural Engineers', icon: '🏗️' },
  ];

  const filteredProfessionals = useMemo(() => {
    let professionals = Object.values(PROFESSIONAL_DIRECTORY).flat();

    // Filter by category
    if (selectedCategory !== 'all') {
      professionals = professionals.filter(p => p.category === selectedCategory);
    }

    // Filter by heritage specialization if needed
    if (heritageStatus === 'RED') {
      professionals = professionals.filter(
        p => p.specializations.includes('listed_buildings') || p.category === 'heritage_consultant'
      );
    } else if (heritageStatus === 'AMBER') {
      professionals = professionals.filter(
        p => p.specializations.includes('conservation_areas') || 
             p.specializations.includes('listed_buildings') ||
             p.category === 'heritage_consultant'
      );
    }

    // Filter by borough if specified
    if (borough) {
      professionals = professionals.filter(
        p => p.coverage.includes(borough) || p.coverage.includes('London-wide')
      );
    }

    // Sort
    professionals.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') {
        const priceOrder = { 'budget': 0, 'mid-range': 1, 'premium': 2 };
        return priceOrder[a.priceRange] - priceOrder[b.priceRange];
      }
      if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
      return 0;
    });

    return professionals;
  }, [selectedCategory, heritageStatus, borough, sortBy]);

  const getCategoryColor = (category: ProfessionalCategory): string => {
    const colors: Record<ProfessionalCategory, string> = {
      architect: 'bg-blue-100 text-blue-700',
      planning_consultant: 'bg-purple-100 text-purple-700',
      heritage_consultant: 'bg-amber-100 text-amber-700',
      builder: 'bg-green-100 text-green-700',
      surveyor: 'bg-cyan-100 text-cyan-700',
      structural_engineer: 'bg-red-100 text-red-700',
      interior_designer: 'bg-pink-100 text-pink-700',
      landscape_architect: 'bg-emerald-100 text-emerald-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getPriceIndicator = (priceRange: Professional['priceRange']): string => {
    switch (priceRange) {
      case 'budget': return '£';
      case 'mid-range': return '££';
      case 'premium': return '£££';
    }
  };

  const renderStars = (rating: number): JSX.Element => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Find a Professional</h2>
        <p className="text-gray-600 mt-2">
          Connect with verified architects, planners, and builders in your area
        </p>
        
        {heritageStatus === 'RED' && (
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-amber-800 text-sm">
              🏛️ Your property is a listed building. We're showing professionals with heritage experience.
            </p>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
              ${selectedCategory === cat.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          {filteredProfessionals.length} professional{filteredProfessionals.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
          >
            <option value="rating">Highest Rated</option>
            <option value="price">Lowest Price</option>
            <option value="experience">Most Experience</option>
          </select>
        </div>
      </div>

      {/* Professional Cards */}
      <div className="grid gap-4">
        {filteredProfessionals.map((professional) => (
          <div
            key={professional.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {professional.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {professional.name}
                    </h3>
                    {professional.company && (
                      <p className="text-sm text-gray-600">{professional.company}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {renderStars(professional.rating)}
                    <p className="text-sm text-gray-500 mt-1">
                      {professional.reviewCount} reviews
                    </p>
                  </div>
                </div>

                {/* Category & Price */}
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(professional.category)}`}>
                    {professional.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getPriceIndicator(professional.priceRange)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {professional.yearsExperience} years experience
                  </span>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {professional.specializations.slice(0, 4).map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {spec.replace('_', ' ')}
                    </span>
                  ))}
                  {professional.specializations.length > 4 && (
                    <span className="px-2 py-1 text-gray-500 text-xs">
                      +{professional.specializations.length - 4} more
                    </span>
                  )}
                </div>

                {/* Certifications */}
                {professional.certifications.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500">Certified:</span>
                    {professional.certifications.slice(0, 3).map((cert) => (
                      <span
                        key={cert}
                        className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium"
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                )}

                {/* Coverage */}
                <p className="text-sm text-gray-500 mt-3">
                  📍 Covers: {professional.coverage.slice(0, 3).join(', ')}
                  {professional.coverage.length > 3 && ` +${professional.coverage.length - 3} more`}
                </p>

                {/* CTA */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => onSelect?.(professional)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Get Quote
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 text-lg">No professionals found matching your criteria</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 text-blue-600 hover:underline"
            >
              View all professionals
            </button>
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Are you a professional?</h3>
            <p className="mt-1 text-blue-100">Join our network and connect with homeowners</p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            Join as Professional
          </button>
        </div>
      </div>
    </div>
  );
}
