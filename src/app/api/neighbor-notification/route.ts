/**
 * Neighbor Notification API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { neighborNotificationService } from '@/lib/services/neighbor-notification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, projectType, projectDescription, startDate, duration } = body;
    
    if (!address || !projectType || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: address, projectType, startDate' },
        { status: 400 }
      );
    }
    
    const plan = neighborNotificationService.generateNotificationPlan(
      address,
      projectType,
      projectDescription || `${projectType} project`,
      new Date(startDate),
      duration || '12-16 weeks'
    );
    
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Neighbor notification error:', error);
    return NextResponse.json(
      { error: 'Failed to generate notification plan' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const templateKey = searchParams.get('template');
  
  if (templateKey) {
    const template = neighborNotificationService.getTemplate(templateKey);
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(template);
  }
  
  // Return available templates
  return NextResponse.json({
    availableTemplates: [
      'friendly-intro',
      'party-wall-notice-structure',
      'party-wall-notice-excavation',
      'pre-start-courtesy',
      'during-works-update',
      'completion-notice',
    ],
    usage: {
      getTemplate: '?template=friendly-intro',
      generatePlan: {
        method: 'POST',
        body: {
          address: 'string (required)',
          projectType: 'string (required)',
          startDate: 'ISO date string (required)',
          projectDescription: 'string (optional)',
          duration: 'string (optional)',
        },
      },
    },
  });
}
