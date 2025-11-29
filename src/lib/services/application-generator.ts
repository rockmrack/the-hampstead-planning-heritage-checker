/**
 * Application Generator
 * Auto-generate planning application forms and documents
 */

import { ProjectType, getProjectTypeInfo } from '../config/project-types';

export interface ApplicationFormData {
  // Applicant
  applicant: {
    title?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      town: string;
      county?: string;
      postcode: string;
      country: string;
    };
    companyName?: string;
  };

  // Agent (if using one)
  agent?: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      town: string;
      county?: string;
      postcode: string;
    };
    registrationNumber?: string;
  };

  // Site
  site: {
    address: {
      line1: string;
      line2?: string;
      town: string;
      county?: string;
      postcode: string;
    };
    easting?: number;
    northing?: number;
    areaHectares?: number;
    currentUse?: string;
    isApplicantOwner: boolean;
    ownerDetails?: {
      name: string;
      address: string;
      notified: boolean;
      notificationDate?: string;
    };
  };

  // Proposal
  proposal: {
    type: ApplicationType;
    projectType: ProjectType;
    description: string;
    
    // For extensions
    dimensions?: {
      width?: number;
      depth?: number;
      height?: number;
      floorArea?: number;
    };
    
    // For change of use
    existingUseClass?: string;
    proposedUseClass?: string;
    
    // Materials
    materials?: {
      walls?: string;
      roof?: string;
      windows?: string;
      doors?: string;
      other?: string;
    };
    
    // Dates
    startDate?: string;
    completionDate?: string;
  };

  // Additional info
  additionalInfo: {
    hasTreesAffected: boolean;
    treeDetails?: string;
    hasParking: boolean;
    parkingSpaces?: {
      existing: number;
      proposed: number;
    };
    hasHazardousSubstances: boolean;
    hasDrainage: boolean;
    drainageType?: 'mains' | 'septic' | 'cesspool' | 'other';
    
    // Pre-app
    hasPreApplication: boolean;
    preApplicationRef?: string;
    preApplicationDate?: string;
    
    // Related applications
    relatedApplications?: string[];
  };

  // Heritage (if applicable)
  heritage?: {
    isListedBuilding: boolean;
    listingGrade?: 'I' | 'II*' | 'II';
    isConservationArea: boolean;
    conservationAreaName?: string;
    hasScheduledMonument: boolean;
    heritageAssetDescription?: string;
    impactJustification?: string;
  };

  // Declaration
  declaration: {
    agreedToTerms: boolean;
    agreedDate: string;
    signatureName: string;
  };
}

export type ApplicationType = 
  | 'householder'
  | 'full'
  | 'outline'
  | 'reserved-matters'
  | 'listed-building'
  | 'prior-approval'
  | 'lawful-development'
  | 'advertisement';

// ===========================================
// FORM TEMPLATES
// ===========================================

export interface FormTemplate {
  id: string;
  name: string;
  applicationType: ApplicationType;
  sections: FormSection[];
}

export interface FormSection {
  id: string;
  title: string;
  questions: FormQuestion[];
}

export interface FormQuestion {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'address';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  helpText?: string;
  conditionalOn?: {
    questionId: string;
    value: string | boolean;
  };
}

// ===========================================
// HOUSEHOLDER APPLICATION TEMPLATE
// ===========================================

export const HOUSEHOLDER_TEMPLATE: FormTemplate = {
  id: 'householder-2024',
  name: 'Householder Planning Application',
  applicationType: 'householder',
  sections: [
    {
      id: 'applicant',
      title: 'Applicant Details',
      questions: [
        {
          id: 'title',
          text: 'Title',
          type: 'select',
          required: false,
          options: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Other'],
        },
        {
          id: 'firstName',
          text: 'First Name',
          type: 'text',
          required: true,
        },
        {
          id: 'lastName',
          text: 'Last Name',
          type: 'text',
          required: true,
        },
        {
          id: 'email',
          text: 'Email Address',
          type: 'text',
          required: true,
          validation: {
            pattern: '^[^@]+@[^@]+\\.[^@]+$',
            message: 'Please enter a valid email address',
          },
        },
        {
          id: 'phone',
          text: 'Phone Number',
          type: 'text',
          required: true,
        },
        {
          id: 'applicantAddress',
          text: 'Applicant Address',
          type: 'address',
          required: true,
          helpText: 'Enter your current address',
        },
      ],
    },
    {
      id: 'agent',
      title: 'Agent Details (if applicable)',
      questions: [
        {
          id: 'hasAgent',
          text: 'Are you using an agent for this application?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No'],
        },
        {
          id: 'agentName',
          text: 'Agent Name',
          type: 'text',
          required: false,
          conditionalOn: { questionId: 'hasAgent', value: 'Yes' },
        },
        {
          id: 'agentCompany',
          text: 'Agent Company',
          type: 'text',
          required: false,
          conditionalOn: { questionId: 'hasAgent', value: 'Yes' },
        },
        {
          id: 'agentEmail',
          text: 'Agent Email',
          type: 'text',
          required: false,
          conditionalOn: { questionId: 'hasAgent', value: 'Yes' },
        },
      ],
    },
    {
      id: 'site',
      title: 'Site Details',
      questions: [
        {
          id: 'siteAddress',
          text: 'Site Address',
          type: 'address',
          required: true,
          helpText: 'The address where the work will take place',
        },
        {
          id: 'isApplicantOwner',
          text: 'Are you the sole owner of the site?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No'],
        },
        {
          id: 'ownerName',
          text: 'Owner Name',
          type: 'text',
          required: false,
          conditionalOn: { questionId: 'isApplicantOwner', value: 'No' },
        },
        {
          id: 'ownerNotified',
          text: 'Has the owner been notified?',
          type: 'radio',
          required: false,
          options: ['Yes', 'No'],
          conditionalOn: { questionId: 'isApplicantOwner', value: 'No' },
        },
      ],
    },
    {
      id: 'proposal',
      title: 'Description of Proposal',
      questions: [
        {
          id: 'description',
          text: 'Describe your proposed development',
          type: 'textarea',
          required: true,
          helpText: 'Provide a clear and concise description of the proposed works',
          validation: {
            min: 50,
            max: 4000,
            message: 'Description must be between 50 and 4000 characters',
          },
        },
        {
          id: 'hasExistingExtension',
          text: 'Does the property have any existing extensions?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No'],
        },
        {
          id: 'existingExtensionDetails',
          text: 'Describe existing extensions',
          type: 'textarea',
          required: false,
          conditionalOn: { questionId: 'hasExistingExtension', value: 'Yes' },
        },
      ],
    },
    {
      id: 'materials',
      title: 'Materials',
      questions: [
        {
          id: 'wallMaterial',
          text: 'External Wall Materials',
          type: 'select',
          required: true,
          options: ['Brick (matching existing)', 'Brick (different)', 'Render', 'Timber cladding', 'Stone', 'Other'],
        },
        {
          id: 'roofMaterial',
          text: 'Roof Materials',
          type: 'select',
          required: true,
          options: ['Tiles (matching existing)', 'Tiles (different)', 'Slate', 'Flat roof', 'Green roof', 'Other'],
        },
        {
          id: 'windowMaterial',
          text: 'Window/Door Materials',
          type: 'select',
          required: true,
          options: ['uPVC', 'Timber', 'Aluminium', 'Steel', 'Other'],
        },
      ],
    },
    {
      id: 'trees',
      title: 'Trees and Landscaping',
      questions: [
        {
          id: 'hasTreesAffected',
          text: 'Will any trees be affected by the proposal?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No'],
        },
        {
          id: 'treeDetails',
          text: 'Describe which trees and how they will be affected',
          type: 'textarea',
          required: false,
          conditionalOn: { questionId: 'hasTreesAffected', value: 'Yes' },
        },
        {
          id: 'hasTPO',
          text: 'Are any trees subject to a Tree Preservation Order?',
          type: 'radio',
          required: false,
          options: ['Yes', 'No', 'Unknown'],
          conditionalOn: { questionId: 'hasTreesAffected', value: 'Yes' },
        },
      ],
    },
    {
      id: 'heritage',
      title: 'Heritage',
      questions: [
        {
          id: 'isListedBuilding',
          text: 'Is the property a listed building?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No'],
        },
        {
          id: 'listingGrade',
          text: 'Listing Grade',
          type: 'select',
          required: false,
          options: ['Grade I', 'Grade II*', 'Grade II'],
          conditionalOn: { questionId: 'isListedBuilding', value: 'Yes' },
        },
        {
          id: 'isConservationArea',
          text: 'Is the property in a conservation area?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No', 'Unknown'],
        },
        {
          id: 'conservationAreaName',
          text: 'Conservation Area Name',
          type: 'text',
          required: false,
          conditionalOn: { questionId: 'isConservationArea', value: 'Yes' },
        },
      ],
    },
    {
      id: 'preApplication',
      title: 'Pre-Application Advice',
      questions: [
        {
          id: 'hasPreApp',
          text: 'Did you receive pre-application advice?',
          type: 'radio',
          required: true,
          options: ['Yes', 'No'],
        },
        {
          id: 'preAppRef',
          text: 'Pre-application reference number',
          type: 'text',
          required: false,
          conditionalOn: { questionId: 'hasPreApp', value: 'Yes' },
        },
        {
          id: 'preAppDate',
          text: 'Date of pre-application advice',
          type: 'date',
          required: false,
          conditionalOn: { questionId: 'hasPreApp', value: 'Yes' },
        },
      ],
    },
  ],
};

// ===========================================
// DOCUMENT GENERATORS
// ===========================================

export interface GeneratedDocument {
  type: DocumentType;
  name: string;
  content: string;
  format: 'pdf' | 'docx' | 'txt';
  metadata: {
    createdAt: string;
    reference: string;
    applicationType: string;
  };
}

export type DocumentType = 
  | 'covering-letter'
  | 'design-access-statement'
  | 'heritage-statement'
  | 'planning-statement'
  | 'site-description';

export function generateCoveringLetter(
  formData: ApplicationFormData,
  lpaName: string
): GeneratedDocument {
  const applicantName = `${formData.applicant.firstName} ${formData.applicant.lastName}`;
  const siteAddress = `${formData.site.address.line1}, ${formData.site.address.postcode}`;
  const projectInfo = getProjectTypeInfo(formData.proposal.projectType);
  
  const content = `
${applicantName}
${formData.applicant.address.line1}
${formData.applicant.address.town}
${formData.applicant.address.postcode}

${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

Planning Department
${lpaName}

Dear Sir/Madam,

RE: Planning Application - ${siteAddress}
${formData.proposal.description}

I am writing to submit a ${formData.proposal.type} planning application for the above property.

PROPOSAL
${formData.proposal.description}

The proposed development comprises ${projectInfo?.name || formData.proposal.projectType}.
${formData.proposal.dimensions ? `
The dimensions of the proposed works are:
- Width: ${formData.proposal.dimensions.width || 'N/A'}m
- Depth: ${formData.proposal.dimensions.depth || 'N/A'}m
- Height: ${formData.proposal.dimensions.height || 'N/A'}m
` : ''}

MATERIALS
The following materials are proposed:
- Walls: ${formData.proposal.materials?.walls || 'To match existing'}
- Roof: ${formData.proposal.materials?.roof || 'To match existing'}
- Windows: ${formData.proposal.materials?.windows || 'To match existing'}

${formData.heritage?.isConservationArea || formData.heritage?.isListedBuilding ? `
HERITAGE CONSIDERATIONS
${formData.heritage.isListedBuilding ? `The property is a Grade ${formData.heritage.listingGrade} listed building.` : ''}
${formData.heritage.isConservationArea ? `The property is located within the ${formData.heritage.conservationAreaName} Conservation Area.` : ''}

The proposal has been carefully designed to respect and preserve the heritage significance of the property and its setting.
` : ''}

${formData.additionalInfo.hasPreApplication ? `
PRE-APPLICATION ADVICE
Pre-application advice was received from the Council under reference ${formData.additionalInfo.preApplicationRef} dated ${formData.additionalInfo.preApplicationDate}. The current proposal has been amended to address the comments received.
` : ''}

DOCUMENTS ENCLOSED
The following documents are enclosed with this application:
1. Completed application form
2. Site location plan (1:1250)
3. Block plan (1:500)
4. Existing and proposed floor plans
5. Existing and proposed elevations
${formData.heritage?.isListedBuilding ? '6. Heritage Statement' : ''}
${formData.heritage?.isConservationArea ? '6. Design and Access Statement' : ''}

I trust that the information provided is sufficient for the application to be validated. Should you require any additional information, please do not hesitate to contact me.

I look forward to receiving your decision in due course.

Yours faithfully,


${applicantName}
${formData.applicant.email}
${formData.applicant.phone}
  `.trim();

  return {
    type: 'covering-letter',
    name: `Covering_Letter_${formData.site.address.postcode.replace(' ', '')}.txt`,
    content,
    format: 'txt',
    metadata: {
      createdAt: new Date().toISOString(),
      reference: `HPE/${Date.now()}`,
      applicationType: formData.proposal.type,
    },
  };
}

export function generateDesignAccessStatement(
  formData: ApplicationFormData
): GeneratedDocument {
  const siteAddress = `${formData.site.address.line1}, ${formData.site.address.postcode}`;
  
  const content = `
DESIGN AND ACCESS STATEMENT

${siteAddress}

${formData.proposal.description}

Prepared: ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}

================================================================================

1. INTRODUCTION

1.1 This Design and Access Statement has been prepared in support of a planning application for ${formData.proposal.description} at ${siteAddress}.

1.2 The statement describes the design thinking behind the proposals and how issues of access have been addressed.

================================================================================

2. SITE CONTEXT

2.1 Site Description
The application site comprises ${formData.site.currentUse || 'a residential dwelling'} located at ${siteAddress}.

2.2 Planning History
${formData.additionalInfo.relatedApplications && formData.additionalInfo.relatedApplications.length > 0 
  ? `The site has the following planning history: ${formData.additionalInfo.relatedApplications.join(', ')}`
  : 'No relevant planning history has been identified for the site.'}

2.3 Planning Policy Context
${formData.heritage?.isConservationArea 
  ? `The site is located within the ${formData.heritage.conservationAreaName} Conservation Area. The proposal has been designed with careful regard to local conservation area policies.`
  : 'The site is not located within a Conservation Area.'}

${formData.heritage?.isListedBuilding 
  ? `The property is a Grade ${formData.heritage.listingGrade} listed building. The proposals have been designed to preserve the special architectural and historic interest of the building.`
  : ''}

================================================================================

3. DESIGN

3.1 Amount
${formData.proposal.dimensions 
  ? `The proposal comprises:
- Floor area: ${formData.proposal.dimensions.floorArea || 'TBC'} sq.m
- Width: ${formData.proposal.dimensions.width || 'TBC'}m
- Depth: ${formData.proposal.dimensions.depth || 'TBC'}m
- Height: ${formData.proposal.dimensions.height || 'TBC'}m`
  : 'Dimensions as shown on the submitted drawings.'}

3.2 Layout
The proposal has been designed to relate positively to the existing building and surrounding properties.

3.3 Scale
The scale of the development is appropriate to the character of the site and surrounding area.

3.4 Landscaping
${formData.additionalInfo.hasTreesAffected 
  ? `Trees on the site: ${formData.additionalInfo.treeDetails || 'See tree survey for details.'}` 
  : 'No significant trees are affected by the proposal.'}

3.5 Appearance
Materials have been selected to complement the existing building:
- External walls: ${formData.proposal.materials?.walls || 'To match existing'}
- Roof: ${formData.proposal.materials?.roof || 'To match existing'}  
- Windows and doors: ${formData.proposal.materials?.windows || 'To match existing'}

================================================================================

4. ACCESS

4.1 Inclusive Access
The proposal maintains existing access arrangements.

4.2 Vehicle Access
${formData.additionalInfo.hasParking 
  ? `Parking provision: ${formData.additionalInfo.parkingSpaces?.existing || 0} existing spaces, ${formData.additionalInfo.parkingSpaces?.proposed || 0} proposed spaces.`
  : 'No changes to existing parking arrangements.'}

================================================================================

5. CONCLUSION

5.1 The proposed development has been carefully designed to:
- Respect the character of the existing building
- Be sympathetic to neighbouring properties
- Use appropriate materials
${formData.heritage?.isConservationArea ? '- Preserve the character of the Conservation Area' : ''}
${formData.heritage?.isListedBuilding ? '- Preserve the special interest of the listed building' : ''}

5.2 Approval is therefore respectfully requested.
  `.trim();

  return {
    type: 'design-access-statement',
    name: `Design_Access_Statement_${formData.site.address.postcode.replace(' ', '')}.txt`,
    content,
    format: 'txt',
    metadata: {
      createdAt: new Date().toISOString(),
      reference: `HPE/${Date.now()}`,
      applicationType: formData.proposal.type,
    },
  };
}

export function generateHeritageStatement(
  formData: ApplicationFormData
): GeneratedDocument {
  const siteAddress = `${formData.site.address.line1}, ${formData.site.address.postcode}`;
  
  const content = `
HERITAGE STATEMENT

${siteAddress}

${formData.proposal.description}

Prepared: ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}

================================================================================

1. INTRODUCTION

1.1 Purpose
This Heritage Statement has been prepared in accordance with paragraph 194 of the National Planning Policy Framework (NPPF) to describe the significance of heritage assets affected by the proposals and assess the impact of the proposed development.

1.2 The Property
${formData.heritage?.isListedBuilding 
  ? `The property is a Grade ${formData.heritage.listingGrade} listed building. ${formData.heritage.heritageAssetDescription || ''}`
  : ''}
${formData.heritage?.isConservationArea 
  ? `The property is located within the ${formData.heritage.conservationAreaName} Conservation Area.`
  : ''}

================================================================================

2. HERITAGE SIGNIFICANCE

2.1 Statement of Significance
${formData.heritage?.heritageAssetDescription || 
  'The significance of the heritage asset derives from its historic, architectural and aesthetic interest.'}

2.2 Setting
The setting of the heritage asset contributes to its significance through [describe relevant aspects of setting].

================================================================================

3. THE PROPOSALS

3.1 Description
${formData.proposal.description}

3.2 Materials
The following materials are proposed to ensure the works are sympathetic to the heritage asset:
- External walls: ${formData.proposal.materials?.walls || 'To match existing'}
- Roof: ${formData.proposal.materials?.roof || 'To match existing'}
- Windows and doors: ${formData.proposal.materials?.windows || 'To match existing'}

================================================================================

4. IMPACT ASSESSMENT

4.1 Assessment of Impact
${formData.heritage?.impactJustification || 
  `The proposed works have been designed to preserve and enhance the significance of the heritage asset.

The proposals will:
- Use materials that are appropriate to the character of the building
- Maintain the proportions and design language of the existing structure
- Be reversible where possible
- Not harm the setting of the heritage asset`}

4.2 Public Benefits
The proposal will deliver the following public benefits:
- Continued residential use of the building
- Investment in the maintenance and upkeep of the heritage asset
- Enhancement of the street scene

================================================================================

5. CONCLUSION

5.1 The proposals have been designed with careful regard to the heritage significance of the property and its setting.

5.2 The works will preserve the special architectural and historic interest of the ${formData.heritage?.isListedBuilding ? 'listed building' : 'conservation area'} in accordance with:
- Section 66 of the Planning (Listed Buildings and Conservation Areas) Act 1990
- Chapter 16 of the National Planning Policy Framework
- Local Plan heritage policies

5.3 ${formData.heritage?.isListedBuilding ? 'Listed Building Consent' : 'Planning Permission'} is therefore respectfully requested.
  `.trim();

  return {
    type: 'heritage-statement',
    name: `Heritage_Statement_${formData.site.address.postcode.replace(' ', '')}.txt`,
    content,
    format: 'txt',
    metadata: {
      createdAt: new Date().toISOString(),
      reference: `HPE/${Date.now()}`,
      applicationType: formData.proposal.type,
    },
  };
}

// ===========================================
// APPLICATION GENERATOR SERVICE
// ===========================================

export class ApplicationGenerator {
  /**
   * Generate complete application package
   */
  generateApplicationPackage(
    formData: ApplicationFormData,
    lpaName: string
  ): {
    documents: GeneratedDocument[];
    checklist: ChecklistItem[];
    summary: string;
  } {
    const documents: GeneratedDocument[] = [];

    // Always generate covering letter
    documents.push(generateCoveringLetter(formData, lpaName));

    // Generate heritage statement if needed
    if (formData.heritage?.isListedBuilding || formData.heritage?.isConservationArea) {
      documents.push(generateDesignAccessStatement(formData));
      
      if (formData.heritage.isListedBuilding) {
        documents.push(generateHeritageStatement(formData));
      }
    }

    // Generate checklist
    const checklist = this.generateChecklist(formData);

    // Generate summary
    const summary = this.generateSummary(formData, documents, checklist);

    return { documents, checklist, summary };
  }

  /**
   * Generate document checklist
   */
  private generateChecklist(formData: ApplicationFormData): ChecklistItem[] {
    const checklist: ChecklistItem[] = [
      {
        item: 'Completed application form',
        required: true,
        completed: false,
        notes: 'Use Planning Portal or council form',
      },
      {
        item: 'Site location plan (1:1250)',
        required: true,
        completed: false,
        notes: 'Must be OS based with north point and scale bar',
      },
      {
        item: 'Block plan (1:500 or 1:200)',
        required: true,
        completed: false,
        notes: 'Show site boundary, buildings, roads',
      },
      {
        item: 'Existing floor plans',
        required: true,
        completed: false,
        notes: 'Scale 1:50 or 1:100',
      },
      {
        item: 'Proposed floor plans',
        required: true,
        completed: false,
        notes: 'Scale 1:50 or 1:100',
      },
      {
        item: 'Existing elevations',
        required: true,
        completed: false,
        notes: 'All elevations affected by proposal',
      },
      {
        item: 'Proposed elevations',
        required: true,
        completed: false,
        notes: 'All elevations affected by proposal',
      },
      {
        item: 'Covering letter',
        required: false,
        completed: true,
        notes: 'Generated - see documents',
      },
    ];

    // Add conditional items
    if (formData.heritage?.isListedBuilding) {
      checklist.push(
        {
          item: 'Heritage Statement',
          required: true,
          completed: true,
          notes: 'Generated - see documents',
        },
        {
          item: 'Listed Building Consent form',
          required: true,
          completed: false,
          notes: 'Separate application required',
        },
        {
          item: 'Photographs of affected areas',
          required: true,
          completed: false,
          notes: 'Internal and external photos',
        }
      );
    }

    if (formData.heritage?.isConservationArea) {
      checklist.push({
        item: 'Design and Access Statement',
        required: true,
        completed: true,
        notes: 'Generated - see documents',
      });
    }

    if (formData.additionalInfo.hasTreesAffected) {
      checklist.push({
        item: 'Tree Survey / Arboricultural Report',
        required: true,
        completed: false,
        notes: 'Required if trees affected',
      });
    }

    checklist.push({
      item: 'Application fee',
      required: true,
      completed: false,
      notes: formData.proposal.type === 'householder' ? '£258 (2024)' : 'See fee schedule',
    });

    return checklist;
  }

  /**
   * Generate application summary
   */
  private generateSummary(
    formData: ApplicationFormData,
    documents: GeneratedDocument[],
    checklist: ChecklistItem[]
  ): string {
    const requiredItems = checklist.filter(item => item.required);
    const completedItems = checklist.filter(item => item.completed);

    return `
Application Summary
==================

Applicant: ${formData.applicant.firstName} ${formData.applicant.lastName}
Site: ${formData.site.address.line1}, ${formData.site.address.postcode}
Proposal: ${formData.proposal.description}

Application Type: ${formData.proposal.type.charAt(0).toUpperCase() + formData.proposal.type.slice(1)}
${formData.heritage?.isListedBuilding ? 'Listed Building: Grade ' + formData.heritage.listingGrade : ''}
${formData.heritage?.isConservationArea ? 'Conservation Area: ' + formData.heritage.conservationAreaName : ''}

Documents Generated: ${documents.length}
Checklist Items: ${completedItems.length}/${requiredItems.length} complete

Next Steps:
1. Prepare architectural drawings (existing and proposed plans/elevations)
2. Obtain site location plan from OS or Planning Portal
3. Complete any remaining checklist items
4. Submit via Planning Portal or direct to council
5. Pay application fee

Estimated Processing Time: 8 weeks (householder)
    `.trim();
  }
}

export interface ChecklistItem {
  item: string;
  required: boolean;
  completed: boolean;
  notes?: string;
}

// Singleton instance
export const applicationGenerator = new ApplicationGenerator();
