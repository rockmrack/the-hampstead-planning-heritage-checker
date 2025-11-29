/**
 * Document Management Service
 * 
 * Handles document storage and management for planning applications:
 * - Upload and store documents
 * - Document categorization
 * - Version control
 * - Document templates
 * - Sharing and access control
 */

// Types
export interface Document {
  id: string;
  userId: string;
  propertyId?: string;
  applicationId?: string;
  name: string;
  originalName: string;
  description?: string;
  category: DocumentCategory;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  version: number;
  previousVersionId?: string;
  tags: string[];
  metadata: DocumentMetadata;
  status: 'draft' | 'final' | 'submitted' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export type DocumentCategory =
  | 'planning_application'
  | 'drawings'
  | 'structural_report'
  | 'heritage_statement'
  | 'design_access_statement'
  | 'tree_survey'
  | 'flood_risk'
  | 'construction_management'
  | 'neighbor_consultation'
  | 'photos'
  | 'decision_notice'
  | 'appeal_documents'
  | 'correspondence'
  | 'contracts'
  | 'invoices'
  | 'other';

export interface DocumentMetadata {
  author?: string;
  company?: string;
  dateCreated?: Date;
  pageCount?: number;
  dimensions?: {
    width: number;
    height: number;
    unit: 'mm' | 'cm' | 'inches';
  };
  scale?: string;
  drawingNumber?: string;
  revision?: string;
  isConfidential?: boolean;
  expirationDate?: Date;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  templateUrl: string;
  instructions: string[];
  requiredFields: string[];
  examples?: string[];
}

export interface DocumentFolder {
  id: string;
  userId: string;
  name: string;
  parentId?: string;
  color?: string;
  icon?: string;
  documentCount: number;
  createdAt: Date;
}

export interface DocumentSearchParams {
  userId?: string;
  propertyId?: string;
  applicationId?: string;
  category?: DocumentCategory;
  status?: Document['status'];
  query?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'name' | 'date' | 'size' | 'category';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Document templates for common planning documents
const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'template-planning-app',
    name: 'Planning Application Form',
    description: 'Standard planning application form for Camden Council',
    category: 'planning_application',
    templateUrl: '/templates/planning-application.pdf',
    instructions: [
      'Complete all sections in black ink or digitally',
      'Include your full name and address',
      'Describe the proposed development clearly',
      'Include site area and floor space calculations',
      'Sign and date the declaration'
    ],
    requiredFields: [
      'Applicant name and address',
      'Site address',
      'Description of development',
      'Site area',
      'Existing and proposed floor space'
    ],
  },
  {
    id: 'template-heritage-statement',
    name: 'Heritage Statement Template',
    description: 'Template for heritage impact assessment in conservation areas',
    category: 'heritage_statement',
    templateUrl: '/templates/heritage-statement.docx',
    instructions: [
      'Describe the significance of the heritage asset',
      'Explain how the proposals preserve or enhance character',
      'Include historical research and photographs',
      'Address any potential harmful impacts',
      'Propose mitigation measures'
    ],
    requiredFields: [
      'Site history and significance',
      'Character assessment',
      'Impact analysis',
      'Justification',
      'Mitigation measures'
    ],
    examples: [
      'Example heritage statement for Victorian terrace extension',
      'Example heritage statement for shopfront alteration'
    ],
  },
  {
    id: 'template-design-access',
    name: 'Design & Access Statement',
    description: 'Template for design and access statements',
    category: 'design_access_statement',
    templateUrl: '/templates/design-access-statement.docx',
    instructions: [
      'Explain the design concept and rationale',
      'Describe how the design responds to context',
      'Detail accessibility provisions',
      'Include sketches and precedent images',
      'Address sustainability measures'
    ],
    requiredFields: [
      'Site context analysis',
      'Design principles',
      'Materials and finishes',
      'Access arrangements',
      'Landscaping'
    ],
  },
  {
    id: 'template-cmp',
    name: 'Construction Management Plan',
    description: 'Template for construction management plans',
    category: 'construction_management',
    templateUrl: '/templates/construction-management-plan.docx',
    instructions: [
      'Detail working hours and methodology',
      'Explain traffic management arrangements',
      'Address noise and dust mitigation',
      'Include emergency contact information',
      'Show site compound and storage areas'
    ],
    requiredFields: [
      'Working hours',
      'Delivery schedule',
      'Traffic management',
      'Noise mitigation',
      'Dust control',
      'Emergency contacts'
    ],
  },
  {
    id: 'template-neighbor-letter',
    name: 'Neighbor Notification Letter',
    description: 'Template for notifying neighbors about your proposal',
    category: 'neighbor_consultation',
    templateUrl: '/templates/neighbor-letter.docx',
    instructions: [
      'Introduce yourself and your property',
      'Briefly describe the proposed works',
      'Explain the timeline',
      'Invite comments or questions',
      'Provide contact details'
    ],
    requiredFields: [
      'Your contact details',
      'Project description',
      'Expected timeline',
      'How to respond'
    ],
  },
];

// Sample documents for demonstration
const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    userId: 'user-1',
    propertyId: 'prop-1',
    applicationId: 'app-1',
    name: 'Proposed Ground Floor Plan',
    originalName: 'ground-floor-plan-rev-c.pdf',
    description: 'Ground floor plan showing proposed rear extension',
    category: 'drawings',
    mimeType: 'application/pdf',
    size: 2450000,
    url: '/documents/doc-1.pdf',
    thumbnailUrl: '/documents/doc-1-thumb.png',
    version: 3,
    previousVersionId: 'doc-1-v2',
    tags: ['ground floor', 'extension', 'planning'],
    metadata: {
      author: 'Smith & Jones Architects',
      company: 'Smith & Jones Architects Ltd',
      pageCount: 1,
      scale: '1:50',
      drawingNumber: 'PA-001',
      revision: 'C',
    },
    status: 'submitted',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'doc-2',
    userId: 'user-1',
    propertyId: 'prop-1',
    applicationId: 'app-1',
    name: 'Heritage Statement',
    originalName: 'heritage-statement-final.pdf',
    description: 'Heritage impact assessment for conservation area property',
    category: 'heritage_statement',
    mimeType: 'application/pdf',
    size: 1850000,
    url: '/documents/doc-2.pdf',
    version: 1,
    tags: ['heritage', 'conservation area', 'hampstead'],
    metadata: {
      author: 'Heritage Consultants Ltd',
      company: 'Heritage Consultants Ltd',
      pageCount: 15,
    },
    status: 'submitted',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
];

// Document Management Service Implementation
class DocumentManagementService {
  private documents: Map<string, Document> = new Map();
  private folders: Map<string, DocumentFolder> = new Map();

  constructor() {
    // Initialize with sample data
    SAMPLE_DOCUMENTS.forEach(doc => this.documents.set(doc.id, doc));
  }

  /**
   * Upload a new document (simulated)
   */
  async uploadDocument(data: {
    userId: string;
    propertyId?: string;
    applicationId?: string;
    name: string;
    originalName: string;
    description?: string;
    category: DocumentCategory;
    mimeType: string;
    size: number;
    tags?: string[];
    metadata?: DocumentMetadata;
  }): Promise<Document> {
    const now = new Date();
    const docId = `doc-${Date.now()}`;
    
    const document: Document = {
      id: docId,
      userId: data.userId,
      propertyId: data.propertyId,
      applicationId: data.applicationId,
      name: data.name,
      originalName: data.originalName,
      description: data.description,
      category: data.category,
      mimeType: data.mimeType,
      size: data.size,
      url: `/documents/${docId}`,
      version: 1,
      tags: data.tags || [],
      metadata: data.metadata || {},
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    this.documents.set(docId, document);
    return document;
  }

  /**
   * Get a document by ID
   */
  async getDocument(documentId: string): Promise<Document | null> {
    return this.documents.get(documentId) || null;
  }

  /**
   * Update document metadata
   */
  async updateDocument(
    documentId: string,
    updates: Partial<Pick<Document, 'name' | 'description' | 'category' | 'tags' | 'metadata' | 'status'>>
  ): Promise<Document | null> {
    const doc = this.documents.get(documentId);
    if (!doc) return null;

    const updated: Document = {
      ...doc,
      ...updates,
      updatedAt: new Date(),
    };

    this.documents.set(documentId, updated);
    return updated;
  }

  /**
   * Create a new version of a document
   */
  async createVersion(
    documentId: string,
    newData: {
      name?: string;
      description?: string;
      mimeType: string;
      size: number;
      metadata?: DocumentMetadata;
    }
  ): Promise<Document | null> {
    const original = this.documents.get(documentId);
    if (!original) return null;

    const now = new Date();
    const newDocId = `doc-${Date.now()}`;

    const newVersion: Document = {
      ...original,
      id: newDocId,
      name: newData.name || original.name,
      description: newData.description || original.description,
      mimeType: newData.mimeType,
      size: newData.size,
      url: `/documents/${newDocId}`,
      version: original.version + 1,
      previousVersionId: original.id,
      metadata: { ...original.metadata, ...newData.metadata },
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    this.documents.set(newDocId, newVersion);
    return newVersion;
  }

  /**
   * Search documents
   */
  async searchDocuments(params: DocumentSearchParams): Promise<{
    documents: Document[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let filtered = Array.from(this.documents.values());

    // Apply filters
    if (params.userId) {
      filtered = filtered.filter(d => d.userId === params.userId);
    }
    if (params.propertyId) {
      filtered = filtered.filter(d => d.propertyId === params.propertyId);
    }
    if (params.applicationId) {
      filtered = filtered.filter(d => d.applicationId === params.applicationId);
    }
    if (params.category) {
      filtered = filtered.filter(d => d.category === params.category);
    }
    if (params.status) {
      filtered = filtered.filter(d => d.status === params.status);
    }
    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query) ||
        d.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    if (params.tags && params.tags.length > 0) {
      filtered = filtered.filter(d =>
        params.tags!.some(tag => d.tags.includes(tag))
      );
    }
    if (params.dateFrom) {
      filtered = filtered.filter(d => d.createdAt >= params.dateFrom!);
    }
    if (params.dateTo) {
      filtered = filtered.filter(d => d.createdAt <= params.dateTo!);
    }

    // Sort
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;
    switch (params.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name) * sortOrder);
        break;
      case 'size':
        filtered.sort((a, b) => (a.size - b.size) * sortOrder);
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category) * sortOrder);
        break;
      case 'date':
      default:
        filtered.sort((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()) * sortOrder);
    }

    // Paginate
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      documents: paginated,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    return this.documents.delete(documentId);
  }

  /**
   * Get document templates
   */
  async getTemplates(category?: DocumentCategory): Promise<DocumentTemplate[]> {
    if (category) {
      return DOCUMENT_TEMPLATES.filter(t => t.category === category);
    }
    return DOCUMENT_TEMPLATES;
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string): Promise<DocumentTemplate | null> {
    return DOCUMENT_TEMPLATES.find(t => t.id === templateId) || null;
  }

  /**
   * Get documents for an application
   */
  async getApplicationDocuments(applicationId: string): Promise<{
    documents: Document[];
    byCategory: Record<DocumentCategory, Document[]>;
    missingCategories: DocumentCategory[];
  }> {
    const docs = Array.from(this.documents.values())
      .filter(d => d.applicationId === applicationId);

    const byCategory: Partial<Record<DocumentCategory, Document[]>> = {};
    for (const doc of docs) {
      if (!byCategory[doc.category]) {
        byCategory[doc.category] = [];
      }
      byCategory[doc.category]!.push(doc);
    }

    // Required document categories for a typical planning application
    const requiredCategories: DocumentCategory[] = [
      'planning_application',
      'drawings',
      'design_access_statement',
    ];

    const existingCategories = Object.keys(byCategory) as DocumentCategory[];
    const missingCategories = requiredCategories.filter(
      cat => !existingCategories.includes(cat)
    );

    return {
      documents: docs,
      byCategory: byCategory as Record<DocumentCategory, Document[]>,
      missingCategories,
    };
  }

  /**
   * Get version history for a document
   */
  async getVersionHistory(documentId: string): Promise<Document[]> {
    const versions: Document[] = [];
    let currentId: string | undefined = documentId;

    while (currentId) {
      const doc = this.documents.get(currentId);
      if (doc) {
        versions.push(doc);
        currentId = doc.previousVersionId;
      } else {
        break;
      }
    }

    return versions;
  }

  /**
   * Create a folder
   */
  async createFolder(data: {
    userId: string;
    name: string;
    parentId?: string;
    color?: string;
    icon?: string;
  }): Promise<DocumentFolder> {
    const folder: DocumentFolder = {
      id: `folder-${Date.now()}`,
      userId: data.userId,
      name: data.name,
      parentId: data.parentId,
      color: data.color,
      icon: data.icon,
      documentCount: 0,
      createdAt: new Date(),
    };

    this.folders.set(folder.id, folder);
    return folder;
  }

  /**
   * Get folders for a user
   */
  async getUserFolders(userId: string): Promise<DocumentFolder[]> {
    return Array.from(this.folders.values())
      .filter(f => f.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get document statistics for a user
   */
  async getUserDocumentStats(userId: string): Promise<{
    totalDocuments: number;
    totalSize: number;
    byCategory: { category: DocumentCategory; count: number; size: number }[];
    byStatus: { status: Document['status']; count: number }[];
    recentDocuments: Document[];
  }> {
    const userDocs = Array.from(this.documents.values())
      .filter(d => d.userId === userId);

    const categoryMap = new Map<DocumentCategory, { count: number; size: number }>();
    const statusMap = new Map<Document['status'], number>();

    for (const doc of userDocs) {
      // By category
      const catData = categoryMap.get(doc.category) || { count: 0, size: 0 };
      catData.count += 1;
      catData.size += doc.size;
      categoryMap.set(doc.category, catData);

      // By status
      statusMap.set(doc.status, (statusMap.get(doc.status) || 0) + 1);
    }

    const recentDocuments = [...userDocs]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);

    return {
      totalDocuments: userDocs.length,
      totalSize: userDocs.reduce((sum, d) => sum + d.size, 0),
      byCategory: Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        count: data.count,
        size: data.size,
      })),
      byStatus: Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count,
      })),
      recentDocuments,
    };
  }

  /**
   * Get category information
   */
  getCategoryInfo(category: DocumentCategory): {
    name: string;
    description: string;
    icon: string;
    acceptedFormats: string[];
  } {
    const categories: Record<DocumentCategory, { name: string; description: string; icon: string; acceptedFormats: string[] }> = {
      planning_application: {
        name: 'Planning Application Forms',
        description: 'Application forms and certificates',
        icon: '📋',
        acceptedFormats: ['pdf'],
      },
      drawings: {
        name: 'Drawings & Plans',
        description: 'Architectural drawings and site plans',
        icon: '📐',
        acceptedFormats: ['pdf', 'dwg', 'dxf'],
      },
      structural_report: {
        name: 'Structural Reports',
        description: 'Structural engineering reports and calculations',
        icon: '🏗️',
        acceptedFormats: ['pdf'],
      },
      heritage_statement: {
        name: 'Heritage Statements',
        description: 'Heritage impact assessments',
        icon: '🏛️',
        acceptedFormats: ['pdf', 'docx'],
      },
      design_access_statement: {
        name: 'Design & Access Statements',
        description: 'Design rationale and accessibility',
        icon: '✏️',
        acceptedFormats: ['pdf', 'docx'],
      },
      tree_survey: {
        name: 'Tree Surveys',
        description: 'Arboricultural reports and tree surveys',
        icon: '🌳',
        acceptedFormats: ['pdf'],
      },
      flood_risk: {
        name: 'Flood Risk Assessments',
        description: 'Flood risk and drainage assessments',
        icon: '💧',
        acceptedFormats: ['pdf'],
      },
      construction_management: {
        name: 'Construction Management Plans',
        description: 'Construction methodology and management',
        icon: '🚧',
        acceptedFormats: ['pdf', 'docx'],
      },
      neighbor_consultation: {
        name: 'Neighbor Consultation',
        description: 'Neighbor notification letters and responses',
        icon: '📬',
        acceptedFormats: ['pdf', 'docx'],
      },
      photos: {
        name: 'Photographs',
        description: 'Site and property photographs',
        icon: '📷',
        acceptedFormats: ['jpg', 'jpeg', 'png'],
      },
      decision_notice: {
        name: 'Decision Notices',
        description: 'Planning decisions and conditions',
        icon: '📜',
        acceptedFormats: ['pdf'],
      },
      appeal_documents: {
        name: 'Appeal Documents',
        description: 'Planning appeal submissions',
        icon: '⚖️',
        acceptedFormats: ['pdf', 'docx'],
      },
      correspondence: {
        name: 'Correspondence',
        description: 'Letters and emails with council',
        icon: '✉️',
        acceptedFormats: ['pdf', 'docx', 'eml'],
      },
      contracts: {
        name: 'Contracts',
        description: 'Building contracts and agreements',
        icon: '📄',
        acceptedFormats: ['pdf', 'docx'],
      },
      invoices: {
        name: 'Invoices & Receipts',
        description: 'Financial documents',
        icon: '🧾',
        acceptedFormats: ['pdf'],
      },
      other: {
        name: 'Other Documents',
        description: 'Miscellaneous documents',
        icon: '📁',
        acceptedFormats: ['pdf', 'docx', 'xlsx', 'jpg', 'png'],
      },
    };

    return categories[category];
  }

  /**
   * Get all categories
   */
  getAllCategories(): { category: DocumentCategory; info: { name: string; description: string; icon: string; acceptedFormats: string[] } }[] {
    const categories: DocumentCategory[] = [
      'planning_application', 'drawings', 'structural_report', 'heritage_statement',
      'design_access_statement', 'tree_survey', 'flood_risk', 'construction_management',
      'neighbor_consultation', 'photos', 'decision_notice', 'appeal_documents',
      'correspondence', 'contracts', 'invoices', 'other'
    ];

    return categories.map(cat => ({
      category: cat,
      info: this.getCategoryInfo(cat),
    }));
  }
}

// Export singleton instance
export const documentManagementService = new DocumentManagementService();
