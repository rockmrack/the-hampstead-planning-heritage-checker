import { getStreetBySlug, StreetDefinition } from '@/lib/data/streets';
import { streetPrecedentService, StreetAnalysis } from '@/lib/services/street-precedents';
import { StreetData } from '@/types/street';

class StreetIntelligenceService {
  /**
   * Get full intelligence for a street by its slug
   */
  async getStreetData(slug: string): Promise<StreetData | null> {
    const streetDef = getStreetBySlug(slug);
    
    if (!streetDef) {
      return null;
    }

    // Get planning analysis
    const analysis = await streetPrecedentService.getStreetPrecedents(
      streetDef.name,
      streetDef.postcode
    );

    // Get market data (Simulated for now)
    const marketData = await this.getMarketData(streetDef);

    // Get local knowledge (Simulated for now)
    const localKnowledge = await this.getLocalKnowledge(streetDef);

    return {
      ...streetDef,
      analysis,
      marketData,
      localKnowledge,
    };
  }

  private async getMarketData(street: StreetDefinition) {
    // In production, this would query Land Registry or Zoopla API
    const baseValue = street.averageValue || 1000000;
    
    return {
      averageSoldPrice1Year: baseValue * (1 + (Math.random() * 0.1 - 0.05)), // +/- 5%
      priceGrowth5Year: 12.5 + (Math.random() * 5), // 12-17% growth
      turnoverRate: 3.5 + (Math.random() * 2), // 3-5% turnover
    };
  }

  private async getLocalKnowledge(street: StreetDefinition) {
    // In production, this would come from a CMS or AI generation
    return {
      history: `${street.name} has a rich history dating back to the 19th century development of ${street.borough}. Originally a rural path, it was developed to serve the growing population of London commuters.`,
      architecturalStyle: this.getArchitecturalStyle(street),
      famousResidents: this.getFamousResidents(street),
      nearestTransport: this.getTransport(street),
      schools: this.getSchools(street),
    };
  }

  private getArchitecturalStyle(street: StreetDefinition): string {
    if (street.conservationArea?.includes('Hampstead')) {
      return 'A mix of Georgian cottages and Victorian terraces, characterized by London stock brick and sash windows.';
    }
    if (street.conservationArea?.includes('Belsize')) {
      return 'Grand white stucco-fronted Victorian villas, often converted into spacious apartments.';
    }
    if (street.conservationArea?.includes('Highgate')) {
      return 'Historic village architecture mixed with substantial Edwardian family homes.';
    }
    if (street.conservationArea?.includes('Garden Suburb')) {
      return 'Arts and Crafts style detached and semi-detached houses designed by Lutyens and Unwin.';
    }
    return 'Late Victorian and Edwardian terraces typical of North London expansion.';
  }

  private getFamousResidents(street: StreetDefinition): string[] {
    // Simulated data
    if (street.slug.includes('heath-street')) return ['Boy George', 'George Michael (formerly)'];
    if (street.slug.includes('well-walk')) return ['John Keats', 'John Constable'];
    if (street.slug.includes('the-bishops-avenue')) return ['Various international royalty'];
    if (street.slug.includes('primrose-hill')) return ['Jude Law', 'Kate Moss (formerly)'];
    return [];
  }

  private getTransport(street: StreetDefinition): string[] {
    const postcode = street.postcode;
    if (postcode.startsWith('NW3')) return ['Hampstead (Northern Line)', 'Belsize Park (Northern Line)', 'Hampstead Heath (Overground)'];
    if (postcode.startsWith('NW1')) return ['Camden Town (Northern Line)', 'Chalk Farm (Northern Line)'];
    if (postcode.startsWith('N6')) return ['Highgate (Northern Line)', 'Archway (Northern Line)'];
    if (postcode.startsWith('NW8')) return ["St John's Wood (Jubilee Line)", 'Maida Vale (Bakerloo Line)'];
    if (postcode.startsWith('NW11')) return ['Golders Green (Northern Line)'];
    if (postcode.startsWith('N10')) return ['Highgate (Northern Line)', 'Alexandra Palace (National Rail)'];
    return ['Local Bus Network'];
  }

  private getSchools(street: StreetDefinition): string[] {
    const postcode = street.postcode;
    if (postcode.startsWith('NW3')) return ['University College School', 'South Hampstead High School', 'Devonshire House'];
    if (postcode.startsWith('N6')) return ['Highgate School', 'Channing School'];
    if (postcode.startsWith('NW8')) return ['The American School in London', 'Arnold House'];
    if (postcode.startsWith('NW11')) return ['Henrietta Barnett School'];
    return ['Local Primary Schools'];
  }
}

export const streetIntelligenceService = new StreetIntelligenceService();
