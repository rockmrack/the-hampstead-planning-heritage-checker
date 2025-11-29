/**
 * Community Projects Gallery API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityProjectsGallery } from '@/lib/services/community-projects-gallery';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get specific project by ID
  const projectId = searchParams.get('id');
  if (projectId) {
    const project = communityProjectsGallery.getProject(projectId);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Get similar projects
    const similar = communityProjectsGallery.getSimilarProjects(project, 4);
    
    return NextResponse.json({ project, similar });
  }
  
  // Search projects
  const query = searchParams.get('q');
  if (query) {
    const results = communityProjectsGallery.searchProjects(query);
    return NextResponse.json({ projects: results, total: results.length });
  }
  
  // Filter projects
  const area = searchParams.get('area') || undefined;
  const projectType = searchParams.get('projectType') || undefined;
  const minBudget = searchParams.get('minBudget');
  const maxBudget = searchParams.get('maxBudget');
  const conservationArea = searchParams.get('conservationArea');
  const listedBuilding = searchParams.get('listedBuilding');
  const featured = searchParams.get('featured') === 'true';
  
  const filters = {
    area,
    projectType,
    minBudget: minBudget ? parseInt(minBudget) : undefined,
    maxBudget: maxBudget ? parseInt(maxBudget) : undefined,
    conservationArea: conservationArea ? conservationArea === 'true' : undefined,
    listedBuilding: listedBuilding ? listedBuilding === 'true' : undefined,
    featured,
  };
  
  const projects = communityProjectsGallery.getProjects(filters);
  const stats = communityProjectsGallery.getStats();
  
  return NextResponse.json({
    projects,
    total: projects.length,
    stats,
  });
}
