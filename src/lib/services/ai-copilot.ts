/**
 * AI Planning Copilot Service
 * 
 * Provides intelligent, context-aware responses to planning and heritage queries
 * using GPT-4 or Claude. Understands property context, heritage constraints,
 * and provides actionable guidance.
 * 
 * @module services/ai-copilot
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const process: { env: Record<string, string | undefined> } | undefined;

import { PropertyCheckResult, ConservationArea, ListedBuilding } from '@/types';

// ===========================================
// TYPES
// ===========================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    propertyContext?: PropertyContext;
    citations?: Citation[];
    suggestedActions?: SuggestedAction[];
  };
}

export interface PropertyContext {
  address: string;
  postcode: string;
  heritageStatus: 'RED' | 'AMBER' | 'GREEN';
  listedBuilding?: ListedBuilding | null;
  conservationArea?: ConservationArea | null;
  hasArticle4: boolean;
  borough?: string;
}

export interface Citation {
  source: string;
  title: string;
  url?: string;
  excerpt?: string;
}

export interface SuggestedAction {
  id: string;
  label: string;
  action: 'check_property' | 'calculate_roi' | 'find_professional' | 'generate_document' | 'view_precedents';
  params?: Record<string, unknown>;
}

export interface CopilotSession {
  id: string;
  messages: ChatMessage[];
  propertyContext?: PropertyContext;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamingResponse {
  content: string;
  done: boolean;
  citations?: Citation[];
  suggestedActions?: SuggestedAction[];
}

// ===========================================
// SYSTEM PROMPTS
// ===========================================

const SYSTEM_PROMPT = `You are an expert planning and heritage consultant specializing in North West London properties. You have deep knowledge of:

1. **Listed Building Regulations**
   - Grade I, II*, and II listed buildings
   - Listed Building Consent requirements
   - What alterations are/aren't permitted
   - Historic England guidance

2. **Conservation Areas**
   - Camden, Barnet, Westminster, Haringey planning policies
   - Article 4 Directions and their implications
   - Design guidelines for conservation areas
   - Permitted development restrictions

3. **Planning Permission**
   - Householder applications
   - Prior approval requirements
   - Permitted development rights
   - Planning conditions and enforcement

4. **Practical Guidance**
   - Approval likelihood for different projects
   - Cost estimates and ROI
   - Timeline expectations
   - Professional recommendations

IMPORTANT GUIDELINES:
- Always consider the user's specific property context when provided
- Cite relevant policies and regulations
- Be practical and actionable
- If unsure, recommend professional consultation
- Use UK English and terminology
- Format responses with clear headings and bullet points
- Proactively suggest next steps

When discussing specific projects, consider:
- Heritage impact
- Neighbor amenity
- Design quality
- Policy compliance
- Precedents in the area`;

const PROPERTY_CONTEXT_TEMPLATE = (context: PropertyContext) => `
CURRENT PROPERTY CONTEXT:
- Address: ${context.address}
- Postcode: ${context.postcode}
- Heritage Status: ${context.heritageStatus}
${context.listedBuilding ? `- Listed Building: Grade ${context.listedBuilding.grade} (${context.listedBuilding.name})` : ''}
${context.conservationArea ? `- Conservation Area: ${context.conservationArea.name}` : ''}
${context.hasArticle4 ? '- Article 4 Direction: YES - Permitted development rights restricted' : ''}
- Borough: ${context.borough || 'Unknown'}

Use this context to provide specific, relevant advice.`;

// ===========================================
// KNOWLEDGE BASE
// ===========================================

const KNOWLEDGE_BASE = {
  listedBuildings: {
    gradeI: {
      description: 'Buildings of exceptional interest, only 2.5% of listed buildings',
      restrictions: [
        'Any alteration likely to affect character requires LBC',
        'Presumption against harmful change',
        'Often requires Historic England consultation',
        'Very high bar for approval of changes',
      ],
      tips: [
        'Engage heritage consultant early',
        'Research building history thoroughly',
        'Consider reversible interventions',
        'Budget 30-50% more for heritage-sensitive works',
      ],
    },
    gradeII: {
      description: 'Buildings of special interest, warranting every effort to preserve',
      restrictions: [
        'Internal and external works need LBC if affecting character',
        'Like-for-like repairs generally acceptable',
        'Modern extensions possible with good design',
        'Materials must be appropriate',
      ],
      tips: [
        'Pre-application advice is valuable',
        'High quality design can succeed',
        'Document existing condition thoroughly',
        'Consider hidden modern interventions',
      ],
    },
  },
  conservationAreas: {
    general: {
      restrictions: [
        'Demolition requires conservation area consent',
        'Trees over 75mm diameter protected (6 weeks notice)',
        'Design must preserve or enhance character',
        'Some PD rights may be removed by Article 4',
      ],
      designGuidance: [
        'Respect existing building lines',
        'Use appropriate materials',
        'Maintain rhythm of openings',
        'Consider roof profiles carefully',
      ],
    },
    article4: {
      commonRestrictions: [
        'Front elevation alterations (windows, doors)',
        'Satellite dishes and aerials',
        'Painting of external surfaces',
        'Changes to boundary treatments',
        'Hardstanding in front gardens',
      ],
    },
  },
  permittedDevelopment: {
    rearExtensions: {
      singleStorey: {
        detached: '4m (or 8m with prior approval)',
        semiTerraced: '3m (or 6m with prior approval)',
        maxHeight: '4m',
        eaveHeight: '3m if within 2m of boundary',
      },
      doubleStorey: {
        maxDepth: '3m',
        maxHeight: '7m from ground (ridge must be below existing)',
        distance: 'At least 7m from rear boundary',
      },
    },
    loftConversions: {
      limits: {
        terraced: '40 cubic metres additional',
        semiDetached: '50 cubic metres additional',
        detached: '50 cubic metres additional',
      },
      restrictions: [
        'Must not exceed existing highest roof part',
        'Materials must be similar in appearance',
        'No verandas, balconies, or raised platforms',
        'Side-facing windows must be obscure-glazed and non-opening below 1.7m',
      ],
    },
  },
  camdenPolicies: {
    basements: 'Maximum 50% of garden can be built under, single storey only',
    extensions: 'Generally supportive if good design and minimal impact',
    heritage: 'Very strong protection for conservation areas',
  },
};

// ===========================================
// INTENT DETECTION
// ===========================================

type Intent = 
  | 'check_feasibility'
  | 'understand_restrictions'
  | 'get_cost_estimate'
  | 'find_precedents'
  | 'planning_process'
  | 'document_help'
  | 'professional_recommendation'
  | 'general_question';

function detectIntent(message: string): Intent {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('can i') || lowerMessage.includes('allowed') || lowerMessage.includes('permitted') || lowerMessage.includes('possible')) {
    return 'check_feasibility';
  }
  if (lowerMessage.includes('restriction') || lowerMessage.includes('rule') || lowerMessage.includes('regulation') || lowerMessage.includes('what are')) {
    return 'understand_restrictions';
  }
  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('budget') || lowerMessage.includes('how much')) {
    return 'get_cost_estimate';
  }
  if (lowerMessage.includes('precedent') || lowerMessage.includes('neighbor') || lowerMessage.includes('similar') || lowerMessage.includes('approved nearby')) {
    return 'find_precedents';
  }
  if (lowerMessage.includes('process') || lowerMessage.includes('how long') || lowerMessage.includes('apply') || lowerMessage.includes('submit')) {
    return 'planning_process';
  }
  if (lowerMessage.includes('document') || lowerMessage.includes('statement') || lowerMessage.includes('write') || lowerMessage.includes('form')) {
    return 'document_help';
  }
  if (lowerMessage.includes('architect') || lowerMessage.includes('builder') || lowerMessage.includes('recommend') || lowerMessage.includes('find')) {
    return 'professional_recommendation';
  }
  
  return 'general_question';
}

// ===========================================
// RESPONSE GENERATION
// ===========================================

function generateSuggestedActions(intent: Intent, context?: PropertyContext): SuggestedAction[] {
  const actions: SuggestedAction[] = [];
  
  switch (intent) {
    case 'check_feasibility':
      actions.push({
        id: 'calc-roi',
        label: 'Calculate ROI for this project',
        action: 'calculate_roi',
      });
      actions.push({
        id: 'find-precedents',
        label: 'Find similar approved projects nearby',
        action: 'view_precedents',
      });
      break;
    case 'get_cost_estimate':
      actions.push({
        id: 'detailed-roi',
        label: 'Get detailed cost breakdown',
        action: 'calculate_roi',
      });
      actions.push({
        id: 'find-builder',
        label: 'Find verified builders',
        action: 'find_professional',
        params: { type: 'builder' },
      });
      break;
    case 'document_help':
      actions.push({
        id: 'gen-heritage',
        label: 'Generate Heritage Statement',
        action: 'generate_document',
        params: { type: 'heritage_statement' },
      });
      actions.push({
        id: 'gen-das',
        label: 'Generate Design & Access Statement',
        action: 'generate_document',
        params: { type: 'design_access_statement' },
      });
      break;
    case 'professional_recommendation':
      actions.push({
        id: 'find-architect',
        label: 'Find heritage architects',
        action: 'find_professional',
        params: { type: 'architect', specialization: 'heritage' },
      });
      actions.push({
        id: 'find-surveyor',
        label: 'Find party wall surveyors',
        action: 'find_professional',
        params: { type: 'surveyor' },
      });
      break;
    default:
      if (!context) {
        actions.push({
          id: 'check-property',
          label: 'Check a property',
          action: 'check_property',
        });
      }
  }
  
  return actions;
}

function getCitationsForIntent(intent: Intent, context?: PropertyContext): Citation[] {
  const citations: Citation[] = [];
  
  if (context?.heritageStatus === 'RED') {
    citations.push({
      source: 'Historic England',
      title: 'Listed Building Consent Guidance',
      url: 'https://historicengland.org.uk/advice/planning/consents/lbc/',
    });
  }
  
  if (context?.conservationArea) {
    citations.push({
      source: `${context.borough || 'Local'} Council`,
      title: `${context.conservationArea.name} Conservation Area Appraisal`,
      url: context.conservationArea.characterAppraisal,
    });
  }
  
  if (intent === 'check_feasibility' || intent === 'understand_restrictions') {
    citations.push({
      source: 'Planning Portal',
      title: 'Permitted Development Rights for Householders',
      url: 'https://www.planningportal.co.uk/permission/common-projects',
    });
  }
  
  return citations;
}

// ===========================================
// AI COPILOT SERVICE
// ===========================================

class AICopilotService {
  private apiKey: string | undefined;
  private model: string;
  
  constructor() {
    // Access environment variables safely in Node.js
    if (typeof process !== 'undefined' && process?.env) {
      this.apiKey = process.env['OPENAI_API_KEY'] || process.env['ANTHROPIC_API_KEY'];
      this.model = process.env['AI_MODEL'] || 'gpt-4-turbo-preview';
    } else {
      this.apiKey = undefined;
      this.model = 'gpt-4-turbo-preview';
    }
  }
  
  /**
   * Generate a response to a user message
   */
  async chat(
    message: string,
    history: ChatMessage[] = [],
    propertyContext?: PropertyContext
  ): Promise<ChatMessage> {
    const intent = detectIntent(message);
    
    // Build context-aware response
    let response: string;
    
    if (this.apiKey) {
      // Use actual AI API
      response = await this.callAI(message, history, propertyContext);
    } else {
      // Fallback to rule-based response
      response = this.generateFallbackResponse(message, intent, propertyContext);
    }
    
    const citations = getCitationsForIntent(intent, propertyContext);
    const suggestedActions = generateSuggestedActions(intent, propertyContext);
    
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      metadata: {
        propertyContext,
        citations,
        suggestedActions,
      },
    };
  }
  
  /**
   * Stream a response (for real-time typing effect)
   */
  async *streamChat(
    message: string,
    history: ChatMessage[] = [],
    propertyContext?: PropertyContext
  ): AsyncGenerator<StreamingResponse> {
    const intent = detectIntent(message);
    
    if (this.apiKey && this.model.includes('gpt')) {
      // Stream from OpenAI
      yield* this.streamFromOpenAI(message, history, propertyContext);
    } else {
      // Simulate streaming for fallback
      const response = this.generateFallbackResponse(message, intent, propertyContext);
      const words = response.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        yield {
          content: words.slice(0, i + 1).join(' '),
          done: i === words.length - 1,
          citations: i === words.length - 1 ? getCitationsForIntent(intent, propertyContext) : undefined,
          suggestedActions: i === words.length - 1 ? generateSuggestedActions(intent, propertyContext) : undefined,
        };
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    }
  }
  
  /**
   * Call AI API (OpenAI/Anthropic)
   */
  private async callAI(
    message: string,
    history: ChatMessage[],
    propertyContext?: PropertyContext
  ): Promise<string> {
    type ChatRole = 'system' | 'user' | 'assistant';
    type Message = { role: ChatRole; content: string };
    
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];
    
    if (propertyContext) {
      messages.push({
        role: 'system',
        content: PROPERTY_CONTEXT_TEMPLATE(propertyContext),
      });
    }
    
    // Add history
    for (const msg of history.slice(-10)) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }
    
    messages.push({ role: 'user', content: message });
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('AI API error:', error);
      return this.generateFallbackResponse(message, detectIntent(message), propertyContext);
    }
  }
  
  /**
   * Stream from OpenAI
   */
  private async *streamFromOpenAI(
    message: string,
    history: ChatMessage[],
    propertyContext?: PropertyContext
  ): AsyncGenerator<StreamingResponse> {
    // Implementation for streaming would go here
    // For now, fall back to non-streaming
    const response = await this.callAI(message, history, propertyContext);
    const intent = detectIntent(message);
    
    yield {
      content: response,
      done: true,
      citations: getCitationsForIntent(intent, propertyContext),
      suggestedActions: generateSuggestedActions(intent, propertyContext),
    };
  }
  
  /**
   * Generate fallback response without AI
   */
  private generateFallbackResponse(
    message: string,
    intent: Intent,
    context?: PropertyContext
  ): string {
    const lowerMessage = message.toLowerCase();
    
    // Heritage-specific responses
    if (context?.heritageStatus === 'RED') {
      if (intent === 'check_feasibility') {
        return `## Listed Building Considerations

Your property at **${context.address}** is a **Grade ${context.listedBuilding?.grade}** listed building. This means:

### What You Need
- **Listed Building Consent (LBC)** is required for most alterations
- This is separate from planning permission
- Both internal AND external changes need consent if they affect the building's character

### Approval Likelihood
For Grade ${context.listedBuilding?.grade} listed buildings:
${context.listedBuilding?.grade === 'I' ? 
  '- Very strict protection - only essential changes usually approved\n- Historic England will be consulted\n- Budget for specialist heritage consultants' :
  '- Moderate protection - well-designed changes can succeed\n- Focus on reversibility and minimal intervention\n- High-quality materials are essential'}

### Recommended Next Steps
1. 📋 Request pre-application advice from ${context.borough || 'the council'} (£150-500)
2. 👷 Engage a heritage architect experienced with listed buildings
3. 📝 Prepare a Heritage Impact Assessment

Would you like me to help you find a heritage specialist or generate a heritage statement draft?`;
      }
    }
    
    if (context?.heritageStatus === 'AMBER') {
      if (intent === 'check_feasibility') {
        return `## Conservation Area Guidance

Your property is in the **${context.conservationArea?.name}** Conservation Area${context.hasArticle4 ? ' with an **Article 4 Direction**' : ''}.

### What This Means
${context.hasArticle4 ? 
  '⚠️ **Article 4 Restrictions Apply**\nSome normally permitted development rights have been removed. You may need planning permission for:\n- Changes to windows and doors\n- Satellite dishes\n- Front garden alterations\n- Painting external surfaces' :
  '✅ **Permitted Development Available**\nMany extensions and alterations can proceed without planning permission, subject to limits.'}

### Design Expectations
- Materials should match or complement existing
- Respect the character of the conservation area
- Consider impact on neighbors and streetscape
- Traditional proportions often preferred

### Typical Approval Rates
- Rear extensions: 80-90% approved
- Loft conversions: 75-85% approved
- Front alterations: More scrutiny, 60-75%

Would you like me to check what specific project you're considering?`;
      }
    }
    
    // Project-specific responses
    if (lowerMessage.includes('extension') || lowerMessage.includes('extend')) {
      return this.getExtensionGuidance(context);
    }
    
    if (lowerMessage.includes('loft') || lowerMessage.includes('dormer')) {
      return this.getLoftGuidance(context);
    }
    
    if (lowerMessage.includes('basement')) {
      return this.getBasementGuidance(context);
    }
    
    // General response
    return `## How Can I Help?

I'm your planning and heritage advisor for North West London. I can help you with:

### 🏠 Project Feasibility
- Check if your project is allowed
- Understand what permissions you need
- Estimate approval chances

### 📋 Planning Guidance
- Permitted development rules
- Conservation area restrictions
- Listed building requirements

### 💰 Costs & ROI
- Project cost estimates
- Value added calculations
- Professional fee guidance

### 📝 Documents & Applications
- Heritage statements
- Design & access statements
- Planning application guidance

${context ? `\nI can see you're looking at **${context.address}** (${context.heritageStatus === 'RED' ? 'Listed Building' : context.heritageStatus === 'AMBER' ? 'Conservation Area' : 'Standard Planning'}).` : '\n**Tip:** Check a property first to get personalized advice!'}

What would you like to know?`;
  }
  
  private getExtensionGuidance(context?: PropertyContext): string {
    const isRestricted = context?.heritageStatus !== 'GREEN';
    
    return `## Rear Extension Guide${context ? ` for ${context.address}` : ''}

### Permitted Development Limits
${isRestricted ? '⚠️ **Conservation Area/Listed Building restrictions may apply**\n' : ''}
| Property Type | Single Storey | Double Storey |
|--------------|---------------|---------------|
| Detached | 4m (8m with prior approval) | 3m depth |
| Semi-detached | 3m (6m with prior approval) | 3m depth |
| Terraced | 3m (6m with prior approval) | 3m depth |

### Height Limits
- Single storey: Max 4m height
- Within 2m of boundary: Max 3m to eaves
- Double storey: Max 7m to ridge

### Typical Costs (NW London)
| Type | Budget | Mid-range | Premium |
|------|--------|-----------|---------|
| Single storey (15-20sqm) | £35-50k | £50-75k | £75-100k |
| Double storey (25-35sqm) | £60-80k | £80-120k | £120-180k |

### Value Added
Extensions in NW London typically add **1.2-1.5x their cost** in property value.

${context?.heritageStatus === 'RED' ? '\n⚠️ **Listed Building:** You will need Listed Building Consent. Focus on high-quality, reversible design that respects the original building.' : ''}
${context?.heritageStatus === 'AMBER' ? '\n📋 **Conservation Area:** Design must preserve or enhance the area\'s character. Use appropriate materials.' : ''}

Would you like a detailed cost estimate or to check approval likelihood?`;
  }
  
  private getLoftGuidance(context?: PropertyContext): string {
    return `## Loft Conversion Guide${context ? ` for ${context.address}` : ''}

### Permitted Development Volume
| Property Type | Max Additional Volume |
|--------------|----------------------|
| Terraced house | 40 cubic metres |
| Semi-detached | 50 cubic metres |
| Detached | 50 cubic metres |

### Key Requirements
- Must not exceed highest part of existing roof
- Materials should be similar in appearance
- Side windows: obscure glazed, non-opening below 1.7m
- No balconies or raised platforms

### Conversion Types
| Type | Description | Cost Range | Best For |
|------|-------------|------------|----------|
| Velux/Rooflight | Windows in existing roof slope | £25-40k | Budget option |
| Rear Dormer | Box extension at rear | £45-65k | Maximum headroom |
| Hip-to-Gable | Extend roof at side | £55-75k | Semi-detached |
| Mansard | Replace roof slope | £70-100k | Maximum space |

### ROI in NW London
Loft conversions typically offer **15-25% property value increase** - often the best ROI of any home improvement.

${context?.heritageStatus === 'RED' ? '\n⚠️ **Listed Building:** Loft conversions can be challenging. Focus on rooflights rather than dormers, and expect extensive LBC requirements.' : ''}
${context?.heritageStatus === 'AMBER' ? '\n📋 **Conservation Area:** Front-facing dormers usually refused. Rear dormers generally acceptable with good design.' : ''}

Would you like to calculate the ROI for your specific property?`;
  }
  
  private getBasementGuidance(context?: PropertyContext): string {
    return `## Basement Extension Guide${context ? ` for ${context.address}` : ''}

### Overview
Basement extensions are **major projects** that require planning permission in most London boroughs.

### Camden Council Policy
- Maximum 50% of garden can be used
- Single storey basements only
- Must not harm trees or neighbor amenity
- Structural method statement required

### Typical Costs
| Size | Budget | Mid-range | Premium |
|------|--------|-----------|---------|
| Small (30sqm) | £120-150k | £150-200k | £200-300k |
| Medium (50sqm) | £180-250k | £250-350k | £350-500k |
| Large (80sqm+) | £300-400k | £400-600k | £600k+ |

**Note:** These are all-in costs including professionals, party wall, and finishing.

### Timeline
- Planning: 8-13 weeks
- Party wall: 6-10 weeks (can run parallel)
- Construction: 6-12 months
- **Total: 9-15 months**

### Value Added
In prime NW London (NW3, NW8), basements can add **£2,000-3,000 per sqft** to property value.

${context?.heritageStatus === 'RED' ? '\n⚠️ **Listed Building:** Basement excavation under listed buildings is highly complex and often refused. Seek specialist advice early.' : ''}

### Party Wall
Basement works almost always require party wall agreements with neighbors. Budget £3,000-6,000 per neighbor.

Would you like to find a basement specialist or get a detailed cost estimate?`;
  }
  
  /**
   * Create a new chat session
   */
  createSession(propertyContext?: PropertyContext): CopilotSession {
    return {
      id: `session-${Date.now()}`,
      messages: [],
      propertyContext,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  /**
   * Get conversation starters based on context
   */
  getConversationStarters(context?: PropertyContext): string[] {
    if (context?.heritageStatus === 'RED') {
      return [
        'What can I change in my listed building?',
        'Do I need consent for internal alterations?',
        'How do I find a heritage architect?',
        'What are the chances of getting approval for an extension?',
      ];
    }
    
    if (context?.heritageStatus === 'AMBER') {
      return [
        'What are the Article 4 restrictions here?',
        'Can I extend my house without permission?',
        'What design features are expected in this conservation area?',
        'How do I check what my neighbors have done?',
      ];
    }
    
    return [
      'What can I build on my property?',
      'How much does a loft conversion cost?',
      'What\'s the best project for ROI?',
      'Do I need planning permission for an extension?',
    ];
  }
  
  /**
   * Get suggested questions based on topic
   */
  getSuggestedQuestions(
    topic?: 'listed_buildings' | 'conservation' | 'article_4' | 'permitted_development' | 'general'
  ): string[] {
    const questions: Record<string, string[]> = {
      listed_buildings: [
        'What alterations need listed building consent?',
        'Can I replace windows in a listed building?',
        'How do I apply for listed building consent?',
        'What happens if I do work without consent?',
      ],
      conservation: [
        'What restrictions apply in conservation areas?',
        'Do I need permission to change my front door?',
        'Can I install solar panels?',
        'What design guidance should I follow?',
      ],
      article_4: [
        'What rights have been removed?',
        'Can I still extend under permitted development?',
        'How do I find out what Article 4 covers?',
        'When did the Article 4 direction come into force?',
      ],
      permitted_development: [
        'How far can I extend without planning permission?',
        'What are the height limits for extensions?',
        'Can I convert my loft without permission?',
        'Do I need prior approval for a larger home extension?',
      ],
      general: [
        'Do I need planning permission for my project?',
        'How long does planning approval take?',
        'What are my chances of approval?',
        'How much does planning cost?',
      ],
    };
    
    return questions[topic ?? 'general'] ?? questions['general'] ?? [];
  }
}

// Export singleton
export const aiCopilot = new AICopilotService();

// Export types
export type { Intent };
