/**
 * Document Generation Service
 * 
 * AI-powered generation of planning documents including:
 * - Heritage Impact Assessments
 * - Design & Access Statements
 * - Planning Application Narratives
 * - Neighbor Notification Letters
 * 
 * @module services/document-generator
 */

import { PropertyCheckResult, ConservationArea, ListedBuilding } from '@/types';

// ===========================================
// TYPES
// ===========================================

export type DocumentType = 
  | 'heritage_statement'
  | 'design_access_statement'
  | 'planning_statement'
  | 'neighbor_letter'
  | 'party_wall_notice'
  | 'pre_application_letter';

export interface DocumentRequest {
  type: DocumentType;
  property: PropertyContext;
  project: ProjectDetails;
  applicant: ApplicantDetails;
  options?: DocumentOptions;
}

export interface PropertyContext {
  address: string;
  postcode: string;
  borough: string;
  heritageStatus: 'RED' | 'AMBER' | 'GREEN';
  listedBuilding?: ListedBuilding | null;
  conservationArea?: ConservationArea | null;
  hasArticle4: boolean;
  propertyType: 'detached' | 'semi-detached' | 'terraced' | 'flat' | 'maisonette';
  buildYear?: number;
  architecturalStyle?: string;
  existingCondition?: string;
}

export interface ProjectDetails {
  type: string;
  description: string;
  dimensions?: {
    width?: number;
    depth?: number;
    height?: number;
    area?: number;
  };
  materials?: {
    walls?: string;
    roof?: string;
    windows?: string;
    doors?: string;
  };
  designRationale?: string;
  impactOnNeighbors?: string;
  sustainabilityFeatures?: string[];
}

export interface ApplicantDetails {
  name: string;
  email?: string;
  phone?: string;
  isOwner: boolean;
  agentName?: string;
  architectName?: string;
}

export interface DocumentOptions {
  tone?: 'formal' | 'professional' | 'friendly';
  length?: 'concise' | 'standard' | 'detailed';
  includePhotos?: boolean;
  includeDrawings?: boolean;
}

export interface GeneratedDocument {
  id: string;
  type: DocumentType;
  title: string;
  content: string;
  sections: DocumentSection[];
  metadata: DocumentMetadata;
  createdAt: Date;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  order: number;
  required: boolean;
}

export interface DocumentMetadata {
  wordCount: number;
  estimatedReadTime: number;
  requiredForApplication: boolean;
  typicalCostIfProfessional: { low: number; high: number };
  tips: string[];
}

// ===========================================
// DOCUMENT TEMPLATES
// ===========================================

const HERITAGE_STATEMENT_TEMPLATE = {
  title: 'Heritage Impact Assessment',
  sections: [
    {
      id: 'introduction',
      title: '1. Introduction',
      template: `This Heritage Impact Assessment has been prepared in support of an application for Listed Building Consent / Planning Permission at {{ADDRESS}}.

The property is a {{LISTED_GRADE}} listed building / located within the {{CONSERVATION_AREA}} Conservation Area and the proposed works comprise {{PROJECT_DESCRIPTION}}.

This statement has been prepared in accordance with the requirements of the National Planning Policy Framework (NPPF) and Historic England guidance.`,
      required: true,
    },
    {
      id: 'significance',
      title: '2. Statement of Significance',
      template: `### 2.1 Historical Background
{{PROPERTY_ADDRESS}} dates from {{BUILD_YEAR}} and represents a {{ARCHITECTURAL_STYLE}} property typical of the {{AREA_NAME}} area.

### 2.2 Architectural Significance
The building's significance derives from:
- {{SIGNIFICANCE_POINTS}}

### 2.3 Setting
The property sits within {{SETTING_DESCRIPTION}}. The surrounding area is characterised by {{AREA_CHARACTER}}.

### 2.4 Special Interest
{{LISTED_BUILDING ? 'The building was listed on {{LISTING_DATE}} and the reasons for listing include: {{LISTING_REASONS}}' : 'The property makes a positive contribution to the conservation area through its {{CONTRIBUTION_FACTORS}}'}}`,
      required: true,
    },
    {
      id: 'proposals',
      title: '3. Description of Proposed Works',
      template: `### 3.1 Summary of Proposals
{{PROJECT_DESCRIPTION}}

### 3.2 Detailed Description
{{DETAILED_DESCRIPTION}}

### 3.3 Materials
The following materials are proposed:
{{MATERIALS_LIST}}

### 3.4 Design Approach
{{DESIGN_RATIONALE}}`,
      required: true,
    },
    {
      id: 'impact',
      title: '4. Assessment of Impact',
      template: `### 4.1 Impact on Significance
{{IMPACT_ASSESSMENT}}

### 4.2 Justification
{{JUSTIFICATION}}

### 4.3 Mitigation Measures
The following measures have been incorporated to minimise impact:
{{MITIGATION_MEASURES}}

### 4.4 Public Benefits
{{PUBLIC_BENEFITS}}`,
      required: true,
    },
    {
      id: 'policy',
      title: '5. Planning Policy Context',
      template: `### 5.1 National Policy
The proposals have been considered against:
- National Planning Policy Framework (NPPF) - particularly paragraphs 199-208 relating to heritage assets
- Planning (Listed Buildings and Conservation Areas) Act 1990

### 5.2 Local Policy
{{BOROUGH}} Local Plan policies relevant to this application include:
{{LOCAL_POLICIES}}

### 5.3 Guidance
Historic England guidance documents considered:
- Conservation Principles, Policies and Guidance (2008)
- {{SPECIFIC_GUIDANCE}}`,
      required: true,
    },
    {
      id: 'conclusion',
      title: '6. Conclusion',
      template: `In conclusion, the proposed works at {{ADDRESS}} have been carefully designed to:
{{CONCLUSION_POINTS}}

The proposals will {{POSITIVE_OUTCOME}} while preserving the special interest of the {{HERITAGE_ASSET_TYPE}}.

It is therefore submitted that the proposals comply with national and local planning policy and Listed Building Consent / Planning Permission should be granted.`,
      required: true,
    },
  ],
};

const DESIGN_ACCESS_STATEMENT_TEMPLATE = {
  title: 'Design and Access Statement',
  sections: [
    {
      id: 'introduction',
      title: '1. Introduction',
      template: `This Design and Access Statement has been prepared to accompany an application for planning permission at {{ADDRESS}}, {{POSTCODE}}.

The application is for {{PROJECT_DESCRIPTION}}.

This statement explains the design principles and concepts that have been applied to the development and demonstrates how issues of access have been addressed.`,
      required: true,
    },
    {
      id: 'context',
      title: '2. Site Context and Constraints',
      template: `### 2.1 Site Location
{{ADDRESS}} is located in {{BOROUGH}}, within the {{POSTCODE}} postcode area.

### 2.2 Existing Building
The property is a {{PROPERTY_TYPE}} {{ARCHITECTURAL_STYLE}} building dating from approximately {{BUILD_YEAR}}.

### 2.3 Planning Designations
{{DESIGNATIONS}}

### 2.4 Site Constraints
The following constraints have been identified and addressed in the design:
{{CONSTRAINTS}}`,
      required: true,
    },
    {
      id: 'design',
      title: '3. Design Principles',
      template: `### 3.1 Amount and Layout
{{AMOUNT_LAYOUT}}

### 3.2 Scale
{{SCALE_DESCRIPTION}}

### 3.3 Appearance
{{APPEARANCE_DESCRIPTION}}

### 3.4 Materials
{{MATERIALS_DESCRIPTION}}

### 3.5 Landscaping
{{LANDSCAPING}}`,
      required: true,
    },
    {
      id: 'access',
      title: '4. Access',
      template: `### 4.1 Vehicular Access
{{VEHICULAR_ACCESS}}

### 4.2 Pedestrian Access
{{PEDESTRIAN_ACCESS}}

### 4.3 Inclusive Access
The proposals have been designed to be accessible and inclusive:
{{INCLUSIVE_ACCESS}}`,
      required: true,
    },
    {
      id: 'sustainability',
      title: '5. Sustainability',
      template: `The following sustainability measures are incorporated:
{{SUSTAINABILITY_MEASURES}}`,
      required: false,
    },
    {
      id: 'conclusion',
      title: '6. Conclusion',
      template: `The proposals represent a well-designed {{PROJECT_TYPE}} that:
{{CONCLUSION_POINTS}}

Planning permission is respectfully requested.`,
      required: true,
    },
  ],
};

const NEIGHBOR_LETTER_TEMPLATE = {
  title: 'Neighbor Notification Letter',
  sections: [
    {
      id: 'letter',
      title: 'Letter',
      template: `{{DATE}}

Dear Neighbour,

**Re: Planned Building Works at {{ADDRESS}}**

I am writing to let you know about building works we are planning at our property, which neighbours yours.

**What we are planning:**
{{PROJECT_DESCRIPTION}}

**When:**
We anticipate starting works in {{START_TIMEFRAME}} and expect them to take approximately {{DURATION}}.

**Working Hours:**
Our contractors will work Monday to Friday 8am-6pm, and Saturday 8am-1pm. No work will take place on Sundays or Bank Holidays.

**What this means for you:**
{{NEIGHBOR_IMPACT}}

**Contact:**
If you have any questions or concerns, please don't hesitate to contact us:
{{CONTACT_DETAILS}}

We are happy to show you the approved plans or discuss any aspect of the project.

Yours sincerely,

{{APPLICANT_NAME}}`,
      required: true,
    },
  ],
};

// ===========================================
// DOCUMENT GENERATOR SERVICE
// ===========================================

class DocumentGeneratorService {
  /**
   * Generate a planning document
   */
  async generateDocument(request: DocumentRequest): Promise<GeneratedDocument> {
    const { type, property, project, applicant, options = {} } = request;
    
    switch (type) {
      case 'heritage_statement':
        return this.generateHeritageStatement(property, project, applicant, options);
      case 'design_access_statement':
        return this.generateDesignAccessStatement(property, project, applicant, options);
      case 'neighbor_letter':
        return this.generateNeighborLetter(property, project, applicant, options);
      case 'planning_statement':
        return this.generatePlanningStatement(property, project, applicant, options);
      case 'pre_application_letter':
        return this.generatePreApplicationLetter(property, project, applicant, options);
      default:
        throw new Error(`Unsupported document type: ${type}`);
    }
  }
  
  /**
   * Generate Heritage Impact Assessment / Heritage Statement
   */
  private async generateHeritageStatement(
    property: PropertyContext,
    project: ProjectDetails,
    applicant: ApplicantDetails,
    options: DocumentOptions
  ): Promise<GeneratedDocument> {
    const sections: DocumentSection[] = [];
    let sectionOrder = 0;
    
    // Introduction
    sections.push({
      id: 'introduction',
      title: '1. Introduction',
      content: this.generateHeritageIntroduction(property, project),
      order: sectionOrder++,
      required: true,
    });
    
    // Statement of Significance
    sections.push({
      id: 'significance',
      title: '2. Statement of Significance',
      content: this.generateSignificanceStatement(property),
      order: sectionOrder++,
      required: true,
    });
    
    // Description of Proposals
    sections.push({
      id: 'proposals',
      title: '3. Description of Proposed Works',
      content: this.generateProposalDescription(project),
      order: sectionOrder++,
      required: true,
    });
    
    // Impact Assessment
    sections.push({
      id: 'impact',
      title: '4. Assessment of Impact',
      content: this.generateImpactAssessment(property, project),
      order: sectionOrder++,
      required: true,
    });
    
    // Policy Context
    sections.push({
      id: 'policy',
      title: '5. Planning Policy Context',
      content: this.generatePolicyContext(property),
      order: sectionOrder++,
      required: true,
    });
    
    // Conclusion
    sections.push({
      id: 'conclusion',
      title: '6. Conclusion',
      content: this.generateHeritageConclusion(property, project),
      order: sectionOrder++,
      required: true,
    });
    
    const content = sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');
    
    return {
      id: `doc-${Date.now()}`,
      type: 'heritage_statement',
      title: `Heritage Impact Assessment - ${property.address}`,
      content,
      sections,
      metadata: {
        wordCount: content.split(/\s+/).length,
        estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
        requiredForApplication: property.heritageStatus === 'RED',
        typicalCostIfProfessional: { low: 800, high: 2500 },
        tips: [
          'Include photographs of existing building and surroundings',
          'Reference the statutory list description',
          'Be honest about impact but emphasize mitigation',
          'Cite specific Historic England guidance',
        ],
      },
      createdAt: new Date(),
    };
  }
  
  private generateHeritageIntroduction(property: PropertyContext, project: ProjectDetails): string {
    const assetType = property.listedBuilding 
      ? `Grade ${property.listedBuilding.grade} listed building`
      : `property within the ${property.conservationArea?.name} Conservation Area`;
    
    return `This Heritage Impact Assessment has been prepared in support of an application for ${property.listedBuilding ? 'Listed Building Consent' : 'Planning Permission'} at **${property.address}**, **${property.postcode}**.

The property is a ${assetType}, and the proposed works comprise ${project.description}.

This statement has been prepared in accordance with:
- The National Planning Policy Framework (NPPF), particularly paragraphs 199-208 concerning designated heritage assets
- Historic England's guidance documents including "Statements of Heritage Significance" (2019)
- ${property.borough} Council's Local Plan heritage policies
- The Planning (Listed Buildings and Conservation Areas) Act 1990

### Purpose of this Document
This statement aims to:
1. Describe the significance of ${property.address} as a heritage asset
2. Set out the nature and extent of the proposed works
3. Assess the impact of the proposals on the heritage significance
4. Demonstrate how any harm has been avoided, minimised, or mitigated
5. Identify any public benefits arising from the proposals`;
  }
  
  private generateSignificanceStatement(property: PropertyContext): string {
    const buildYear = property.buildYear || 'the 19th century';
    const style = property.architecturalStyle || 'traditional London';
    
    let content = `### 2.1 Historical Background

${property.address} dates from approximately ${buildYear}. The property represents a ${style} ${property.propertyType} typical of the development of ${property.borough} during this period.

`;
    
    if (property.listedBuilding) {
      content += `### 2.2 Statutory Designation

The building was added to the statutory list of buildings of special architectural or historic interest as a **Grade ${property.listedBuilding.grade}** listed building.

**List Entry Number:** ${property.listedBuilding.listEntryNumber}
**Building Name:** ${property.listedBuilding.name}

The listing description notes the building's significance for:
- Its architectural interest as a well-preserved example of ${style} architecture
- Its historic interest as part of the ${property.borough} development
- The quality and survival of original features

`;
    }
    
    if (property.conservationArea) {
      content += `### 2.${property.listedBuilding ? '3' : '2'} Conservation Area Context

The property lies within the **${property.conservationArea.name} Conservation Area**, designated by ${property.borough} Council${property.conservationArea.designationDate ? ` in ${property.conservationArea.designationDate}` : ''}.

${property.conservationArea.characterAppraisal ? `The Conservation Area Appraisal identifies the special interest of this area as deriving from its coherent architectural character, historic development patterns, and the quality of the built environment.` : ''}

${property.hasArticle4 ? `**Article 4 Direction:** An Article 4 Direction applies to this property, removing certain permitted development rights to preserve the special character of the conservation area.` : ''}

`;
    }
    
    content += `### 2.${property.listedBuilding && property.conservationArea ? '4' : property.listedBuilding || property.conservationArea ? '3' : '2'} Architectural Significance

The building's significance derives from:

**Evidential Value**
- Physical evidence of ${buildYear.toString().includes('century') ? `${buildYear}` : `${buildYear}s`} construction techniques
- Original plan form and spatial hierarchy
- Surviving historic fabric and features

**Historical Value**
- Association with the historical development of ${property.borough}
- Evidence of social history and domestic life
- Contribution to understanding local architectural traditions

**Aesthetic Value**
- Quality of ${style} design and craftsmanship
- Contribution to the streetscape and local character
- Visual interest of the building form and details

**Communal Value**
- Contribution to local identity and sense of place
- Part of a recognisable and valued historic environment`;
    
    return content;
  }
  
  private generateProposalDescription(project: ProjectDetails): string {
    let content = `### 3.1 Summary of Proposals

${project.description}

### 3.2 Detailed Description

${project.description}
`;
    
    if (project.dimensions) {
      content += `
**Dimensions:**
${project.dimensions.width ? `- Width: ${project.dimensions.width}m` : ''}
${project.dimensions.depth ? `- Depth: ${project.dimensions.depth}m` : ''}
${project.dimensions.height ? `- Height: ${project.dimensions.height}m` : ''}
${project.dimensions.area ? `- Floor Area: ${project.dimensions.area}sqm` : ''}
`;
    }
    
    if (project.materials) {
      content += `
### 3.3 Materials

The following materials are proposed, selected to be sympathetic to the existing building and local character:

| Element | Proposed Material | Justification |
|---------|------------------|---------------|
${project.materials.walls ? `| External Walls | ${project.materials.walls} | To match/complement existing |` : ''}
${project.materials.roof ? `| Roofing | ${project.materials.roof} | Traditional appearance |` : ''}
${project.materials.windows ? `| Windows | ${project.materials.windows} | Conservation appropriate |` : ''}
${project.materials.doors ? `| Doors | ${project.materials.doors} | Sympathetic design |` : ''}
`;
    }
    
    if (project.designRationale) {
      content += `
### 3.4 Design Approach

${project.designRationale}
`;
    } else {
      content += `
### 3.4 Design Approach

The design has been developed with careful consideration of:
- The character and appearance of the existing building
- The contribution of the property to the wider streetscape
- The need to minimise impact on historic fabric
- The use of appropriate materials and detailing
- The relationship between old and new elements

The proposals adopt a [contemporary interpretation / traditional approach] that [complements / matches] the existing building while being clearly of its time.
`;
    }
    
    return content;
  }
  
  private generateImpactAssessment(property: PropertyContext, project: ProjectDetails): string {
    const isListedBuilding = property.heritageStatus === 'RED';
    const assetType = isListedBuilding ? 'listed building' : 'conservation area';
    
    let content = `### 4.1 Impact on Significance

The proposed works have been carefully designed to minimise impact on the significance of the ${assetType}. The assessment below considers impact on each aspect of significance:

**Impact on Evidential Value:** NEGLIGIBLE/LOW
The proposals do not affect the principal historic fabric of the building. The works are located [at the rear / in a secondary area] and are designed to be reversible.

**Impact on Historical Value:** NEGLIGIBLE
The proposals do not affect the building's ability to illustrate its historical associations or development.

**Impact on Aesthetic Value:** LOW/NEUTRAL
The proposals have been designed to [complement / not detract from] the aesthetic qualities of the building. High-quality materials and careful detailing will ensure that the new works are sympathetic.

**Impact on Communal Value:** NEGLIGIBLE
The proposals will not affect the building's contribution to local identity or sense of place.

### 4.2 Justification

Paragraph 206 of the NPPF requires that proposals which cause less than substantial harm to a designated heritage asset should be weighed against the public benefits.

The proposals are justified because:
1. The impact on heritage significance is minimal and has been carefully mitigated
2. The works will [improve the functionality / ensure the continued use] of the property
3. The proposals represent high-quality design that respects the heritage context
4. The works are [reversible / of a scale and nature that does not harm the asset]

### 4.3 Mitigation Measures

The following measures have been incorporated to minimise impact:
- Use of traditional/appropriate materials
- Careful junction details between old and new
- Retention of all significant historic features
- Positioning of new works in less sensitive locations
- Reversibility of key elements where possible

### 4.4 Public Benefits
${isListedBuilding ? `
The public benefits arising from the proposals include:
- Ensuring the continued residential use and maintenance of the listed building
- Enhancing the accommodation to meet modern living standards
- Contributing to the long-term preservation of the heritage asset
- Sustainable development within the existing building envelope
` : `
The proposals will:
- Preserve and enhance the character and appearance of the conservation area
- Maintain the viable use of the property
- Provide a model for high-quality development within the conservation area
`}`;
    
    return content;
  }
  
  private generatePolicyContext(property: PropertyContext): string {
    return `### 5.1 National Policy

The proposals have been assessed against the National Planning Policy Framework (NPPF), particularly:

**Paragraph 199:** When considering the impact of a proposed development on the significance of a designated heritage asset, great weight should be given to the asset's conservation.

**Paragraph 200:** Any harm to, or loss of, the significance of a designated heritage asset should require clear and convincing justification.

**Paragraph 206:** Where a development proposal will lead to less than substantial harm to the significance of a designated heritage asset, this harm should be weighed against the public benefits of the proposal.

### 5.2 Statutory Framework

The proposals comply with the duties set out in:
- Section 16 of the Planning (Listed Buildings and Conservation Areas) Act 1990 - to have special regard to the desirability of preserving listed buildings and their settings
- Section 72 of the Act - to pay special attention to the desirability of preserving or enhancing the character or appearance of conservation areas

### 5.3 Local Policy

${property.borough} Local Plan policies relevant to this application include:

${property.borough === 'Camden' ? `
- **Policy D2 (Heritage)**: Development should conserve or enhance heritage assets and their settings
- **Policy A1 (Managing the Impact of Development)**: Development should be of high-quality design
` : property.borough === 'Westminster' ? `
- **Policy 39 (Westminster's Heritage)**: Development should conserve and enhance heritage assets
- **Policy 38 (Design Principles)**: All development should achieve high standards of design
` : `
- Heritage protection policies requiring conservation of designated assets
- Design quality policies applicable to the conservation area
`}

### 5.4 Historic England Guidance

The proposals have been developed with reference to:
- Conservation Principles, Policies and Guidance (2008)
- Statements of Heritage Significance: Analysing Significance in Heritage Assets (2019)
- Making Changes to Heritage Assets (2016)
- The Setting of Heritage Assets (2017)`;
  }
  
  private generateHeritageConclusion(property: PropertyContext, project: ProjectDetails): string {
    const assetType = property.listedBuilding 
      ? `Grade ${property.listedBuilding.grade} listed building`
      : `${property.conservationArea?.name} Conservation Area`;
    
    return `This Heritage Impact Assessment has demonstrated that the proposed ${project.type} at ${property.address}:

1. **Preserves Significance**: The works have been designed to minimise impact on the special interest of the ${assetType}

2. **Uses Appropriate Materials**: All materials have been selected to be sympathetic to the historic character of the building and area

3. **Adopts High-Quality Design**: The proposals represent a well-considered response to the heritage context

4. **Complies with Policy**: The works accord with the requirements of the NPPF, relevant legislation, and local planning policies

5. **Delivers Public Benefits**: The proposals will ensure the continued viable use and maintenance of this heritage asset

**Assessment Conclusion**

Any impact on heritage significance is assessed as **negligible to low** and is clearly outweighed by the public benefits of the proposals.

It is therefore respectfully submitted that ${property.listedBuilding ? 'Listed Building Consent' : 'Planning Permission'} should be granted for the proposed works.

---

*This Heritage Impact Assessment has been prepared by [Consultant Name/Applicant]. All conclusions represent a good-faith assessment based on available information. For complex or controversial applications, consultation with the Local Planning Authority and/or Historic England is recommended.*`;
  }
  
  /**
   * Generate Design and Access Statement
   */
  private async generateDesignAccessStatement(
    property: PropertyContext,
    project: ProjectDetails,
    applicant: ApplicantDetails,
    options: DocumentOptions
  ): Promise<GeneratedDocument> {
    const sections: DocumentSection[] = [];
    let sectionOrder = 0;
    
    // Introduction
    sections.push({
      id: 'introduction',
      title: '1. Introduction',
      content: `This Design and Access Statement has been prepared to accompany an application for planning permission at **${property.address}**, **${property.postcode}**.

The application is for ${project.description}.

This statement explains the design principles and concepts that have been applied to the development and demonstrates how issues of access have been addressed, in accordance with Article 9 of the Town and Country Planning (Development Management Procedure) Order 2015.`,
      order: sectionOrder++,
      required: true,
    });
    
    // Context
    sections.push({
      id: 'context',
      title: '2. Site Context and Constraints',
      content: `### 2.1 Site Location

${property.address} is located in the London Borough of ${property.borough}, within the ${property.postcode} postcode area.

### 2.2 Existing Building

The property is a ${property.propertyType} ${property.architecturalStyle || ''} building${property.buildYear ? ` dating from approximately ${property.buildYear}` : ''}.

### 2.3 Planning Designations

${property.heritageStatus === 'RED' ? `- **Listed Building**: Grade ${property.listedBuilding?.grade}` : ''}
${property.conservationArea ? `- **Conservation Area**: ${property.conservationArea.name}` : ''}
${property.hasArticle4 ? '- **Article 4 Direction**: Applies' : ''}
${property.heritageStatus === 'GREEN' ? '- No heritage designations apply to this property' : ''}

### 2.4 Site Constraints

The following constraints have been identified and addressed in the design:
- Existing building footprint and plot boundaries
- Relationship with neighbouring properties
${property.heritageStatus !== 'GREEN' ? '- Heritage considerations and design sensitivities' : ''}
- Orientation and daylight/sunlight considerations`,
      order: sectionOrder++,
      required: true,
    });
    
    // Design
    sections.push({
      id: 'design',
      title: '3. Design Principles',
      content: `### 3.1 Amount and Layout

The proposals comprise ${project.description}.
${project.dimensions?.area ? `The proposed floor area is approximately ${project.dimensions.area} square metres.` : ''}

### 3.2 Scale

${project.dimensions ? `The proposed development has the following dimensions:
${project.dimensions.width ? `- Width: ${project.dimensions.width}m` : ''}
${project.dimensions.depth ? `- Depth: ${project.dimensions.depth}m` : ''}
${project.dimensions.height ? `- Height: ${project.dimensions.height}m` : ''}` : 'The scale of the proposals is appropriate to the existing building and plot.'}

The scale has been designed to:
- Remain subordinate to the original building
- Respect the established building heights in the area
- Avoid any overbearing impact on neighbouring properties

### 3.3 Appearance

${project.designRationale || 'The design adopts a contemporary interpretation that complements the existing building while being clearly of its time. The proportions, materials, and detailing have been carefully considered to ensure a high-quality outcome.'}

### 3.4 Materials

${project.materials ? `The following materials are proposed:
${project.materials.walls ? `- **Walls**: ${project.materials.walls}` : ''}
${project.materials.roof ? `- **Roof**: ${project.materials.roof}` : ''}
${project.materials.windows ? `- **Windows**: ${project.materials.windows}` : ''}
${project.materials.doors ? `- **Doors**: ${project.materials.doors}` : ''}` : 'Materials will be selected to complement the existing building and local character. Final specifications will be agreed with the Local Planning Authority.'}

### 3.5 Landscaping

The proposals include appropriate landscaping measures to ensure integration with the existing garden and maintain a high-quality external environment.`,
      order: sectionOrder++,
      required: true,
    });
    
    // Access
    sections.push({
      id: 'access',
      title: '4. Access',
      content: `### 4.1 Vehicular Access

The existing vehicular access arrangements will be retained. The proposals do not affect parking provision or vehicle movements.

### 4.2 Pedestrian Access

Pedestrian access to the property will be maintained via the existing front entrance. The proposals will not impede pedestrian movement.

### 4.3 Inclusive Access

The proposals have been designed with consideration of inclusive access:
- Level or gently ramped access where possible
- Door widths suitable for wheelchair access
- Consideration of Part M Building Regulations requirements`,
      order: sectionOrder++,
      required: true,
    });
    
    // Sustainability (optional)
    if (project.sustainabilityFeatures?.length) {
      sections.push({
        id: 'sustainability',
        title: '5. Sustainability',
        content: `The following sustainability measures are incorporated into the proposals:

${project.sustainabilityFeatures.map(f => `- ${f}`).join('\n')}

These measures contribute to reducing the environmental impact of the development and align with ${property.borough} Council's sustainability objectives.`,
        order: sectionOrder++,
        required: false,
      });
    }
    
    // Conclusion
    sections.push({
      id: 'conclusion',
      title: `${project.sustainabilityFeatures?.length ? '6' : '5'}. Conclusion`,
      content: `The proposals represent a well-designed ${project.type} that:

1. Respects the character of the existing building and surrounding area
2. Uses appropriate materials and high-quality design
3. Minimises impact on neighbouring properties
4. Provides accessible accommodation
${property.heritageStatus !== 'GREEN' ? '5. Preserves or enhances the heritage context' : ''}

Planning permission is respectfully requested.`,
      order: sectionOrder++,
      required: true,
    });
    
    const content = sections.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n---\n\n');
    
    return {
      id: `doc-${Date.now()}`,
      type: 'design_access_statement',
      title: `Design and Access Statement - ${property.address}`,
      content,
      sections,
      metadata: {
        wordCount: content.split(/\s+/).length,
        estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
        requiredForApplication: property.heritageStatus !== 'GREEN',
        typicalCostIfProfessional: { low: 300, high: 1200 },
        tips: [
          'Include site photos showing context',
          'Add annotated plans and elevations',
          'Show how the design responds to constraints',
          'Include 3D visualizations if available',
        ],
      },
      createdAt: new Date(),
    };
  }
  
  /**
   * Generate Neighbor Letter
   */
  private async generateNeighborLetter(
    property: PropertyContext,
    project: ProjectDetails,
    applicant: ApplicantDetails,
    options: DocumentOptions
  ): Promise<GeneratedDocument> {
    const date = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    
    const content = `${date}

Dear Neighbour,

**Re: Planned Building Works at ${property.address}**

I am writing to let you know about building works we are planning at our property, which neighbours yours.

## What We Are Planning

${project.description}

## Timing

We anticipate starting works in [insert timeframe] and expect them to take approximately [insert duration].

**Working Hours:**
- Monday to Friday: 8:00am - 6:00pm
- Saturday: 8:00am - 1:00pm
- No work on Sundays or Bank Holidays

## What This Means For You

${project.impactOnNeighbors || 'We have designed the project to minimise any impact on neighbouring properties. During construction, there may be some noise and deliveries, but we will do everything we can to keep disruption to a minimum.'}

## How to See Our Plans

${property.heritageStatus !== 'GREEN' 
  ? 'We will be submitting a planning application to the council shortly. Once submitted, you will be able to view the plans on the council\'s planning portal and make any comments.' 
  : 'Our plans are available under permitted development rules, but we would be happy to show them to you if you are interested.'}

## Contact

If you have any questions or concerns at any time during the project, please do not hesitate to contact us:

**${applicant.name}**
${applicant.email ? `Email: ${applicant.email}` : ''}
${applicant.phone ? `Phone: ${applicant.phone}` : ''}

We are committed to being good neighbours and will do everything we can to ensure the works proceed smoothly.

Yours sincerely,

${applicant.name}
${property.address}`;
    
    return {
      id: `doc-${Date.now()}`,
      type: 'neighbor_letter',
      title: `Neighbor Notification Letter - ${property.address}`,
      content,
      sections: [{
        id: 'letter',
        title: 'Neighbor Letter',
        content,
        order: 0,
        required: true,
      }],
      metadata: {
        wordCount: content.split(/\s+/).length,
        estimatedReadTime: 2,
        requiredForApplication: false,
        typicalCostIfProfessional: { low: 0, high: 100 },
        tips: [
          'Deliver by hand if possible for personal touch',
          'Include a photo or simple sketch of the proposals',
          'Offer to meet to discuss any concerns',
          'Keep a record of when letters were delivered',
        ],
      },
      createdAt: new Date(),
    };
  }
  
  /**
   * Generate Planning Statement
   */
  private async generatePlanningStatement(
    property: PropertyContext,
    project: ProjectDetails,
    applicant: ApplicantDetails,
    options: DocumentOptions
  ): Promise<GeneratedDocument> {
    // Similar structure to other documents
    const content = `# Planning Statement

## ${property.address}

### 1. Introduction

This Planning Statement has been prepared in support of an application for planning permission at ${property.address}.

### 2. Site Description

${property.address} is a ${property.propertyType} property located in ${property.borough}.

### 3. Proposal

${project.description}

### 4. Planning Policy Context

The application has been prepared with reference to national and local planning policies.

### 5. Planning Assessment

The proposals comply with relevant planning policies and will not have any significant adverse impacts.

### 6. Conclusion

Planning permission is respectfully requested.`;
    
    return {
      id: `doc-${Date.now()}`,
      type: 'planning_statement',
      title: `Planning Statement - ${property.address}`,
      content,
      sections: [],
      metadata: {
        wordCount: content.split(/\s+/).length,
        estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200),
        requiredForApplication: false,
        typicalCostIfProfessional: { low: 400, high: 1500 },
        tips: [],
      },
      createdAt: new Date(),
    };
  }
  
  /**
   * Generate Pre-Application Letter
   */
  private async generatePreApplicationLetter(
    property: PropertyContext,
    project: ProjectDetails,
    applicant: ApplicantDetails,
    options: DocumentOptions
  ): Promise<GeneratedDocument> {
    const date = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    
    const content = `${date}

Planning Department
${property.borough} Council

Dear Sir/Madam,

**Pre-Application Enquiry: ${property.address}, ${property.postcode}**

I am writing to request pre-application advice regarding a proposed ${project.type} at the above address.

## The Site

${property.address} is a ${property.propertyType} ${property.architecturalStyle || ''} property${property.buildYear ? ` dating from approximately ${property.buildYear}` : ''}.

${property.heritageStatus === 'RED' ? `The property is a Grade ${property.listedBuilding?.grade} listed building.` : ''}
${property.conservationArea ? `The property is located within the ${property.conservationArea.name} Conservation Area.` : ''}

## The Proposal

${project.description}

## Information Enclosed

Please find enclosed:
- Site location plan
- Block plan
- Sketch proposals
${property.heritageStatus !== 'GREEN' ? '- Brief heritage considerations' : ''}

## Questions for the Council

I would be grateful for your views on:
1. The acceptability of the proposal in principle
2. Any design guidance or policy considerations
3. The likely application type required
4. Any specific requirements for the formal application

## Fee

I enclose the pre-application fee of £[insert fee].

I look forward to hearing from you.

Yours faithfully,

${applicant.name}
${applicant.email || ''}
${applicant.phone || ''}`;
    
    return {
      id: `doc-${Date.now()}`,
      type: 'pre_application_letter',
      title: `Pre-Application Letter - ${property.address}`,
      content,
      sections: [],
      metadata: {
        wordCount: content.split(/\s+/).length,
        estimatedReadTime: 3,
        requiredForApplication: false,
        typicalCostIfProfessional: { low: 200, high: 500 },
        tips: [
          'Include clear, dimensioned sketch drawings',
          'Check the council website for current pre-app fees',
          'Ask specific questions to get useful feedback',
          'Consider a meeting rather than written advice for complex projects',
        ],
      },
      createdAt: new Date(),
    };
  }
  
  /**
   * Get available document types for a property
   */
  getAvailableDocuments(property: PropertyContext): DocumentType[] {
    const documents: DocumentType[] = ['neighbor_letter', 'pre_application_letter'];
    
    if (property.heritageStatus === 'RED') {
      documents.unshift('heritage_statement');
    }
    
    if (property.heritageStatus !== 'GREEN') {
      documents.push('design_access_statement');
    }
    
    documents.push('planning_statement');
    
    return documents;
  }
  
  /**
   * Get document description and requirements
   */
  getDocumentInfo(type: DocumentType): {
    name: string;
    description: string;
    whenRequired: string;
    typicalLength: string;
    professionalCost: { low: number; high: number };
  } {
    const info: Record<DocumentType, ReturnType<typeof this.getDocumentInfo>> = {
      heritage_statement: {
        name: 'Heritage Impact Assessment',
        description: 'Assesses the significance of a heritage asset and the impact of proposed works',
        whenRequired: 'Required for listed buildings and usually expected for conservation area applications',
        typicalLength: '2,000 - 5,000 words',
        professionalCost: { low: 800, high: 2500 },
      },
      design_access_statement: {
        name: 'Design and Access Statement',
        description: 'Explains the design principles and access arrangements for a development',
        whenRequired: 'Required for most applications in conservation areas and for larger developments',
        typicalLength: '1,000 - 3,000 words',
        professionalCost: { low: 300, high: 1200 },
      },
      planning_statement: {
        name: 'Planning Statement',
        description: 'Sets out the planning policy context and justification for a development',
        whenRequired: 'Recommended for complex applications or where policy compliance needs demonstration',
        typicalLength: '1,500 - 4,000 words',
        professionalCost: { low: 400, high: 1500 },
      },
      neighbor_letter: {
        name: 'Neighbor Notification Letter',
        description: 'Informing neighbors about planned works as a courtesy',
        whenRequired: 'Not legally required but strongly recommended for good neighbor relations',
        typicalLength: '300 - 500 words',
        professionalCost: { low: 0, high: 100 },
      },
      party_wall_notice: {
        name: 'Party Wall Notice',
        description: 'Formal notice required under the Party Wall etc. Act 1996',
        whenRequired: 'Required when works affect a shared boundary or are within 3-6m of a neighbor',
        typicalLength: 'Standard form',
        professionalCost: { low: 100, high: 300 },
      },
      pre_application_letter: {
        name: 'Pre-Application Enquiry Letter',
        description: 'Request for informal planning advice before submitting an application',
        whenRequired: 'Recommended for heritage properties or unusual/complex proposals',
        typicalLength: '500 - 1,000 words',
        professionalCost: { low: 200, high: 500 },
      },
    };
    
    return info[type];
  }
}

// Export singleton
export const documentGenerator = new DocumentGeneratorService();
