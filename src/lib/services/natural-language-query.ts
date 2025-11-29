/**
 * Natural Language Query Service
 * Answer planning questions in plain English
 */

export interface QueryResult {
  query: string;
  intent: QueryIntent;
  answer: string;
  confidence: number;
  sources: {
    type: 'policy' | 'precedent' | 'area-data' | 'calculation' | 'general';
    reference: string;
    excerpt?: string;
  }[];
  relatedQuestions: string[];
  actionItems?: {
    action: string;
    link?: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  visualData?: {
    type: 'chart' | 'map' | 'comparison' | 'timeline';
    data: unknown;
  };
}

export type QueryIntent =
  | 'permitted-development'
  | 'planning-required'
  | 'heritage-status'
  | 'extension-rules'
  | 'approval-likelihood'
  | 'cost-estimate'
  | 'timeline-estimate'
  | 'precedent-search'
  | 'officer-info'
  | 'conservation-rules'
  | 'builder-recommendation'
  | 'roi-calculation'
  | 'general-info';

export interface ParsedQuery {
  originalQuery: string;
  intent: QueryIntent;
  entities: {
    address?: string;
    postcode?: string;
    projectType?: string;
    area?: string;
    measurement?: { value: number; unit: string };
    material?: string;
    timeframe?: string;
  };
  context?: {
    conservationArea?: boolean;
    listedBuilding?: boolean;
    heritageStatus?: 'RED' | 'AMBER' | 'GREEN';
  };
}

// ===========================================
// QUERY PATTERNS
// ===========================================

interface QueryPattern {
  patterns: RegExp[];
  intent: QueryIntent;
  entityExtractors: {
    name: string;
    pattern: RegExp;
  }[];
}

const QUERY_PATTERNS: QueryPattern[] = [
  {
    patterns: [
      /can i (build|extend|add|do)/i,
      /do i need (planning|permission)/i,
      /is (planning|permission) required/i,
      /without (planning|permission)/i,
    ],
    intent: 'permitted-development',
    entityExtractors: [
      { name: 'projectType', pattern: /(extension|loft|dormer|basement|conservatory|porch|garage|shed|outbuilding)/i },
      { name: 'measurement', pattern: /(\d+(?:\.\d+)?)\s*(m|meters?|metres?|ft|feet|sqm|sq\s?m)/i },
    ],
  },
  {
    patterns: [
      /what.*chance.*approv/i,
      /will.*get.*approved/i,
      /likelihood.*approv/i,
      /success.*rate/i,
    ],
    intent: 'approval-likelihood',
    entityExtractors: [
      { name: 'projectType', pattern: /(extension|loft|dormer|basement|conservatory)/i },
      { name: 'postcode', pattern: /\b(NW[0-9]+|N[0-9]+|E[0-9]+|W[0-9]+|SW[0-9]+|SE[0-9]+)\b/i },
    ],
  },
  {
    patterns: [
      /how much.*cost/i,
      /what.*cost/i,
      /price.*estimate/i,
      /budget.*for/i,
    ],
    intent: 'cost-estimate',
    entityExtractors: [
      { name: 'projectType', pattern: /(extension|loft|dormer|basement|kitchen|bathroom|renovation)/i },
      { name: 'measurement', pattern: /(\d+(?:\.\d+)?)\s*(m|meters?|metres?|sqm|sq\s?m)/i },
    ],
  },
  {
    patterns: [
      /how long.*take/i,
      /timeline/i,
      /how.*weeks|months/i,
      /duration/i,
    ],
    intent: 'timeline-estimate',
    entityExtractors: [
      { name: 'projectType', pattern: /(extension|loft|dormer|basement|planning|application)/i },
    ],
  },
  {
    patterns: [
      /conservation area/i,
      /article 4/i,
      /listed building/i,
      /heritage/i,
      /is.*protected/i,
    ],
    intent: 'heritage-status',
    entityExtractors: [
      { name: 'address', pattern: /(\d+\s+[A-Za-z\s]+(?:Road|Street|Avenue|Lane|Way|Close|Drive|Gardens|Hill|Place))/i },
      { name: 'postcode', pattern: /\b([A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2})\b/i },
    ],
  },
  {
    patterns: [
      /what.*rules/i,
      /regulations.*for/i,
      /requirements.*for/i,
      /restrictions/i,
    ],
    intent: 'extension-rules',
    entityExtractors: [
      { name: 'projectType', pattern: /(extension|loft|dormer|basement|roof)/i },
      { name: 'area', pattern: /(hampstead|highgate|muswell hill|crouch end|primrose hill)/i },
    ],
  },
  {
    patterns: [
      /similar.*approved/i,
      /precedent/i,
      /neighbors.*done/i,
      /same street/i,
      /nearby.*extension/i,
    ],
    intent: 'precedent-search',
    entityExtractors: [
      { name: 'address', pattern: /(\d+\s+[A-Za-z\s]+(?:Road|Street|Avenue|Lane|Way|Close|Drive|Gardens|Hill|Place))/i },
      { name: 'postcode', pattern: /\b([A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2})\b/i },
    ],
  },
  {
    patterns: [
      /planning officer/i,
      /case officer/i,
      /who.*handle/i,
    ],
    intent: 'officer-info',
    entityExtractors: [
      { name: 'area', pattern: /(hampstead|highgate|muswell hill|crouch end|camden|haringey)/i },
    ],
  },
  {
    patterns: [
      /recommend.*builder/i,
      /find.*builder/i,
      /good.*builder/i,
      /contractor/i,
    ],
    intent: 'builder-recommendation',
    entityExtractors: [
      { name: 'postcode', pattern: /\b(NW[0-9]+|N[0-9]+)\b/i },
      { name: 'projectType', pattern: /(extension|loft|basement|renovation)/i },
    ],
  },
  {
    patterns: [
      /worth.*it/i,
      /roi|return/i,
      /value.*add/i,
      /investment/i,
    ],
    intent: 'roi-calculation',
    entityExtractors: [
      { name: 'projectType', pattern: /(extension|loft|basement)/i },
      { name: 'postcode', pattern: /\b(NW[0-9]+|N[0-9]+)\b/i },
    ],
  },
];

// ===========================================
// RESPONSE TEMPLATES
// ===========================================

const RESPONSE_TEMPLATES: Record<QueryIntent, (entities: ParsedQuery['entities'], context?: ParsedQuery['context']) => string> = {
  'permitted-development': (entities) => {
    const project = entities.projectType || 'extension';
    return `For a ${project}, permitted development rights typically allow:

**Rear Extensions:**
• Single storey: up to 4m (semi/terrace) or 8m (detached)
• Single storey height: max 4m
• Two storey: up to 3m depth, minimum 7m to boundary

**Loft Conversions:**
• Up to 40m³ additional roof space (terraced) or 50m³ (semi/detached)
• Rear dormers allowed, no front dormers
• Not higher than existing roof

**Important:** These limits may be reduced or removed if you're in a conservation area, have Article 4 directions, or your property has been extended before.

Enter your postcode for specific rules for your property.`;
  },
  
  'planning-required': (entities) => {
    const project = entities.projectType || 'project';
    return `Whether planning permission is required for your ${project} depends on several factors:

**You WILL need planning permission if:**
• Your property is in a conservation area (for many changes)
• The property is listed
• Article 4 directions apply
• You exceed permitted development limits
• Works affect the front/street elevation

**You likely WON'T need planning if:**
• Works are within PD limits
• No heritage constraints apply
• Works are to the rear only
• Not previously extended

I recommend checking your specific property - enter your address for a detailed assessment.`;
  },

  'heritage-status': (entities) => {
    const address = entities.address || entities.postcode || 'your property';
    return `To check the heritage status of ${address}:

**What to Check:**
1. **Listed Building Status** - Check Historic England's list
2. **Conservation Area** - Check your council's website
3. **Article 4 Directions** - Restrict permitted development
4. **Locally Listed** - Additional protection but not statutory

**In NW London, many areas have heritage protection:**
• Hampstead CA - One of UK's largest
• Highgate CA - Covers Haringey and Camden sides
• Muswell Hill CA - Arts & Crafts character
• 40+ other conservation areas in Camden alone

Enter your full postcode and I'll check all designations automatically.`;
  },

  'extension-rules': (entities) => {
    const area = entities.area || 'NW London';
    return `Extension rules for ${area}:

**General Guidelines:**
• Rear extensions are usually acceptable
• Side extensions need careful design
• Front extensions rarely acceptable
• Materials should match or complement original

**Conservation Area Specific:**
• Traditional materials typically required
• Designs should be "subordinate" to original building
• Original features must be retained
• Planning permission needed for most works

**Key Measurements to Know:**
• 45-degree rule for neighbor impact
• 25-degree rule for rear extensions
• BRE guidelines for daylight/sunlight

For specific rules at your address, enter your postcode.`;
  },

  'approval-likelihood': (entities) => {
    const project = entities.projectType || 'extension';
    const area = entities.postcode || 'this area';
    return `Approval likelihood for ${project} in ${area}:

**General Success Rates (NW London):**
• Rear extensions: 80-85% approval
• Loft conversions: 85-90% approval
• Basements: 65-75% approval
• Side extensions: 70-80% approval

**Factors that INCREASE chances:**
• Pre-application advice
• Sympathetic design
• Traditional materials
• Similar precedents on street
• Addressing neighbor concerns

**Factors that DECREASE chances:**
• Conservation area impact
• Neighbor objections
• Overlooking/overshadowing
• Poor design quality
• Heritage impact

For a detailed probability assessment, enter your specific address and project details.`;
  },

  'cost-estimate': (entities) => {
    const project = entities.projectType || 'project';
    return `Cost estimates for ${project} in NW London:

**Typical Costs (2024):**
| Project | Low | Mid | High |
|---------|-----|-----|------|
| Single rear extension | £40k | £55k | £75k |
| Double rear extension | £70k | £90k | £120k |
| Loft conversion | £55k | £75k | £100k |
| Basement | £180k | £250k | £350k+ |
| Side return | £35k | £45k | £60k |

**Additional Costs to Budget:**
• Architect fees: 8-12% of build cost
• Structural engineer: £1,500-3,000
• Planning application: £258 (householder)
• Building regs: £800-1,500
• Party wall: £1,000-3,000 per neighbor

These are approximate - for accurate quotes, get 3 builder estimates.`;
  },

  'timeline-estimate': (entities) => {
    const project = entities.projectType || 'project';
    return `Timeline for ${project}:

**Typical Project Timeline:**

**1. Design Phase (4-8 weeks)**
• Initial consultation
• Survey and drawings
• Planning strategy

**2. Planning (if required) (8-13 weeks)**
• Application preparation: 2 weeks
• Validation: 1 week
• Decision period: 8 weeks (householder)
• Listed building: 8-13 weeks

**3. Pre-Construction (4-8 weeks)**
• Tender process: 2-3 weeks
• Party wall (if needed): 4-8 weeks
• Building regs approval: 2-4 weeks

**4. Construction:**
• Rear extension: 10-16 weeks
• Loft conversion: 8-12 weeks
• Basement: 6-12 months
• Side return: 8-12 weeks

**Total typical timeline: 6-12 months** from start to finish.`;
  },

  'precedent-search': (entities) => {
    const area = entities.address || entities.postcode || 'your street';
    return `Finding precedents near ${area}:

**Why Precedents Matter:**
Planning decisions should be consistent. If similar extensions have been approved on your street, this significantly strengthens your application.

**What I Can Show You:**
• Approved applications within 200m
• Project types and sizes
• Decision dates and conditions
• Before/after photos (where available)

**How to Use Precedents:**
1. Reference them in your Design & Access Statement
2. Show photos to your architect
3. Match materials and design language
4. Cite specific application references

Enter your full address for a detailed precedent search of your street and surrounding area.`;
  },

  'officer-info': (entities) => {
    const area = entities.area || 'your area';
    return `Planning officers for ${area}:

**Camden Officers (Hampstead, Belsize Park, Kentish Town):**
• Conservation team handles heritage applications
• Pre-app service available (£500-2000)
• Generally thorough and detail-focused

**Haringey Officers (Muswell Hill, Crouch End, Highgate):**
• Area-based case officers
• Free pre-app surgery for householders
• Generally more pragmatic approach

**Working with Officers:**
• Be responsive to requests
• Attend site visits
• Consider pre-application advice
• Address concerns proactively

For officer details specific to your application, enter your postcode.`;
  },

  'builder-recommendation': (entities) => {
    const area = entities.postcode || 'NW London';
    return `Finding builders in ${area}:

**Top-Rated Local Builders:**
I have data on 50+ vetted builders in NW London, rated by:
• Customer reviews
• Project quality
• Reliability
• Value for money

**Key Criteria to Check:**
• FMB membership
• Proper insurance (public liability £5m+)
• Recent references you can visit
• Written detailed quote
• Payment schedule (not >25% upfront)

**For Heritage Projects, Look For:**
• SPAB training
• Listed building experience
• Traditional material expertise

Enter your postcode and project type for personalized builder recommendations.`;
  },

  'roi-calculation': (entities) => {
    const project = entities.projectType || 'extension';
    return `ROI analysis for ${project}:

**Average Value Added (NW London):**
| Project | Cost | Value Added | ROI |
|---------|------|-------------|-----|
| Loft conversion | £70k | £120k | +71% |
| Rear extension | £50k | £65k | +30% |
| Basement | £250k | £280k | +12% |
| Side return | £40k | £55k | +38% |

**Best ROI Projects:**
1. Loft conversions (consistently best ROI)
2. Side return extensions (good value)
3. Rear extensions (solid returns)

**ROI Varies By:**
• Area values (Hampstead > Crouch End)
• Quality of finish
• Design quality
• How well it integrates

For your specific property, enter your address and current value for a detailed calculation.`;
  },

  'conservation-rules': (entities) => {
    const area = entities.area || 'conservation areas';
    return `Conservation area rules for ${area}:

**What Changes in a Conservation Area:**
• Most PD rights removed for front elevation
• Materials more tightly controlled
• Trees protected
• Planning needed for more works

**What's Usually Required:**
• Traditional materials (slate, brick, timber)
• Sympathetic design
• Retention of original features
• Rear-only extensions preferred

**What's Usually Refused:**
• uPVC windows
• Front roof alterations
• Prominent dormer windows
• Inappropriate materials

**Article 4 Directions** may further restrict:
• Window replacements
• Painting
• Front boundary changes

Enter your address for your specific conservation area rules.`;
  },

  'general-info': () => {
    return `I can help you with:

**Planning Questions:**
• Do I need planning permission?
• What are my chances of approval?
• What are the rules in my area?

**Project Planning:**
• How much will it cost?
• How long will it take?
• What's the ROI?

**Finding Help:**
• Builder recommendations
• Understanding officers
• Precedent research

**Just ask me anything in plain English!**

Examples:
• "Can I build a 4m extension in NW3?"
• "What's the approval rate for basements in Hampstead?"
• "How much does a loft conversion cost?"
• "Find me similar extensions to 42 Flask Walk"`;
  },
};

// ===========================================
// NATURAL LANGUAGE QUERY SERVICE
// ===========================================

class NaturalLanguageQueryService {
  /**
   * Process a natural language query
   */
  processQuery(query: string, userContext?: ParsedQuery['context']): QueryResult {
    // Parse the query
    const parsed = this.parseQuery(query);
    
    // Merge user context
    if (userContext) {
      parsed.context = { ...parsed.context, ...userContext };
    }
    
    // Generate response
    const response = this.generateResponse(parsed);
    
    return response;
  }

  /**
   * Parse a natural language query
   */
  parseQuery(query: string): ParsedQuery {
    let matchedIntent: QueryIntent = 'general-info';
    const entities: ParsedQuery['entities'] = {};
    
    // Find matching intent
    for (const pattern of QUERY_PATTERNS) {
      for (const regex of pattern.patterns) {
        if (regex.test(query)) {
          matchedIntent = pattern.intent;
          
          // Extract entities
          for (const extractor of pattern.entityExtractors) {
            const match = query.match(extractor.pattern);
            if (match) {
              if (extractor.name === 'measurement') {
                entities.measurement = {
                  value: parseFloat(match[1]),
                  unit: match[2].toLowerCase(),
                };
              } else {
                (entities as Record<string, string>)[extractor.name] = match[1] || match[0];
              }
            }
          }
          break;
        }
      }
      if (matchedIntent !== 'general-info') break;
    }
    
    // Also check for postcodes anywhere in query
    const postcodeMatch = query.match(/\b([A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}|NW[0-9]+|N[0-9]+)\b/i);
    if (postcodeMatch && !entities.postcode) {
      entities.postcode = postcodeMatch[1].toUpperCase();
    }
    
    return {
      originalQuery: query,
      intent: matchedIntent,
      entities,
    };
  }

  /**
   * Generate a response for a parsed query
   */
  private generateResponse(parsed: ParsedQuery): QueryResult {
    const template = RESPONSE_TEMPLATES[parsed.intent];
    const answer = template(parsed.entities, parsed.context);
    
    return {
      query: parsed.originalQuery,
      intent: parsed.intent,
      answer,
      confidence: this.calculateConfidence(parsed),
      sources: this.getSources(parsed.intent),
      relatedQuestions: this.getRelatedQuestions(parsed.intent),
      actionItems: this.getActionItems(parsed),
    };
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(parsed: ParsedQuery): number {
    let confidence = 0.5; // Base confidence
    
    // Higher confidence if we matched a specific intent
    if (parsed.intent !== 'general-info') {
      confidence += 0.2;
    }
    
    // Higher confidence if we extracted entities
    if (parsed.entities.postcode) confidence += 0.1;
    if (parsed.entities.projectType) confidence += 0.1;
    if (parsed.entities.address) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }

  /**
   * Get sources for response
   */
  private getSources(intent: QueryIntent): QueryResult['sources'] {
    const sources: QueryResult['sources'] = [];
    
    switch (intent) {
      case 'permitted-development':
        sources.push({
          type: 'policy',
          reference: 'Town and Country Planning (General Permitted Development) Order 2015',
        });
        break;
      case 'heritage-status':
        sources.push({
          type: 'policy',
          reference: 'National Heritage List for England',
        });
        sources.push({
          type: 'area-data',
          reference: 'Local Planning Authority Conservation Area Maps',
        });
        break;
      case 'cost-estimate':
        sources.push({
          type: 'calculation',
          reference: 'NW London Builder Cost Database',
        });
        break;
      case 'approval-likelihood':
        sources.push({
          type: 'precedent',
          reference: 'Historical Planning Decision Analysis',
        });
        break;
    }
    
    return sources;
  }

  /**
   * Get related questions
   */
  private getRelatedQuestions(intent: QueryIntent): string[] {
    const related: Record<QueryIntent, string[]> = {
      'permitted-development': [
        'What are the PD limits for loft conversions?',
        'Does Article 4 affect my property?',
        'Can I extend without planning in a conservation area?',
      ],
      'planning-required': [
        'How long does planning permission take?',
        'What is pre-application advice?',
        'What happens if I build without permission?',
      ],
      'heritage-status': [
        'What restrictions apply in conservation areas?',
        'How do I apply for listed building consent?',
        'What is an Article 4 Direction?',
      ],
      'extension-rules': [
        'What is the 45-degree rule?',
        'How close to the boundary can I build?',
        'What materials should I use?',
      ],
      'approval-likelihood': [
        'How can I improve my chances?',
        'Should I get pre-application advice?',
        'What do planning officers look for?',
      ],
      'cost-estimate': [
        'How do I get accurate quotes?',
        'What are typical professional fees?',
        'Are there hidden costs?',
      ],
      'timeline-estimate': [
        'Can I speed up planning?',
        'How long do extensions take to build?',
        'When should I start the party wall process?',
      ],
      'precedent-search': [
        'How do I find planning applications?',
        'Can I see my neighbor\'s plans?',
        'What information is public?',
      ],
      'officer-info': [
        'Should I get pre-application advice?',
        'Can I meet the planning officer?',
        'How do I respond to requests for information?',
      ],
      'builder-recommendation': [
        'How do I check a builder\'s credentials?',
        'What should a quote include?',
        'Should I use a main contractor?',
      ],
      'roi-calculation': [
        'What adds most value to a house?',
        'Is a basement worth the cost?',
        'How much value does a loft add?',
      ],
      'conservation-rules': [
        'Can I replace windows in a conservation area?',
        'What materials are acceptable?',
        'Do I need permission for a garden room?',
      ],
      'general-info': [
        'Do I need planning permission?',
        'How much will an extension cost?',
        'What are my options for extending?',
      ],
    };
    
    return related[intent] || related['general-info'];
  }

  /**
   * Get action items
   */
  private getActionItems(parsed: ParsedQuery): QueryResult['actionItems'] {
    const actions: QueryResult['actionItems'] = [];
    
    if (!parsed.entities.postcode && !parsed.entities.address) {
      actions.push({
        action: 'Enter your postcode for personalized information',
        priority: 'high',
      });
    }
    
    if (parsed.intent === 'approval-likelihood' || parsed.intent === 'planning-required') {
      actions.push({
        action: 'Run a full property check',
        link: '/check',
        priority: 'high',
      });
    }
    
    if (parsed.intent === 'cost-estimate') {
      actions.push({
        action: 'Use ROI calculator for detailed analysis',
        link: '/calculator',
        priority: 'medium',
      });
    }
    
    if (parsed.intent === 'builder-recommendation') {
      actions.push({
        action: 'View recommended builders',
        link: '/builders',
        priority: 'medium',
      });
    }
    
    return actions;
  }

  /**
   * Get suggested queries
   */
  getSuggestions(partialQuery: string): string[] {
    const suggestions = [
      'Can I build a rear extension?',
      'Do I need planning permission for a loft conversion?',
      'What are the rules in Hampstead conservation area?',
      'How much does a basement cost in NW3?',
      'Find similar extensions near me',
      'What\'s the approval rate for extensions in Highgate?',
      'How long does planning permission take?',
      'Is my house in a conservation area?',
    ];
    
    if (!partialQuery) return suggestions.slice(0, 4);
    
    const lower = partialQuery.toLowerCase();
    return suggestions.filter(s => s.toLowerCase().includes(lower)).slice(0, 4);
  }
}

// Export singleton
export const naturalLanguageQuery = new NaturalLanguageQueryService();
