/**
 * Tests for 100X Improvement Services
 * 
 * Tests the new transformative features:
 * - Document Generator
 * - Application Tracker
 * - Professional Marketplace
 * - Cost Estimator
 */

import { describe, test, expect } from '@jest/globals';
import { documentGenerator } from '@/lib/services/document-generator';
import { applicationTracker } from '@/lib/services/real-time-tracker';
import { professionalMarketplace } from '@/lib/services/professional-marketplace';
import { costEstimator } from '@/lib/services/cost-estimator';

describe('Document Generator Service', () => {
  const sampleProperty = {
    address: '123 Heath Street, Hampstead',
    postcode: 'NW3 1QQ',
    borough: 'Camden',
    heritageStatus: 'AMBER' as const,
    listedBuilding: null,
    conservationArea: {
      id: 1,
      name: 'Hampstead Conservation Area',
      borough: 'Camden',
      hasArticle4: true,
      characterAppraisal: 'Historic village character',
    },
    hasArticle4: true,
    propertyType: 'terraced' as const,
    buildYear: 1890,
    architecturalStyle: 'Victorian',
  };
  
  const sampleProject = {
    type: 'rear_extension',
    description: 'Single storey rear extension with glazed roof',
    dimensions: { width: 4, depth: 5, height: 3, area: 20 },
    materials: {
      walls: 'London stock brick to match existing',
      roof: 'Zinc standing seam with glazed panels',
      windows: 'Powder-coated aluminium, heritage grey',
    },
    designRationale: 'Contemporary design that respects the Victorian character',
  };
  
  const sampleApplicant = {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '020 7123 4567',
    isOwner: true,
  };

  test('should generate heritage statement', async () => {
    const document = await documentGenerator.generateDocument({
      type: 'heritage_statement',
      property: sampleProperty,
      project: sampleProject,
      applicant: sampleApplicant,
    });
    
    expect(document.type).toBe('heritage_statement');
    expect(document.title).toContain('Heritage Impact Assessment');
    expect(document.content).toContain('Hampstead Conservation Area');
    expect(document.sections.length).toBeGreaterThan(0);
    expect(document.metadata.wordCount).toBeGreaterThan(500);
  });

  test('should generate design and access statement', async () => {
    const document = await documentGenerator.generateDocument({
      type: 'design_access_statement',
      property: sampleProperty,
      project: sampleProject,
      applicant: sampleApplicant,
    });
    
    expect(document.type).toBe('design_access_statement');
    expect(document.content).toContain('Design');
    expect(document.content).toContain('Access');
    expect(document.sections.some(s => s.title.includes('Context'))).toBe(true);
  });

  test('should generate neighbor letter', async () => {
    const document = await documentGenerator.generateDocument({
      type: 'neighbor_letter',
      property: sampleProperty,
      project: sampleProject,
      applicant: sampleApplicant,
    });
    
    expect(document.type).toBe('neighbor_letter');
    expect(document.content).toContain('Dear Neighbour');
    expect(document.content).toContain(sampleApplicant.name);
    expect(document.content).toContain(sampleProperty.address);
  });

  test('should get available document types based on heritage status', () => {
    const redDocs = documentGenerator.getAvailableDocuments({
      ...sampleProperty,
      heritageStatus: 'RED',
      listedBuilding: { id: 1, name: 'Test', grade: 'II', listEntryNumber: '12345', location: { type: 'Point', coordinates: [-0.178, 51.554] }, hyperlink: 'https://historicengland.org.uk' },
    });
    
    expect(redDocs).toContain('heritage_statement');
    
    const greenDocs = documentGenerator.getAvailableDocuments({
      ...sampleProperty,
      heritageStatus: 'GREEN',
      conservationArea: null,
      hasArticle4: false,
    });
    
    expect(greenDocs).not.toContain('heritage_statement');
    expect(greenDocs).toContain('neighbor_letter');
  });

  test('should get document info with cost estimates', () => {
    const info = documentGenerator.getDocumentInfo('heritage_statement');
    
    expect(info.name).toBe('Heritage Impact Assessment');
    expect(info.professionalCost.low).toBeGreaterThan(0);
    expect(info.professionalCost.high).toBeGreaterThan(info.professionalCost.low);
  });
});

describe('Application Tracker Service', () => {
  test('should create tracked application', () => {
    const app = applicationTracker.createApplication({
      reference: 'TEST/2024/0001',
      address: '456 Flask Walk, Hampstead',
      postcode: 'NW3 1HH',
      description: 'Rear extension',
      applicationType: 'householder',
      submittedDate: new Date(),
      borough: 'Camden',
      ward: 'Hampstead Town',
      userId: 'user-123',
    });
    
    expect(app.id).toBeDefined();
    expect(app.reference).toBe('TEST/2024/0001');
    expect(app.status).toBe('submitted');
    expect(app.milestones.length).toBeGreaterThan(0);
    expect(app.milestones[0]?.status).toBe('completed'); // Submission
  });

  test('should update application status', () => {
    const app = applicationTracker.createApplication({
      reference: 'TEST/2024/0002',
      address: '789 High Street',
      postcode: 'NW3 1AA',
      description: 'Loft conversion',
      applicationType: 'householder',
      submittedDate: new Date(),
      borough: 'Camden',
      ward: 'Hampstead Town',
      userId: 'user-123',
    });
    
    const updated = applicationTracker.updateStatus(app.id, 'validated', 'All documents accepted');
    
    expect(updated?.status).toBe('validated');
    expect(updated?.validatedDate).toBeDefined();
    expect(updated?.alerts.some(a => a.type === 'status_change')).toBe(true);
  });

  test('should calculate timeline', () => {
    const app = applicationTracker.createApplication({
      reference: 'TEST/2024/0003',
      address: '101 Belsize Lane',
      postcode: 'NW3 5BB',
      description: 'Extension',
      applicationType: 'householder',
      submittedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      borough: 'Camden',
      ward: 'Belsize',
      userId: 'user-456',
    });
    
    const timeline = applicationTracker.getTimeline(app.id);
    
    expect(timeline).toBeDefined();
    expect(timeline?.totalDays).toBe(56); // 8 weeks for householder
    expect(timeline?.elapsedDays).toBeGreaterThanOrEqual(14);
    expect(timeline?.stages.length).toBeGreaterThan(0);
  });

  test('should log communications', () => {
    const app = applicationTracker.createApplication({
      reference: 'TEST/2024/0004',
      address: '202 England Lane',
      postcode: 'NW3 4DD',
      description: 'Renovation',
      applicationType: 'householder',
      submittedDate: new Date(),
      borough: 'Camden',
      ward: 'Hampstead Town',
      userId: 'user-789',
    });
    
    const updated = applicationTracker.logCommunication(app.id, {
      type: 'email',
      direction: 'incoming',
      date: new Date(),
      summary: 'Additional information requested',
      actionRequired: true,
      actionDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    
    expect(updated?.communications.length).toBe(1);
    expect(updated?.alerts.some(a => a.type === 'action_required')).toBe(true);
  });

  test('should calculate user stats', () => {
    const stats = applicationTracker.getUserStats('user-123');
    
    expect(stats.totalApplications).toBeGreaterThanOrEqual(0);
    expect(stats.byStatus).toBeDefined();
    expect(typeof stats.approvalRate).toBe('number');
  });
});

describe('Professional Marketplace Service', () => {
  test('should search for professionals by type', () => {
    const results = professionalMarketplace.search({
      type: 'architect',
    });
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.professional.type).toBe('architect');
    expect(results[0]?.matchScore).toBeGreaterThan(0);
  });

  test('should search for heritage specialists', () => {
    const results = professionalMarketplace.search({
      heritageSpecialist: true,
    });
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.matchReasons.some(r => r.toLowerCase().includes('heritage'))).toBe(true);
  });

  test('should filter by postcode coverage', () => {
    const results = professionalMarketplace.search({
      postcode: 'NW3 1AA',
    });
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(result => {
      expect(result.professional.coverageAreas.some(area => 
        'NW3'.startsWith(area) || area === 'Camden'
      )).toBe(true);
    });
  });

  test('should sort by rating', () => {
    const results = professionalMarketplace.search({
      sortBy: 'rating',
    });
    
    for (let i = 1; i < results.length; i++) {
      const prev = results[i - 1];
      const curr = results[i];
      if (prev && curr) {
        expect(prev.professional.ratings.overall)
          .toBeGreaterThanOrEqual(curr.professional.ratings.overall);
      }
    }
  });

  test('should get featured professionals', () => {
    const featured = professionalMarketplace.getFeatured(3);
    
    expect(featured.length).toBeLessThanOrEqual(3);
    featured.forEach(prof => {
      expect(['elite', 'premium']).toContain(prof.verification.level);
    });
  });

  test('should get recommendations for a project', () => {
    const recommendations = professionalMarketplace.getRecommendationsForProject({
      projectType: 'loft conversion',
      postcode: 'NW3 1AA',
      heritageStatus: 'AMBER',
    });
    
    expect(recommendations.architects.length).toBeGreaterThanOrEqual(0);
    expect(recommendations.builders.length).toBeGreaterThanOrEqual(0);
    expect(recommendations.consultants.length).toBeGreaterThanOrEqual(0);
  });

  test('should submit quote request', () => {
    const request = professionalMarketplace.submitQuoteRequest({
      clientName: 'Test User',
      clientEmail: 'test@example.com',
      address: '123 Test Street',
      postcode: 'NW3 1AA',
      projectType: 'extension',
      projectDescription: 'Single storey rear extension',
      selectedProfessionals: ['prof-001', 'prof-002'],
    });
    
    expect(request.id).toBeDefined();
    expect(request.status).toBe('pending');
    expect(request.responses.length).toBe(2);
  });

  test('should get professional types with counts', () => {
    const types = professionalMarketplace.getProfessionalTypes();
    
    expect(types.length).toBeGreaterThan(0);
    types.forEach(type => {
      expect(type.type).toBeDefined();
      expect(type.label).toBeDefined();
      expect(type.count).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Cost Estimator Service', () => {
  test('should generate detailed estimate for extension', () => {
    const estimate = costEstimator.generateEstimate({
      projectCategory: 'rear_extension',
      dimensions: { area: 25 },
      finishLevel: 'standard',
      heritageStatus: 'GREEN',
      postcode: 'NW3 1AA',
    });
    
    expect(estimate.id).toBeDefined();
    expect(estimate.summary.totalMid).toBeGreaterThan(0);
    expect(estimate.summary.pricePerSqm.mid).toBeGreaterThan(0);
    expect(estimate.breakdown.construction.superstructure).toBeDefined();
    expect(estimate.timeline.phases.length).toBeGreaterThan(0);
  });

  test('should apply heritage multiplier for listed buildings', () => {
    const greenEstimate = costEstimator.generateEstimate({
      projectCategory: 'rear_extension',
      dimensions: { area: 20 },
      finishLevel: 'standard',
      heritageStatus: 'GREEN',
      postcode: 'NW3 1AA',
    });
    
    const redEstimate = costEstimator.generateEstimate({
      projectCategory: 'rear_extension',
      dimensions: { area: 20 },
      finishLevel: 'standard',
      heritageStatus: 'RED',
      postcode: 'NW3 1AA',
    });
    
    expect(redEstimate.summary.totalMid).toBeGreaterThan(greenEstimate.summary.totalMid);
    expect(redEstimate.heritageFactors.additionalCostPercentage).toBeGreaterThan(0);
    expect(redEstimate.heritageFactors.requirements.length).toBeGreaterThan(0);
  });

  test('should apply area-specific multiplier', () => {
    const hampsteadEstimate = costEstimator.generateEstimate({
      projectCategory: 'loft_conversion',
      dimensions: { area: 30 },
      finishLevel: 'standard',
      heritageStatus: 'GREEN',
      postcode: 'NW3 1AA', // Hampstead - premium area
    });
    
    const cricklewood = costEstimator.generateEstimate({
      projectCategory: 'loft_conversion',
      dimensions: { area: 30 },
      finishLevel: 'standard',
      heritageStatus: 'GREEN',
      postcode: 'NW2 1AA', // Cricklewood - lower multiplier
    });
    
    expect(hampsteadEstimate.summary.totalMid).toBeGreaterThan(cricklewood.summary.totalMid);
  });

  test('should include professional fees', () => {
    const estimate = costEstimator.generateEstimate({
      projectCategory: 'basement',
      dimensions: { area: 50 },
      finishLevel: 'premium',
      heritageStatus: 'GREEN',
      postcode: 'NW3 1AA',
    });
    
    expect(estimate.breakdown.professionalFees.architect).toBeDefined();
    expect(estimate.breakdown.professionalFees.architect.midEstimate).toBeGreaterThan(0);
  });

  test('should assess risks', () => {
    const estimate = costEstimator.generateEstimate({
      projectCategory: 'basement',
      dimensions: { area: 40 },
      finishLevel: 'standard',
      heritageStatus: 'RED',
      existingCondition: 'poor',
      postcode: 'NW3 1AA',
    });
    
    expect(estimate.risks.length).toBeGreaterThan(0);
    expect(estimate.risks.some(r => r.category === 'Heritage')).toBe(true);
    expect(estimate.risks.some(r => r.category === 'Structural')).toBe(true);
  });

  test('should provide market comparison', () => {
    const estimate = costEstimator.generateEstimate({
      projectCategory: 'rear_extension',
      dimensions: { area: 25 },
      finishLevel: 'standard',
      heritageStatus: 'GREEN',
      postcode: 'NW3 1AA',
    });
    
    expect(estimate.comparisons.localAverage).toBeGreaterThan(0);
    expect(estimate.comparisons.londonAverage).toBeGreaterThan(0);
    expect(estimate.comparisons.nationalAverage).toBeGreaterThan(0);
    expect(estimate.comparisons.percentileRank).toBeGreaterThan(0);
  });

  test('should generate quick estimate', () => {
    const quickEstimate = costEstimator.getQuickEstimate({
      projectCategory: 'loft_conversion',
      area: 25,
      finishLevel: 'premium',
      postcode: 'NW3',
      heritageStatus: 'AMBER',
    });
    
    expect(quickEstimate.low).toBeGreaterThan(0);
    expect(quickEstimate.mid).toBeGreaterThan(quickEstimate.low);
    expect(quickEstimate.high).toBeGreaterThan(quickEstimate.mid);
  });

  test('should generate recommendations', () => {
    const estimate = costEstimator.generateEstimate({
      projectCategory: 'loft_conversion',
      dimensions: { area: 30 },
      finishLevel: 'luxury',
      heritageStatus: 'AMBER',
      postcode: 'NW3 1AA',
    });
    
    expect(estimate.recommendations.length).toBeGreaterThan(0);
    expect(estimate.recommendations.some(r => r.includes('heritage') || r.includes('conservation'))).toBe(true);
  });

  test('should calculate confidence level', () => {
    const simpleEstimate = costEstimator.generateEstimate({
      projectCategory: 'rear_extension',
      dimensions: { area: 20, height: 3 },
      finishLevel: 'standard',
      heritageStatus: 'GREEN',
      existingCondition: 'good',
      postcode: 'NW3 1AA',
    });
    
    const complexEstimate = costEstimator.generateEstimate({
      projectCategory: 'basement',
      dimensions: { area: 50 },
      finishLevel: 'luxury',
      heritageStatus: 'RED',
      existingCondition: 'poor',
      postcode: 'NW3 1AA',
    });
    
    expect(simpleEstimate.summary.confidence).toBeGreaterThan(complexEstimate.summary.confidence);
  });
});
