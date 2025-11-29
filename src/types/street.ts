import { StreetDefinition } from '@/lib/data/streets';
import { StreetAnalysis } from '@/lib/services/street-precedents';

export interface StreetPageProps {
  params: {
    slug: string;
  };
}

export interface StreetData extends StreetDefinition {
  analysis: StreetAnalysis;
  marketData: {
    averageSoldPrice1Year: number;
    priceGrowth5Year: number;
    turnoverRate: number; // % of houses sold per year
  };
  localKnowledge: {
    history: string;
    architecturalStyle: string;
    famousResidents?: string[];
    nearestTransport: string[];
    schools: string[];
  };
}

export interface StreetAPIResponse {
  success: boolean;
  data?: StreetData;
  error?: string;
}
