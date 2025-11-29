/**
 * Ecology Survey API
 * 
 * Assessment of ecological requirements for development
 */

import { NextRequest, NextResponse } from 'next/server';
import ecologySurvey from '@/lib/services/ecology-survey';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      siteArea,
      existingHabitats,
      treesPresent,
      waterFeatures,
      buildingsToAlter,
      roofType,
      proximity,
      demolition
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await ecologySurvey.assessEcologyRequirements(
      address,
      postcode,
      projectType,
      {
        siteArea,
        existingHabitats,
        treesPresent,
        waterFeatures,
        buildingsToAlter,
        roofType,
        proximity,
        demolition
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Ecology survey assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess ecology requirements' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return ecology survey overview
  return NextResponse.json({
    success: true,
    data: {
      protectedSpecies: {
        bats: {
          legislation: 'Wildlife and Countryside Act 1981, Habitats Regulations 2017',
          surveyPeriod: 'May-September',
          licenceRequired: true
        },
        greatCrestedNewts: {
          legislation: 'Wildlife and Countryside Act 1981, Habitats Regulations 2017',
          surveyPeriod: 'March-June',
          licenceRequired: true
        },
        nestingBirds: {
          legislation: 'Wildlife and Countryside Act 1981',
          surveyPeriod: 'March-August (nesting)',
          licenceRequired: false
        },
        badgers: {
          legislation: 'Protection of Badgers Act 1992',
          surveyPeriod: 'Year-round',
          licenceRequired: true
        }
      },
      biodiversityNetGain: {
        requirement: '10% net gain (mandatory)',
        metric: 'DEFRA Biodiversity Metric 4.0',
        options: ['On-site', 'Off-site', 'Credits']
      },
      surveyTypes: {
        PEA: 'Preliminary Ecological Appraisal - £300-600',
        batSurvey: 'Full bat survey suite - £1,000-2,500',
        reptileSurvey: 'Reptile presence/absence - £800-1,500',
        arboriculture: 'Tree impact assessment - £400-1,000'
      },
      localDesignations: [
        'Hampstead Heath SSSI',
        "Regent's Park SSSI",
        'Multiple Sites of Importance for Nature Conservation',
        'Tree Preservation Orders'
      ]
    }
  });
}
