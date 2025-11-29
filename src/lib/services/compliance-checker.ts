/**
 * Compliance Checker Service
 * Building Regulations, Fire Safety, and Legal Compliance
 * Comprehensive compliance assessment for development projects
 */

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

interface ComplianceStatus {
  requirement: ComplianceRequirement;
  status: 'required' | 'recommended' | 'not_applicable';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedCost: { min: number; max: number };
  timeline: string;
  notes: string[];
}

interface ComplianceReport {
  projectType: string;
  propertyStatus: {
    isListed: boolean;
    inConservationArea: boolean;
    isFlat: boolean;
    floors: number;
  };
  requirements: ComplianceStatus[];
  totalEstimatedCost: { min: number; max: number };
  criticalItems: number;
  summary: string;
  nextSteps: string[];
}

// Building Regulations parts
const BUILDING_REGS_PARTS = {
  A: { name: 'Structure', description: 'Structural safety requirements' },
  B: { name: 'Fire Safety', description: 'Fire spread, means of escape, access' },
  C: { name: 'Site Preparation', description: 'Resistance to contaminants and moisture' },
  D: { name: 'Toxic Substances', description: 'Cavity insulation safety' },
  E: { name: 'Sound', description: 'Resistance to sound transmission' },
  F: { name: 'Ventilation', description: 'Ventilation requirements' },
  G: { name: 'Sanitation', description: 'Hot water safety, sanitary facilities' },
  H: { name: 'Drainage', description: 'Drainage and waste disposal' },
  J: { name: 'Combustion', description: 'Heat producing appliances' },
  K: { name: 'Protection from Falling', description: 'Stairs, ramps, guards' },
  L: { name: 'Conservation of Fuel', description: 'Energy efficiency' },
  M: { name: 'Access', description: 'Access to and use of buildings' },
  O: { name: 'Overheating', description: 'Mitigation of overheating' },
  P: { name: 'Electrical Safety', description: 'Electrical installation safety' },
  Q: { name: 'Security', description: 'Security in dwellings' },
  R: { name: 'Infrastructure', description: 'Physical infrastructure for communications' },
  S: { name: 'Infrastructure', description: 'Infrastructure for EV charging' },
};

// Compliance requirements database
const COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
  // Building Regulations
  {
    id: 'BR_FULL',
    category: 'building_regs',
    requirement: 'Full Plans Application',
    description: 'Formal Building Control approval for major works',
    applicableTo: ['extension', 'basement', 'new_build', 'structural'],
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
    applicableTo: ['all_notifiable'],
    documentNeeded: 'Inspection completion',
    responsibleParty: 'Building Control',
    penalty: 'Cannot sell without indemnity insurance',
  },
  
  // Fire Safety
  {
    id: 'FIRE_DETECT',
    category: 'fire_safety',
    requirement: 'Fire Detection System',
    description: 'Smoke/heat detectors, fire alarms as per Part B',
    applicableTo: ['extension', 'loft_conversion', 'basement', 'internal'],
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
    applicableTo: ['loft_conversion', 'flat', 'HMO'],
    documentNeeded: 'Fire door certification',
    responsibleParty: 'Owner/Installer',
    penalty: 'Replacement order',
  },
  
  // Disabled Access
  {
    id: 'ACCESS_M4',
    category: 'disabled_access',
    requirement: 'Part M4(1) Visitable Dwellings',
    description: 'Basic accessibility for visitors',
    applicableTo: ['new_build', 'conversion'],
    documentNeeded: 'Access statement',
    responsibleParty: 'Architect',
    penalty: 'BC rejection',
  },
  {
    id: 'ACCESS_REF',
    category: 'disabled_access',
    requirement: 'Reasonable Adjustments',
    description: 'Commercial premises must provide access',
    applicableTo: ['commercial', 'change_of_use'],
    documentNeeded: 'Access audit',
    responsibleParty: 'Owner',
    penalty: 'DDA litigation',
  },
  
  // Party Wall
  {
    id: 'PWA_NOTICE',
    category: 'party_wall',
    requirement: 'Party Wall Notice',
    description: 'Notice to adjoining owners 1-2 months before work',
    applicableTo: ['extension', 'basement', 'structural_near_boundary'],
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
  
  // CDM Regulations
  {
    id: 'CDM_CLIENT',
    category: 'cdm',
    requirement: 'CDM Client Duties',
    description: 'Health and safety duties for construction projects',
    applicableTo: ['all_construction'],
    documentNeeded: 'H&S file, risk assessments',
    responsibleParty: 'Client (Owner)',
    penalty: 'HSE prosecution, unlimited fine',
  },
  {
    id: 'CDM_DOMESTIC',
    category: 'cdm',
    requirement: 'Domestic Client Declaration',
    description: 'Pass CDM duties to contractor in writing',
    applicableTo: ['domestic_works'],
    documentNeeded: 'Written declaration',
    responsibleParty: 'Owner',
    penalty: 'Personal liability for H&S',
  },
  
  // Heritage
  {
    id: 'LBC',
    category: 'heritage',
    requirement: 'Listed Building Consent',
    description: 'Consent for works affecting listed building character',
    applicableTo: ['listed_building'],
    documentNeeded: 'LBC application, heritage statement',
    responsibleParty: 'Owner/Agent',
    penalty: 'Criminal prosecution, restoration order, unlimited fine',
  },
  {
    id: 'CA_CONSENT',
    category: 'heritage',
    requirement: 'Conservation Area Consent',
    description: 'For demolition or substantial works',
    applicableTo: ['conservation_area_demolition'],
    documentNeeded: 'Planning application, heritage impact assessment',
    responsibleParty: 'Owner/Agent',
    penalty: 'Enforcement, prosecution',
  },
  
  // Environmental
  {
    id: 'ENV_WASTE',
    category: 'environmental',
    requirement: 'Site Waste Management Plan',
    description: 'Plan for managing construction waste',
    applicableTo: ['major_works'],
    documentNeeded: 'SWMP document',
    responsibleParty: 'Contractor',
    penalty: 'Environmental prosecution',
  },
  {
    id: 'ENV_ASBESTOS',
    category: 'environmental',
    requirement: 'Asbestos Survey',
    description: 'Survey before demolition/refurbishment',
    applicableTo: ['pre_1999_building'],
    documentNeeded: 'Asbestos survey report',
    responsibleParty: 'Owner/Contractor',
    penalty: 'HSE prosecution, site closure',
  },
];

// Cost estimates for compliance items
const COMPLIANCE_COSTS: Record<string, { min: number; max: number }> = {
  'BR_FULL': { min: 1500, max: 5000 },
  'BR_NOTICE': { min: 500, max: 1500 },
  'BR_CERT': { min: 0, max: 0 },
  'FIRE_DETECT': { min: 500, max: 2000 },
  'FIRE_ESCAPE': { min: 2000, max: 10000 },
  'FIRE_DOOR': { min: 300, max: 800 },
  'ACCESS_M4': { min: 500, max: 2000 },
  'ACCESS_REF': { min: 1000, max: 5000 },
  'PWA_NOTICE': { min: 50, max: 100 },
  'PWA_AWARD': { min: 1500, max: 5000 },
  'CDM_CLIENT': { min: 500, max: 2000 },
  'CDM_DOMESTIC': { min: 0, max: 100 },
  'LBC': { min: 500, max: 2000 },
  'CA_CONSENT': { min: 500, max: 1500 },
  'ENV_WASTE': { min: 200, max: 500 },
  'ENV_ASBESTOS': { min: 300, max: 800 },
};

// Service class
export class ComplianceCheckerService {
  /**
   * Get compliance report for a project
   */
  getComplianceReport(
    projectType: string,
    propertyStatus: {
      isListed: boolean;
      inConservationArea: boolean;
      isFlat: boolean;
      floors: number;
      buildYear?: number;
    }
  ): ComplianceReport {
    const requirements: ComplianceStatus[] = [];
    const applicableTypes = this.getApplicableTypes(projectType, propertyStatus);
    
    for (const req of COMPLIANCE_REQUIREMENTS) {
      // Check if requirement applies
      const isApplicable = req.applicableTo.some(
        type => applicableTypes.includes(type)
      );
      
      if (!isApplicable) continue;
      
      // Determine status and priority
      const status = this.determineStatus(req, projectType, propertyStatus);
      const priority = this.determinePriority(req, propertyStatus);
      
      // Get cost estimate
      const costKey = req.id;
      const estimatedCost = COMPLIANCE_COSTS[costKey] || { min: 0, max: 500 };
      
      // Get timeline
      const timeline = this.getTimeline(req);
      
      // Build notes
      const notes = this.buildNotes(req, propertyStatus);
      
      requirements.push({
        requirement: req,
        status,
        priority,
        estimatedCost,
        timeline,
        notes,
      });
    }
    
    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    requirements.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    // Calculate totals
    const requiredItems = requirements.filter(r => r.status === 'required');
    const totalCost = requiredItems.reduce(
      (acc, r) => ({
        min: acc.min + r.estimatedCost.min,
        max: acc.max + r.estimatedCost.max,
      }),
      { min: 0, max: 0 }
    );
    
    const criticalItems = requirements.filter(
      r => r.priority === 'critical' && r.status === 'required'
    ).length;
    
    // Build summary
    const summary = this.buildSummary(requirements, propertyStatus);
    const nextSteps = this.buildNextSteps(requirements, propertyStatus);
    
    return {
      projectType,
      propertyStatus,
      requirements,
      totalEstimatedCost: totalCost,
      criticalItems,
      summary,
      nextSteps,
    };
  }

  /**
   * Get applicable work types
   */
  private getApplicableTypes(
    projectType: string,
    propertyStatus: {
      isListed: boolean;
      inConservationArea: boolean;
      isFlat: boolean;
      floors: number;
      buildYear?: number;
    }
  ): string[] {
    const types: string[] = [projectType, 'all_construction'];
    
    // Add based on project type
    if (['extension', 'basement', 'loft_conversion'].includes(projectType)) {
      types.push('structural', 'all_notifiable');
    }
    
    if (projectType === 'loft_conversion' && propertyStatus.floors >= 2) {
      types.push('multi_storey');
    }
    
    if (projectType === 'basement') {
      types.push('structural_near_boundary');
    }
    
    // Add based on property status
    if (propertyStatus.isListed) {
      types.push('listed_building');
    }
    
    if (propertyStatus.inConservationArea) {
      types.push('conservation_area');
    }
    
    if (propertyStatus.isFlat) {
      types.push('flat');
    }
    
    if (propertyStatus.buildYear && propertyStatus.buildYear < 1999) {
      types.push('pre_1999_building');
    }
    
    types.push('domestic_works');
    
    return types;
  }

  /**
   * Determine compliance status
   */
  private determineStatus(
    req: ComplianceRequirement,
    projectType: string,
    propertyStatus: {
      isListed: boolean;
      inConservationArea: boolean;
      isFlat: boolean;
      floors: number;
    }
  ): 'required' | 'recommended' | 'not_applicable' {
    // Heritage requirements
    if (req.id === 'LBC' && !propertyStatus.isListed) {
      return 'not_applicable';
    }
    
    // Always required for structural work
    if (req.category === 'building_regs' && 
        ['extension', 'basement', 'loft_conversion'].includes(projectType)) {
      return 'required';
    }
    
    // Fire safety required for loft conversions and basements
    if (req.category === 'fire_safety' && 
        ['basement', 'loft_conversion'].includes(projectType)) {
      return 'required';
    }
    
    // Party wall required for extensions and basements
    if (req.category === 'party_wall' && 
        ['extension', 'basement'].includes(projectType)) {
      return 'required';
    }
    
    // CDM always applies
    if (req.category === 'cdm') {
      return 'required';
    }
    
    // Heritage requirements for listed/conservation
    if (req.category === 'heritage') {
      if (req.id === 'LBC' && propertyStatus.isListed) {
        return 'required';
      }
      if (req.id === 'CA_CONSENT' && propertyStatus.inConservationArea) {
        return 'recommended';
      }
    }
    
    return 'recommended';
  }

  /**
   * Determine priority
   */
  private determinePriority(
    req: ComplianceRequirement,
    propertyStatus: {
      isListed: boolean;
      inConservationArea: boolean;
      isFlat: boolean;
      floors: number;
    }
  ): 'critical' | 'high' | 'medium' | 'low' {
    // Criminal penalties = critical
    if (req.penalty.toLowerCase().includes('criminal') ||
        req.penalty.toLowerCase().includes('prosecution') ||
        req.penalty.toLowerCase().includes('unlimited fine')) {
      return 'critical';
    }
    
    // LBC for listed buildings is critical
    if (req.id === 'LBC' && propertyStatus.isListed) {
      return 'critical';
    }
    
    // Fire safety and structural = high
    if (req.category === 'fire_safety' || req.category === 'building_regs') {
      return 'high';
    }
    
    // Party wall and CDM = medium
    if (req.category === 'party_wall' || req.category === 'cdm') {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Get timeline for requirement
   */
  private getTimeline(req: ComplianceRequirement): string {
    const timelines: Record<string, string> = {
      'PWA_NOTICE': '1-2 months before work starts',
      'BR_FULL': '5-8 weeks for approval',
      'BR_NOTICE': '48 hours notice required',
      'LBC': '8-13 weeks for decision',
      'ENV_ASBESTOS': 'Before any demolition/disturbance',
      'FIRE_DETECT': 'During construction',
      'FIRE_ESCAPE': 'Must be complete before occupation',
    };
    
    return timelines[req.id] || 'As part of project planning';
  }

  /**
   * Build notes for requirement
   */
  private buildNotes(
    req: ComplianceRequirement,
    propertyStatus: {
      isListed: boolean;
      inConservationArea: boolean;
      isFlat: boolean;
      floors: number;
    }
  ): string[] {
    const notes: string[] = [];
    
    if (propertyStatus.isListed && req.category === 'heritage') {
      notes.push('Heritage specialist advice recommended');
      notes.push('Works must be reversible where possible');
    }
    
    if (req.category === 'fire_safety' && propertyStatus.floors >= 3) {
      notes.push('Additional requirements for 3+ storey buildings');
    }
    
    if (req.category === 'party_wall') {
      notes.push('Neighbor consent or surveyor award required');
      notes.push('Can add 4-8 weeks to project timeline');
    }
    
    if (req.id === 'CDM_DOMESTIC') {
      notes.push('Most domestic clients pass duties to principal contractor');
    }
    
    return notes;
  }

  /**
   * Build summary
   */
  private buildSummary(
    requirements: ComplianceStatus[],
    propertyStatus: {
      isListed: boolean;
      inConservationArea: boolean;
      isFlat: boolean;
      floors: number;
    }
  ): string {
    const required = requirements.filter(r => r.status === 'required').length;
    const critical = requirements.filter(
      r => r.priority === 'critical' && r.status === 'required'
    ).length;
    
    let summary = `This project has ${required} compliance requirements`;
    
    if (critical > 0) {
      summary += `, including ${critical} critical items that must be addressed before starting work`;
    }
    
    if (propertyStatus.isListed) {
      summary += '. Listed Building Consent is mandatory.';
    } else if (propertyStatus.inConservationArea) {
      summary += '. Conservation area restrictions may apply.';
    } else {
      summary += '.';
    }
    
    return summary;
  }

  /**
   * Build next steps
   */
  private buildNextSteps(
    requirements: ComplianceStatus[],
    propertyStatus: {
      isListed: boolean;
      inConservationArea: boolean;
      isFlat: boolean;
      floors: number;
    }
  ): string[] {
    const steps: string[] = [];
    
    const critical = requirements.filter(
      r => r.priority === 'critical' && r.status === 'required'
    );
    
    for (const c of critical) {
      steps.push(`Apply for ${c.requirement.requirement}`);
    }
    
    if (requirements.some(r => r.requirement.category === 'party_wall' && r.status === 'required')) {
      steps.push('Serve Party Wall Notices to adjoining owners');
    }
    
    if (requirements.some(r => r.requirement.category === 'building_regs' && r.status === 'required')) {
      steps.push('Submit Building Regulations application');
    }
    
    if (propertyStatus.isListed) {
      steps.push('Engage heritage consultant for LBC application');
    }
    
    steps.push('Appoint competent contractors with relevant experience');
    steps.push('Ensure all approvals received before starting work');
    
    return steps;
  }

  /**
   * Get Building Regulations parts
   */
  getBuildingRegsParts(): typeof BUILDING_REGS_PARTS {
    return BUILDING_REGS_PARTS;
  }

  /**
   * Check specific compliance requirement
   */
  checkRequirement(
    requirementId: string
  ): ComplianceRequirement | null {
    return COMPLIANCE_REQUIREMENTS.find(r => r.id === requirementId) || null;
  }

  /**
   * Get all requirements by category
   */
  getRequirementsByCategory(
    category: ComplianceCategory
  ): ComplianceRequirement[] {
    return COMPLIANCE_REQUIREMENTS.filter(r => r.category === category);
  }
}

// Export singleton instance
export const complianceCheckerService = new ComplianceCheckerService();
