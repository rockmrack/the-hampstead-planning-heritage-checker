import { NextRequest, NextResponse } from 'next/server';
import BuildingRegsService from '@/lib/services/building-regs-compliance';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, projectType, projectDetails } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!projectType) {
      return NextResponse.json(
        { error: 'Project type is required' },
        { status: 400 }
      );
    }

    const service = new BuildingRegsService();
    const assessment = service.assessBuildingRegsCompliance(
      address,
      projectType,
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Building Regulations Compliance API error:', error);
    return NextResponse.json(
      { error: 'Failed to assess building regulations compliance' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const projectType = searchParams.get('projectType');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  if (!projectType) {
    return NextResponse.json(
      { error: 'Project type is required' },
      { status: 400 }
    );
  }

  try {
    const service = new BuildingRegsService();
    const assessment = service.assessBuildingRegsCompliance(
      address,
      projectType,
      {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Building Regulations Compliance API error:', error);
    return NextResponse.json(
      { error: 'Failed to assess building regulations compliance' },
      { status: 500 }
    );
  }
}
