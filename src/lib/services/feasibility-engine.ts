/**
 * Feasibility Engine Service
 * Determines if a project is allowed and what's required
 */

import { ProjectType, getProjectById, getRulesForProject, PDRule } from '../config/project-types';
import { predictApproval, PredictionInput, PredictionResult } from './approval-prediction';

// Define project type string constants for comparison
const PROJECT_TYPE_IDS = {
  SIDE_EXTENSION: 'side-extension',
  LOFT_CONVERSION: 'loft-conversion',
  BASEMENT: 'basement',
  REAR_EXTENSION: 'rear-extension-single',
  REAR_EXTENSION_DOUBLE: 'rear-extension-double',
} as const;

// Extended PDRule with additional properties for feasibility checks
interface PDRuleExtended extends Partial<PDRule> {
  maxDepth?: number;
  maxHeight?: number;
  maxArea?: number;
  priorApproval?: boolean;
}

// Helper functions
function getProjectTypeInfo(projectTypeId: string): { name: string; pdClass?: string; rules?: PDRuleExtended } | null {
  const project = getProjectById(projectTypeId);
  if (!project) return null;
  
  // Get rules based on standard heritage status
  const rules = getRulesForProject(projectTypeId, 'GREEN', false);
  
  return {
    name: project.name,
    pdClass: 'Class A', // Default PD class
    rules: rules ? {
      ...rules,
      maxDepth: rules.maxDimensions?.depth,
      maxHeight: rules.maxDimensions?.height,
      maxArea: rules.maxDimensions?.area,
    } : undefined,
  };
}

function canDoProject(
  projectTypeId: string,
  heritageStatus: 'RED' | 'AMBER' | 'GREEN',
  hasArticle4: boolean,
  _propertyType?: string
): { allowed: boolean; requiresPermission: boolean; conditions?: string[]; reason?: string } {
  const rules = getRulesForProject(projectTypeId, heritageStatus, hasArticle4);
  
  if (!rules) {
    return { allowed: false, requiresPermission: true, reason: 'Unknown project type' };
  }
  
  return {
    allowed: rules.allowed,
    requiresPermission: rules.requiresPermission || false,
    conditions: rules.conditions,
    reason: rules.notes?.join('. '),
  };
}

export interface PropertyContext {
  // Location
  address: string;
  postcode: string;
  borough: string;
  coordinates: { lat: number; lng: number };
  
  // Property characteristics
  propertyType: 'detached' | 'semi-detached' | 'terraced' | 'flat' | 'maisonette';
  buildYear?: number;
  totalFloorArea?: number;
  gardenDepth?: number;
  plotSize?: number;
  floors: number;
  
  // Heritage status
  heritageStatus: 'RED' | 'AMBER' | 'GREEN';
  listedGrade?: 'I' | 'II*' | 'II';
  conservationAreaName?: string;
  hasArticle4: boolean;
  article4Restrictions?: string[];
  
  // Previous works
  existingExtensions?: {
    type: string;
    area: number;
    date: string;
  }[];
  previousApplications?: {
    reference: string;
    type: string;
    outcome: 'approved' | 'refused' | 'withdrawn';
    date: string;
  }[];
  
  // Other constraints
  isInFloodZone: boolean;
  floodZone?: 1 | 2 | 3;
  hasTPO: boolean;
  tpoDetails?: string;
  isAONB: boolean;
  isGreenBelt: boolean;
}

export interface ProjectSpecification {
  projectType: ProjectType;
  
  // Dimensions (in meters)
  width?: number;
  depth?: number;
  height?: number;
  
  // Additional details
  roofType?: 'flat' | 'pitched' | 'hipped';
  materials?: {
    walls?: string;
    roof?: string;
    windows?: string;
  };
  
  // Impact
  isVisibleFromHighway: boolean;
  affectsNeighbors: boolean;
  neighborConsulted: boolean;
}

export interface FeasibilityReport {
  // Summary
  projectAllowed: boolean;
  permissionRequired: 'none' | 'prior-approval' | 'planning-permission' | 'listed-building-consent' | 'multiple';
  summary: string;
  
  // Detailed assessment
  permittedDevelopmentCheck: PDCheck;
  heritageCheck: HeritageCheck;
  dimensionCheck: DimensionCheck;
  constraintsCheck: ConstraintsCheck;
  
  // Approval prediction
  approvalPrediction?: PredictionResult;
  
  // Requirements
  requiredDocuments: DocumentRequirement[];
  estimatedFees: FeeEstimate;
  estimatedTimeline: string;
  
  // Next steps
  recommendedActions: RecommendedAction[];
  
  // Warnings and info
  warnings: string[];
  opportunities: string[];
}

export interface PDCheck {
  passed: boolean;
  pdClass?: string;
  conditions: string[];
  limitations: string[];
  reason?: string;
}

export interface HeritageCheck {
  status: 'GREEN' | 'AMBER' | 'RED';
  requirements: string[];
  restrictions: string[];
  consultationRequired: string[];
}

export interface DimensionCheck {
  passed: boolean;
  maxAllowed: {
    depth?: number;
    height?: number;
    width?: number;
    area?: number;
  };
  proposed: {
    depth?: number;
    height?: number;
    width?: number;
  };
  exceedances: string[];
}

export interface ConstraintsCheck {
  floodRisk: {
    applicable: boolean;
    zone?: number;
    requirements: string[];
  };
  trees: {
    applicable: boolean;
    tpoAffected: boolean;
    requirements: string[];
  };
  other: string[];
}

export interface DocumentRequirement {
  name: string;
  required: boolean;
  description: string;
  estimatedCost?: string;
}

export interface FeeEstimate {
  applicationFee: number;
  listedBuildingFee?: number;
  cil?: number;
  professionalFees: {
    architect?: number;
    heritageConsultant?: number;
    structuralEngineer?: number;
  };
  total: number;
}

export interface RecommendedAction {
  priority: 'high' | 'medium' | 'low';
  action: string;
  reason: string;
  estimatedCost?: string;
  timeline?: string;
}

// ===========================================
// MAIN FEASIBILITY ENGINE
// ===========================================

export function assessFeasibility(
  property: PropertyContext,
  project: ProjectSpecification
): FeasibilityReport {
  // Get base project rules
  const projectInfo = getProjectTypeInfo(project.projectType.id);
  const baseCheck = canDoProject(
    project.projectType.id,
    property.heritageStatus,
    property.hasArticle4,
    property.propertyType
  );
  
  const warnings: string[] = [];
  const opportunities: string[] = [];
  
  // ===========================================
  // 1. PERMITTED DEVELOPMENT CHECK
  // ===========================================
  
  const pdCheck: PDCheck = {
    passed: baseCheck.allowed && !baseCheck.requiresPermission,
    pdClass: projectInfo?.pdClass,
    conditions: baseCheck.conditions || [],
    limitations: [],
    reason: baseCheck.reason,
  };
  
  // Check for Article 4 restrictions
  if (property.hasArticle4 && property.article4Restrictions) {
    const projectTypeName = project.projectType.id.toLowerCase().replace('_', ' ');
    if (property.article4Restrictions.some(r => 
      r.toLowerCase().includes(projectTypeName) ||
      r.toLowerCase().includes('extensions') ||
      r.toLowerCase().includes('all development')
    )) {
      pdCheck.passed = false;
      pdCheck.limitations.push('Article 4 Direction removes permitted development rights for this project type');
    }
  }
  
  // ===========================================
  // 2. HERITAGE CHECK
  // ===========================================
  
  const heritageCheck: HeritageCheck = {
    status: property.heritageStatus,
    requirements: [],
    restrictions: [],
    consultationRequired: [],
  };
  
  if (property.heritageStatus === 'RED') {
    heritageCheck.requirements.push('Listed Building Consent required');
    heritageCheck.requirements.push('Heritage Statement required');
    heritageCheck.consultationRequired.push('Historic England');
    heritageCheck.restrictions.push('Materials must match existing');
    heritageCheck.restrictions.push('No uPVC windows permitted');
    heritageCheck.restrictions.push('Design must be sympathetic to historic character');
    
    if (property.listedGrade === 'I' || property.listedGrade === 'II*') {
      heritageCheck.restrictions.push('Highly likely to require site visit by conservation officer');
      warnings.push('Grade I and II* listed buildings have the highest level of protection - approval is difficult');
    }
  } else if (property.heritageStatus === 'AMBER') {
    heritageCheck.requirements.push('Design and Access Statement recommended');
    heritageCheck.consultationRequired.push('Conservation Officer');
    heritageCheck.restrictions.push('Design should respect conservation area character');
    heritageCheck.restrictions.push('Materials should be appropriate for the area');
    
    if (property.conservationAreaName) {
      heritageCheck.requirements.push(`Refer to ${property.conservationAreaName} Conservation Area Appraisal`);
    }
  } else {
    opportunities.push('No heritage restrictions - more design freedom available');
  }
  
  // ===========================================
  // 3. DIMENSION CHECK
  // ===========================================
  
  const dimensionCheck: DimensionCheck = {
    passed: true,
    maxAllowed: {},
    proposed: {
      depth: project.depth,
      height: project.height,
      width: project.width,
    },
    exceedances: [],
  };
  
  if (projectInfo?.rules) {
    const rules = projectInfo.rules as PDRuleExtended;
    
    // Check depth
    if (rules.maxDepth && project.depth && project.depth > rules.maxDepth) {
      dimensionCheck.passed = false;
      dimensionCheck.exceedances.push(
        `Depth exceeds maximum: ${project.depth}m proposed vs ${rules.maxDepth}m allowed`
      );
    }
    dimensionCheck.maxAllowed.depth = rules.maxDepth;
    
    // Check height
    if (rules.maxHeight && project.height && project.height > rules.maxHeight) {
      dimensionCheck.passed = false;
      dimensionCheck.exceedances.push(
        `Height exceeds maximum: ${project.height}m proposed vs ${rules.maxHeight}m allowed`
      );
    }
    dimensionCheck.maxAllowed.height = rules.maxHeight;
    
    // Check area
    if (rules.maxArea && project.width && project.depth) {
      const proposedArea = project.width * project.depth;
      if (proposedArea > rules.maxArea) {
        dimensionCheck.passed = false;
        dimensionCheck.exceedances.push(
          `Area exceeds maximum: ${proposedArea}m² proposed vs ${rules.maxArea}m² allowed`
        );
      }
      dimensionCheck.maxAllowed.area = rules.maxArea;
    }
  }
  
  // Property type specific checks
  if (property.propertyType === 'terraced' && project.projectType.id === PROJECT_TYPE_IDS.SIDE_EXTENSION) {
    dimensionCheck.passed = false;
    dimensionCheck.exceedances.push('Side extensions not possible on terraced properties');
  }
  
  // ===========================================
  // 4. CONSTRAINTS CHECK
  // ===========================================
  
  const constraintsCheck: ConstraintsCheck = {
    floodRisk: {
      applicable: property.isInFloodZone,
      zone: property.floodZone,
      requirements: [],
    },
    trees: {
      applicable: property.hasTPO,
      tpoAffected: false,
      requirements: [],
    },
    other: [],
  };
  
  if (property.isInFloodZone) {
    constraintsCheck.floodRisk.requirements.push('Flood Risk Assessment may be required');
    if (property.floodZone === 3) {
      constraintsCheck.floodRisk.requirements.push('Sequential Test required');
      constraintsCheck.floodRisk.requirements.push('Flood resilience measures must be incorporated');
      warnings.push('Property is in Flood Zone 3 - significant restrictions apply');
    }
  }
  
  if (property.hasTPO) {
    constraintsCheck.trees.requirements.push('Tree Survey required');
    constraintsCheck.trees.requirements.push('TPO application needed if trees affected');
    warnings.push('Tree Preservation Order affects the property - works to trees require consent');
  }
  
  if (property.isGreenBelt) {
    constraintsCheck.other.push('Green Belt location - very restrictive policies apply');
    warnings.push('Green Belt - extensions and new buildings face strong presumption against approval');
  }
  
  if (property.isAONB) {
    constraintsCheck.other.push('AONB - design must conserve and enhance natural beauty');
  }
  
  // ===========================================
  // 5. REQUIRED DOCUMENTS
  // ===========================================
  
  const requiredDocuments: DocumentRequirement[] = [
    {
      name: 'Application Form',
      required: true,
      description: 'Standard planning application form',
      estimatedCost: 'Included in fee',
    },
    {
      name: 'Site Location Plan (1:1250)',
      required: true,
      description: 'Ordnance Survey based plan showing site outlined in red',
      estimatedCost: '£20-50',
    },
    {
      name: 'Block Plan (1:500)',
      required: true,
      description: 'Plan showing the site and surrounding area',
      estimatedCost: '£20-50',
    },
    {
      name: 'Existing and Proposed Floor Plans',
      required: true,
      description: 'Scale drawings of existing and proposed layouts',
      estimatedCost: '£500-2000 (architect)',
    },
    {
      name: 'Existing and Proposed Elevations',
      required: true,
      description: 'Scale drawings showing all external faces',
      estimatedCost: 'Included with floor plans',
    },
  ];
  
  if (property.heritageStatus === 'RED') {
    requiredDocuments.push({
      name: 'Heritage Statement',
      required: true,
      description: 'Assessment of significance and impact on listed building',
      estimatedCost: '£1000-3000',
    });
    requiredDocuments.push({
      name: 'Listed Building Consent Form',
      required: true,
      description: 'Separate application for listed building consent',
      estimatedCost: 'No additional fee',
    });
  }
  
  if (property.heritageStatus === 'AMBER') {
    requiredDocuments.push({
      name: 'Design and Access Statement',
      required: true,
      description: 'Explanation of design approach and context',
      estimatedCost: '£300-800',
    });
  }
  
  if (property.hasTPO) {
    requiredDocuments.push({
      name: 'Tree Survey / Arboricultural Report',
      required: true,
      description: 'Assessment of trees and protection measures',
      estimatedCost: '£400-1000',
    });
  }
  
  // ===========================================
  // 6. FEE ESTIMATE
  // ===========================================
  
  let applicationFee = 258; // Standard householder fee 2024
  let listedBuildingFee = 0;
  
  if (property.heritageStatus === 'RED') {
    listedBuildingFee = 0; // LBC has no fee
  }
  
  const professionalFees: FeeEstimate['professionalFees'] = {};
  
  if (!pdCheck.passed) {
    professionalFees.architect = 2500; // Basic architectural drawings
    
    if (property.heritageStatus === 'RED' || property.heritageStatus === 'AMBER') {
      professionalFees.architect = 4000; // More complex heritage-sensitive design
    }
    
    if (property.heritageStatus === 'RED') {
      professionalFees.heritageConsultant = 2000;
    }
  }
  
  // Structural engineer for certain projects
  const projectTypeIdsArray: string[] = [PROJECT_TYPE_IDS.LOFT_CONVERSION, PROJECT_TYPE_IDS.BASEMENT, PROJECT_TYPE_IDS.REAR_EXTENSION];
  if (projectTypeIdsArray.includes(project.projectType.id)) {
    professionalFees.structuralEngineer = 800;
  }
  
  const feeEstimate: FeeEstimate = {
    applicationFee: pdCheck.passed ? 0 : applicationFee,
    listedBuildingFee,
    professionalFees,
    total: (pdCheck.passed ? 0 : applicationFee) + 
           listedBuildingFee + 
           Object.values(professionalFees).reduce((sum, fee) => sum + (fee || 0), 0),
  };
  
  // ===========================================
  // 7. DETERMINE PERMISSION TYPE REQUIRED
  // ===========================================
  
  let permissionRequired: FeasibilityReport['permissionRequired'] = 'none';
  
  if (property.heritageStatus === 'RED') {
    permissionRequired = 'listed-building-consent';
  } else if (!pdCheck.passed) {
    permissionRequired = 'planning-permission';
  } else if (baseCheck.requiresPermission) {
    permissionRequired = 'planning-permission';
  } else if (projectInfo?.rules?.priorApproval) {
    permissionRequired = 'prior-approval';
  }
  
  // ===========================================
  // 8. APPROVAL PREDICTION
  // ===========================================
  
  let approvalPrediction: PredictionResult | undefined;
  
  if (permissionRequired !== 'none') {
    const predictionInput: PredictionInput = {
      propertyType: property.propertyType,
      heritageStatus: property.heritageStatus,
      hasArticle4: property.hasArticle4,
      listedGrade: property.listedGrade,
      conservationAreaName: property.conservationAreaName,
      borough: property.borough,
      projectType: project.projectType.id.toLowerCase().replace('_', '-'),
      isVisibleFromHighway: project.isVisibleFromHighway,
      affectsNeighbors: project.affectsNeighbors,
      hasArchitect: true, // Assume they'll use one
      hasHeritageStatement: property.heritageStatus !== 'GREEN',
      hasPreApplication: false,
      previousRefusals: property.previousApplications?.filter(a => a.outcome === 'refused').length || 0,
      neighborObjectionsLikely: project.affectsNeighbors && !project.neighborConsulted,
    };
    
    approvalPrediction = predictApproval(predictionInput);
  }
  
  // ===========================================
  // 9. RECOMMENDED ACTIONS
  // ===========================================
  
  const recommendedActions: RecommendedAction[] = [];
  
  if (permissionRequired === 'none') {
    recommendedActions.push({
      priority: 'medium',
      action: 'Obtain Certificate of Lawful Development',
      reason: 'While not required, a CLEUD provides legal confirmation of your PD rights',
      estimatedCost: '£103',
      timeline: '8 weeks',
    });
  }
  
  if (property.heritageStatus !== 'GREEN' && permissionRequired !== 'none') {
    recommendedActions.push({
      priority: 'high',
      action: 'Request Pre-Application Advice',
      reason: 'Essential for heritage properties - get officer feedback before submitting',
      estimatedCost: '£150-500',
      timeline: '4-6 weeks for response',
    });
  }
  
  if (!dimensionCheck.passed) {
    recommendedActions.push({
      priority: 'high',
      action: 'Reduce project dimensions',
      reason: 'Current dimensions exceed permitted development limits',
      estimatedCost: 'Free - just modify plans',
    });
  }
  
  recommendedActions.push({
    priority: 'medium',
    action: 'Engage a registered architect',
    reason: 'Professional designs have higher approval rates',
    estimatedCost: '£2000-5000',
    timeline: '2-4 weeks for initial designs',
  });
  
  if (project.affectsNeighbors && !project.neighborConsulted) {
    recommendedActions.push({
      priority: 'high',
      action: 'Consult with neighbors',
      reason: 'Early consultation can prevent objections',
      estimatedCost: 'Free',
      timeline: 'Before submitting',
    });
  }
  
  // ===========================================
  // 10. GENERATE SUMMARY
  // ===========================================
  
  let summary: string;
  
  if (permissionRequired === 'none') {
    summary = `Good news! Your ${projectInfo?.name || 'project'} should be permitted development and can proceed without planning permission.`;
    
    if (pdCheck.conditions.length > 0) {
      summary += ` However, you must comply with these conditions: ${pdCheck.conditions.slice(0, 2).join('; ')}.`;
    }
  } else if (permissionRequired === 'prior-approval') {
    summary = `Your ${projectInfo?.name || 'project'} requires Prior Approval - a simpler process with lower fees (£120). `;
    summary += `The council can only consider specific matters like impact on neighbors.`;
  } else if (permissionRequired === 'listed-building-consent') {
    summary = `As a Grade ${property.listedGrade || 'II'} listed building, Listed Building Consent is required. `;
    summary += `This is a separate application (no fee) that considers impact on the building's special character. `;
    if (approvalPrediction) {
      summary += `Estimated approval chance: ${approvalPrediction.approvalProbability}%.`;
    }
  } else {
    summary = `Planning permission is required for your ${projectInfo?.name || 'project'}. `;
    if (approvalPrediction) {
      summary += `Based on similar applications, we estimate a ${approvalPrediction.approvalProbability}% chance of approval.`;
    }
  }
  
  // Add opportunities
  if (property.heritageStatus === 'GREEN' && !property.hasArticle4) {
    opportunities.push('Property has full permitted development rights - many improvements possible without permission');
  }
  
  // ===========================================
  // FINAL REPORT
  // ===========================================
  
  return {
    projectAllowed: pdCheck.passed || (approvalPrediction?.approvalProbability || 0) > 50,
    permissionRequired,
    summary,
    permittedDevelopmentCheck: pdCheck,
    heritageCheck,
    dimensionCheck,
    constraintsCheck,
    approvalPrediction,
    requiredDocuments,
    estimatedFees: feeEstimate,
    estimatedTimeline: permissionRequired === 'none' 
      ? 'Can start immediately'
      : permissionRequired === 'prior-approval'
        ? '42 days (from valid submission)'
        : property.heritageStatus === 'RED'
          ? '8-13 weeks'
          : '8 weeks (standard target)',
    recommendedActions: recommendedActions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    warnings,
    opportunities,
  };
}

// ===========================================
// QUICK CHECK FUNCTIONS
// ===========================================

export function quickFeasibilityCheck(
  projectType: ProjectType | string,
  heritageStatus: 'RED' | 'AMBER' | 'GREEN',
  hasArticle4: boolean
): { allowed: boolean; requiresPermission: boolean; summary: string } {
  const projectTypeId = typeof projectType === 'string' ? projectType : projectType.id;
  const result = canDoProject(projectTypeId, heritageStatus, hasArticle4);
  
  let summary: string;
  
  if (result.allowed && !result.requiresPermission) {
    summary = 'Likely permitted development - no planning permission needed';
  } else if (result.allowed && result.requiresPermission) {
    summary = 'May be possible with planning permission';
  } else {
    summary = result.reason || 'Unlikely to be permitted';
  }
  
  return {
    allowed: result.allowed,
    requiresPermission: result.requiresPermission,
    summary,
  };
}
