/**
 * Compliance Checker API
 * Building Regulations, Fire Safety, and Legal Compliance
 * GET/POST /api/compliance
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type ComplianceCategory = 
  | 'building_regs'
  | 'fire_safety'
  | 'disabled_access'
  | 'party_wall'
  | 'cdm'
  | 'heritage'
  | 'environmental';

interface ComplianceRequirement {
  id: string;
  category: ComplianceCategory;
  requirement: string;
  description: string;
  applicableTo: string[];
  documentNeeded: string;
  responsibleParty: string;
  penalty: string;
}

// Building Regulations parts
const BUILDING_REGS_PARTS: Record<string, { name: string; description: string }> = {
  A: { name: 'Structure', description: 'Structural safety requirements' },
  B: { name: 'Fire Safety', description: 'Fire spread, means of escape' },
  C: { name: 'Site Preparation', description: 'Moisture resistance' },
  E: { name: 'Sound', description: 'Sound transmission' },
  F: { name: 'Ventilation', description: 'Ventilation requirements' },
  G: { name: 'Sanitation', description: 'Hot water, sanitary facilities' },
  H: { name: 'Drainage', description: 'Drainage and waste' },
  K: { name: 'Protection from Falling', description: 'Stairs, ramps, guards' },
  L: { name: 'Conservation of Fuel', description: 'Energy efficiency' },
  M: { name: 'Access', description: 'Building accessibility' },
  P: { name: 'Electrical Safety', description: 'Electrical installation' },
  S: { name: 'EV Infrastructure', description: 'Electric vehicle charging' },
};

// Compliance requirements
const COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
  {
    id: 'BR_FULL',
    category: 'building_regs',
    requirement: 'Full Plans Application',
    description: 'Formal Building Control approval for major works',
    applicableTo: ['extension', 'basement', 'loft_conversion', 'structural'],
    documentNeeded: 'Full architectural plans with structural calculations',
    responsibleParty: 'Owner/Architect',
    penalty: 'Enforcement notice, demolition order',
  },
  {
    id: 'BR_NOTICE',
    category: 'building_regs',
    requirement: 'Building Notice',
    description: 'Simplified approval for smaller works',
    applicableTo: ['internal', 'small_extension'],
    documentNeeded: 'Building Notice form',
    responsibleParty: 'Owner/Builder',
    penalty: 'Stop notice, rectification costs',
  },
  {
    id: 'BR_CERT',
    category: 'building_regs',
    requirement: 'Completion Certificate',
    description: 'Final sign-off confirming compliance',
    applicableTo: ['extension', 'basement', 'loft_conversion', 'internal'],
    documentNeeded: 'Inspection completion',
    responsibleParty: 'Building Control',
    penalty: 'Cannot sell without indemnity insurance',
  },
  {
    id: 'FIRE_DETECT',
    category: 'fire_safety',
    requirement: 'Fire Detection System',
    description: 'Smoke/heat detectors, fire alarms',
    applicableTo: ['extension', 'loft_conversion', 'basement'],
    documentNeeded: 'Fire safety design, installation certificate',
    responsibleParty: 'Owner/Installer',
    penalty: 'Enforcement, insurance invalidation',
  },
  {
    id: 'FIRE_ESCAPE',
    category: 'fire_safety',
    requirement: 'Means of Escape',
    description: 'Safe exit routes, protected stairways',
    applicableTo: ['loft_conversion', 'basement', 'multi_storey'],
    documentNeeded: 'Fire escape plan, BC approval',
    responsibleParty: 'Architect/Owner',
    penalty: 'Stop notice, mandatory rectification',
  },
  {
    id: 'FIRE_DOOR',
    category: 'fire_safety',
    requirement: 'Fire Doors',
    description: 'FD30 or FD60 rated doors where required',
    applicableTo: ['loft_conversion', 'flat', 'hmo'],
    documentNeeded: 'Fire door certification',
    responsibleParty: 'Owner/Installer',
    penalty: 'Replacement order',
  },
  {
    id: 'PWA_NOTICE',
    category: 'party_wall',
    requirement: 'Party Wall Notice',
    description: 'Notice to adjoining owners 1-2 months before work',
    applicableTo: ['extension', 'basement', 'structural'],
    documentNeeded: 'Party Wall Notice forms',
    responsibleParty: 'Building Owner',
    penalty: 'Injunction, damages',
  },
  {
    id: 'PWA_AWARD',
    category: 'party_wall',
    requirement: 'Party Wall Award',
    description: 'If neighbor dissents, surveyors produce award',
    applicableTo: ['extension', 'basement'],
    documentNeeded: 'Party Wall Award document',
    responsibleParty: 'Party Wall Surveyors',
    penalty: 'Work cannot proceed legally',
  },
  {
    id: 'CDM_DOMESTIC',
    category: 'cdm',
    requirement: 'CDM Client Duties',
    description: 'Health and safety duties for construction',
    applicableTo: ['extension', 'basement', 'loft_conversion', 'internal'],
    documentNeeded: 'Written declaration to pass duties to contractor',
    responsibleParty: 'Owner',
    penalty: 'HSE prosecution, liability',
  },
  {
    id: 'LBC',
    category: 'heritage',
    requirement: 'Listed Building Consent',
    description: 'Consent for works affecting listed building',
    applicableTo: ['listed_building'],
    documentNeeded: 'LBC application, heritage statement',
    responsibleParty: 'Owner/Agent',
    penalty: 'Criminal prosecution, unlimited fine',
  },
  {
    id: 'ENV_ASBESTOS',
    category: 'environmental',
    requirement: 'Asbestos Survey',
    description: 'Survey before demolition/refurbishment',
    applicableTo: ['pre_1999_building', 'structural', 'internal'],
    documentNeeded: 'Asbestos survey report',
    responsibleParty: 'Owner/Contractor',
    penalty: 'HSE prosecution, site closure',
  },
  {
    id: 'ACCESS_M4',
    category: 'disabled_access',
    requirement: 'Part M4 Accessibility',
    description: 'Basic accessibility for new dwellings',
    applicableTo: ['new_build', 'conversion'],
    documentNeeded: 'Access statement',
    responsibleParty: 'Architect',
    penalty: 'BC rejection',
  },
];

// Compliance costs
const COMPLIANCE_COSTS: Record<string, { min: number; max: number }> = {
  'BR_FULL': { min: 1500, max: 5000 },
  'BR_NOTICE': { min: 500, max: 1500 },
  'BR_CERT': { min: 0, max: 0 },
  'FIRE_DETECT': { min: 500, max: 2000 },
  'FIRE_ESCAPE': { min: 2000, max: 10000 },
  'FIRE_DOOR': { min: 300, max: 800 },
  'PWA_NOTICE': { min: 50, max: 100 },
  'PWA_AWARD': { min: 1500, max: 5000 },
  'CDM_DOMESTIC': { min: 0, max: 100 },
  'LBC': { min: 500, max: 2000 },
  'ENV_ASBESTOS': { min: 300, max: 800 },
  'ACCESS_M4': { min: 500, max: 2000 },
};

function getApplicableTypes(
  projectType: string,
  isListed: boolean,
  inConservationArea: boolean,
  isFlat: boolean,
  buildYear?: number
): string[] {
  const types = [projectType];
  
  if (['extension', 'basement', 'loft_conversion'].includes(projectType)) {
    types.push('structural');
  }
  
  if (isListed) types.push('listed_building');
  if (inConservationArea) types.push('conservation_area');
  if (isFlat) types.push('flat');
  if (buildYear && buildYear < 1999) types.push('pre_1999_building');
  
  return types;
}

function determinePriority(
  req: ComplianceRequirement,
  isListed: boolean
): 'critical' | 'high' | 'medium' | 'low' {
  if (req.penalty.toLowerCase().includes('criminal') ||
      req.penalty.toLowerCase().includes('prosecution') ||
      req.penalty.toLowerCase().includes('unlimited')) {
    return 'critical';
  }
  
  if (req.id === 'LBC' && isListed) return 'critical';
  if (req.category === 'fire_safety' || req.category === 'building_regs') return 'high';
  if (req.category === 'party_wall' || req.category === 'cdm') return 'medium';
  
  return 'low';
}

function getComplianceReport(
  projectType: string,
  isListed: boolean,
  inConservationArea: boolean,
  isFlat: boolean,
  floors: number,
  buildYear?: number
) {
  const applicableTypes = getApplicableTypes(
    projectType,
    isListed,
    inConservationArea,
    isFlat,
    buildYear
  );
  
  const requirements = COMPLIANCE_REQUIREMENTS
    .filter(req => req.applicableTo.some(t => applicableTypes.includes(t)))
    .map(req => {
      const priority = determinePriority(req, isListed);
      const cost = COMPLIANCE_COSTS[req.id] || { min: 0, max: 500 };
      
      return {
        ...req,
        priority,
        estimatedCost: cost,
        status: 'required' as const,
      };
    });
  
  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  requirements.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  const totalCost = requirements.reduce(
    (acc, r) => ({ min: acc.min + r.estimatedCost.min, max: acc.max + r.estimatedCost.max }),
    { min: 0, max: 0 }
  );
  
  const criticalCount = requirements.filter(r => r.priority === 'critical').length;
  
  const nextSteps: string[] = [];
  if (isListed) nextSteps.push('Apply for Listed Building Consent');
  if (requirements.some(r => r.category === 'party_wall')) {
    nextSteps.push('Serve Party Wall Notices to adjoining owners');
  }
  if (requirements.some(r => r.category === 'building_regs')) {
    nextSteps.push('Submit Building Regulations application');
  }
  nextSteps.push('Appoint competent contractors');
  nextSteps.push('Ensure all approvals received before starting');
  
  return {
    projectType,
    propertyStatus: { isListed, inConservationArea, isFlat, floors, buildYear },
    requirements,
    totalEstimatedCost: totalCost,
    criticalItems: criticalCount,
    summary: `${requirements.length} compliance requirements identified, ${criticalCount} critical`,
    nextSteps,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'check') {
      const { projectType, isListed, inConservationArea, isFlat, floors, buildYear } = body;
      
      if (!projectType) {
        return NextResponse.json({ error: 'projectType required' }, { status: 400 });
      }
      
      const report = getComplianceReport(
        projectType,
        isListed || false,
        inConservationArea || false,
        isFlat || false,
        floors || 2,
        buildYear
      );
      
      return NextResponse.json({ success: true, report });
    }
    
    if (action === 'requirement-detail') {
      const { requirementId } = body;
      const requirement = COMPLIANCE_REQUIREMENTS.find(r => r.id === requirementId);
      
      if (!requirement) {
        return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
      }
      
      const cost = COMPLIANCE_COSTS[requirement.id] || { min: 0, max: 500 };
      
      return NextResponse.json({
        success: true,
        requirement: { ...requirement, estimatedCost: cost },
      });
    }
    
    if (action === 'by-category') {
      const { category } = body;
      const requirements = COMPLIANCE_REQUIREMENTS.filter(r => r.category === category);
      
      return NextResponse.json({
        success: true,
        category,
        requirements: requirements.map(r => ({
          ...r,
          estimatedCost: COMPLIANCE_COSTS[r.id] || { min: 0, max: 500 },
        })),
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: check, requirement-detail, by-category' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Compliance API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('building-regs') === 'true') {
    return NextResponse.json({ buildingRegsParts: BUILDING_REGS_PARTS });
  }
  
  if (searchParams.get('categories') === 'true') {
    return NextResponse.json({
      categories: [
        { id: 'building_regs', name: 'Building Regulations' },
        { id: 'fire_safety', name: 'Fire Safety' },
        { id: 'disabled_access', name: 'Disabled Access' },
        { id: 'party_wall', name: 'Party Wall' },
        { id: 'cdm', name: 'CDM Regulations' },
        { id: 'heritage', name: 'Heritage' },
        { id: 'environmental', name: 'Environmental' },
      ],
    });
  }
  
  if (searchParams.get('all-requirements') === 'true') {
    return NextResponse.json({
      requirements: COMPLIANCE_REQUIREMENTS.map(r => ({
        id: r.id,
        requirement: r.requirement,
        category: r.category,
        penalty: r.penalty,
      })),
    });
  }
  
  return NextResponse.json({
    service: 'Compliance Checker API',
    version: '1.0.0',
    description: 'Building Regulations, Fire Safety, and Legal Compliance',
    endpoints: {
      'GET /api/compliance': 'Service info',
      'GET /api/compliance?building-regs=true': 'Building Regs parts',
      'GET /api/compliance?categories=true': 'Compliance categories',
      'GET /api/compliance?all-requirements=true': 'All requirements',
      'POST (action: check)': 'Full compliance check',
      'POST (action: requirement-detail)': 'Get requirement detail',
      'POST (action: by-category)': 'Requirements by category',
    },
    projectTypes: ['extension', 'basement', 'loft_conversion', 'internal', 'new_build', 'conversion'],
    priorityLevels: ['critical', 'high', 'medium', 'low'],
  });
}
