/**
 * Lead Capture Service
 * Manages lead capture and storage for the PDF download flow
 */

import { getSupabaseAdmin } from '@/lib/supabase';
import { logInfo, logError } from '@/lib/utils';
import type { LeadCaptureData, LeadCaptureResponse, PropertyStatus } from '@/types';

/**
 * Capture a lead when user provides their email
 */
export async function captureLead(data: LeadCaptureData): Promise<LeadCaptureResponse> {
  try {
    const admin = getSupabaseAdmin();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin.from('leads') as any).insert({
      email: data.email.toLowerCase().trim(),
      name: data.name,
      phone: data.phone,
      search_id: data.searchId,
      source: data.source,
      property_address: data.propertyAddress,
      property_status: data.propertyStatus,
      marketing_consent: data.marketingConsent,
    });

    if (error) {
      // Check if duplicate email
      if (error.code === '23505') {
        // Update existing lead
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (admin.from('leads') as any)
          .update({
            search_id: data.searchId,
            source: data.source,
            property_address: data.propertyAddress,
            property_status: data.propertyStatus,
          })
          .eq('email', data.email.toLowerCase().trim());

        logInfo('Updated existing lead', { email: data.email });
        return { success: true, message: 'Lead updated successfully' };
      }

      throw error;
    }

    logInfo('New lead captured', { email: data.email, source: data.source });
    return { success: true, message: 'Lead captured successfully' };
  } catch (error) {
    logError('Lead capture failed', error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: 'Failed to save your information. Please try again.',
    };
  }
}

/**
 * Get leads by search ID
 */
export async function getLeadBySearchId(searchId: string) {
  try {
    const admin = getSupabaseAdmin();

    const { data, error } = await admin
      .from('leads')
      .select('*')
      .eq('search_id', searchId)
      .single();

    if (error) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Get leads statistics for analytics
 */
export async function getLeadStats() {
  try {
    const admin = getSupabaseAdmin();

    // Total leads
    const { count: totalLeads } = await admin
      .from('leads')
      .select('*', { count: 'exact', head: true });

    // Leads by source
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: sourceData } = await admin
      .from('leads')
      .select('source') as { data: { source: string }[] | null };

    const bySource: Record<string, number> = {};
    sourceData?.forEach((lead) => {
      bySource[lead.source] = (bySource[lead.source] ?? 0) + 1;
    });

    // Leads by status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: statusData } = await admin
      .from('leads')
      .select('property_status') as { data: { property_status: string | null }[] | null };

    const byStatus: Record<PropertyStatus, number> = {
      RED: 0,
      AMBER: 0,
      GREEN: 0,
    };
    statusData?.forEach((lead) => {
      if (lead.property_status) {
        byStatus[lead.property_status as PropertyStatus]++;
      }
    });

    // Conversion rate (leads that provided email)
    const { count: convertedLeads } = await admin
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('converted', true);

    return {
      totalLeads: totalLeads ?? 0,
      convertedLeads: convertedLeads ?? 0,
      conversionRate: totalLeads ? ((convertedLeads ?? 0) / totalLeads) * 100 : 0,
      bySource,
      byStatus,
    };
  } catch (error) {
    logError('Failed to get lead stats', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

/**
 * Mark a lead as converted
 */
export async function markLeadConverted(email: string): Promise<boolean> {
  try {
    const admin = getSupabaseAdmin();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin.from('leads') as any)
      .update({
        converted: true,
        converted_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase().trim());

    if (error) {
      throw error;
    }

    logInfo('Lead marked as converted', { email });
    return true;
  } catch (error) {
    logError('Failed to mark lead as converted', error instanceof Error ? error : new Error(String(error)));
    return false;
  }
}

/**
 * Add note to a lead
 */
export async function addLeadNote(email: string, note: string): Promise<boolean> {
  try {
    const admin = getSupabaseAdmin();

    // Get existing notes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingLead } = await admin
      .from('leads')
      .select('notes')
      .eq('email', email.toLowerCase().trim())
      .single() as { data: { notes: string | null } | null };

    const existingNotes = existingLead?.notes ?? '';
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${note}`;
    const updatedNotes = existingNotes ? `${existingNotes}\n${newNote}` : newNote;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (admin.from('leads') as any)
      .update({ notes: updatedNotes })
      .eq('email', email.toLowerCase().trim());

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    logError('Failed to add lead note', error instanceof Error ? error : new Error(String(error)));
    return false;
  }
}

export default {
  captureLead,
  getLeadBySearchId,
  getLeadStats,
  markLeadConverted,
  addLeadNote,
};
