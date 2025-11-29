/**
 * Planning Copilot AI Service
 * 
 * Enhanced AI assistant for planning queries with context awareness,
 * multi-turn conversations, and integration with all planning services.
 */

import { analyticsEngine } from './analytics-engine';
import { streetPrecedentService } from './street-precedents';

// Types
interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    sources?: string[];
    confidence?: number;
    suggestedActions?: SuggestedAction[];
    relatedData?: unknown;
  };
}

interface SuggestedAction {
  type: 'check_property' | 'view_precedents' | 'estimate_cost' | 'find_professional' | 'track_application' | 'learn_more';
  label: string;
  description: string;
  params?: Record<string, unknown>;
}

interface ConversationContext {
  sessionId: string;
  userId?: string;
  messages: ConversationMessage[];
  extractedEntities: ExtractedEntities;
  currentTopic?: string;
  lastUpdated: Date;
}

interface ExtractedEntities {
  addresses: string[];
  postcodes: string[];
  projectTypes: string[];
  professionals: string[];
  dates: string[];
  costs: string[];
  areas: string[];
}

interface CopilotResponse {
  message: string;
  confidence: number;
  sources: string[];
  suggestedActions: SuggestedAction[];
  followUpQuestions: string[];
  relatedData?: unknown;
}

// Knowledge base for planning topics
const PLANNING_KNOWLEDGE = {
  permitted_development: {
    keywords: ['permitted development', 'pd rights', 'without planning', 'do i need permission', 'allowed without'],
    content: `
## Permitted Development Rights in Heritage Areas

In conservation areas and Article 4 areas (like much of Hampstead), many normal permitted development rights are REMOVED.

### What's typically restricted:
- **Extensions**: Rear extensions limited to 3m (single storey) vs 6m elsewhere
- **Roof alterations**: Dormers and roof extensions often need permission
- **Materials**: Changing external materials usually needs approval
- **Windows**: Replacing windows (especially uPVC) often requires consent
- **Cladding**: Any external cladding typically needs permission
- **Satellite dishes**: Front-facing dishes usually need approval

### What's usually still permitted:
- Internal alterations (unless listed building)
- Minor repairs like-for-like
- Some garden structures under size limits
- Solar panels on rear-facing roofs

### Always check:
1. Conservation area status
2. Listed building status  
3. Article 4 directions
4. Tree preservation orders

Use our property checker to verify your specific situation.
    `
  },
  
  conservation_areas: {
    keywords: ['conservation area', 'hampstead village', 'protected area', 'heritage area', 'ca consent'],
    content: `
## Conservation Areas in NW London

Conservation areas are places of special architectural or historic interest, where the character must be preserved or enhanced.

### Key Conservation Areas in our coverage:
- **Hampstead Conservation Area**: One of London's largest, covering most of NW3
- **Highgate Conservation Area**: Historic village character in N6
- **Belsize Park Conservation Area**: Victorian and Edwardian character
- **South Hampstead Conservation Area**: NW6 residential streets
- **St John's Wood Conservation Area**: NW8 villa estates

### What this means for planning:
- **Higher scrutiny**: Applications are assessed more carefully
- **Design requirements**: New work must preserve or enhance character
- **Materials**: Traditional materials often required
- **Trees**: Extra protection for trees
- **Demolition**: Needs Conservation Area Consent
- **Article 4**: Many have Article 4 restrictions removing PD rights

### Tips for success:
1. Research the character appraisal for your area
2. Use traditional materials and designs
3. Get pre-application advice
4. Commission a heritage statement
5. Study nearby approved applications
    `
  },
  
  listed_buildings: {
    keywords: ['listed building', 'grade i', 'grade ii', 'grade ii*', 'lbc', 'listed building consent'],
    content: `
## Listed Buildings

Listed buildings are nationally protected for their special architectural or historic interest.

### Grades:
- **Grade I**: Exceptional interest (2% of listings)
- **Grade II***: Particularly important (5.8%)
- **Grade II**: National importance (91.7%)

### What needs consent:
Listed Building Consent is needed for ANY works affecting:
- The building's character as a building of special interest
- Both exterior AND interior alterations
- Even minor works like replacing windows, painting, or rewiring

### The process:
1. **Pre-application advice**: Strongly recommended
2. **Heritage statement**: Required for all applications
3. **Consultation**: Historic England consulted for Grade I & II*
4. **Decision**: Usually 8-13 weeks
5. **Conditions**: Often include supervision and recording

### Penalties:
Unauthorized works to listed buildings is a criminal offense with:
- Unlimited fines
- Up to 2 years imprisonment
- Requirement to reverse changes
    `
  },
  
  basements: {
    keywords: ['basement', 'cellar', 'underground', 'excavation', 'subterranean', 'iceberg'],
    content: `
## Basement Extensions in Heritage Areas

Basement developments have become increasingly restricted in Camden and other boroughs.

### Camden's Basement Policy (CPG4):
- **Maximum depth**: Single storey (typically 3m floor to ceiling)
- **Footprint**: Cannot exceed 50% of garden
- **Lightwells**: Limited to 1.5m from boundary
- **Trees**: Must protect all significant trees
- **Construction Management Plan**: Required
- **Party Wall**: Agreements needed with neighbors

### Heritage considerations:
- Impact on water table and drainage
- Effect on neighboring properties
- Visual impact of lightwells
- Garden character preservation
- Archaeological implications

### Required submissions:
1. Structural methodology statement
2. Construction management plan
3. Hydrological/drainage assessment
4. Tree survey and protection plan
5. Heritage impact assessment (if in CA)

### Typical timeline:
- Pre-app advice: 4-6 weeks
- Application determination: 8-13 weeks
- Construction: 12-18 months
    `
  },
  
  extensions: {
    keywords: ['extension', 'rear extension', 'side extension', 'wraparound', 'single storey', 'double storey'],
    content: `
## Extensions in Heritage Areas

Extensions are the most common type of planning application in residential areas.

### Types of extensions:
- **Rear extensions**: Most common, often single storey
- **Side extensions**: Must respect building line and gaps between houses
- **Wraparound**: Combination of rear and side
- **Double storey**: Higher scrutiny, affects neighbors more

### Key design considerations:
1. **Subordination**: Extensions should be clearly subordinate to main house
2. **Roof design**: Flat roofs common for single storey, pitched for double
3. **Materials**: Must match or complement existing
4. **Boundaries**: Typically 1m from boundary minimum
5. **Height**: Must not exceed existing eaves/ridge

### In conservation areas:
- Higher design standards apply
- May need traditional materials (no uPVC)
- Roof materials must match existing
- Impact on streetscape considered

### Typical sizes approved:
- Single storey rear: 3-4m depth
- Double storey rear: 2.5-3m depth
- Side extensions: Set back 1m from front
    `
  },
  
  loft_conversions: {
    keywords: ['loft', 'dormer', 'rooflight', 'mansard', 'hip to gable', 'roof extension'],
    content: `
## Loft Conversions in Heritage Areas

Loft conversions are popular but face significant restrictions in conservation areas.

### Types of loft conversions:
- **Rooflights only**: Minimal impact, often permitted
- **Rear dormer**: Most common approved type
- **L-shaped dormer**: Larger but more scrutinized
- **Hip to gable**: Changes roof profile significantly
- **Mansard**: Creates new storey, highly restricted

### Conservation area requirements:
- Dormers usually only permitted on rear elevations
- Must be set back from parapet by minimum 500mm
- Set in from party walls by minimum 200mm
- Conservation-style rooflights (slim profile, flush fitting)
- Materials must match existing roof

### Design principles:
1. Keep dormers subordinate to roof slope
2. Match window proportions to existing house
3. Use traditional materials (lead, zinc, tile hanging)
4. Avoid box dormers on Victorian/Edwardian properties
5. No front-facing dormers in most conservation areas

### What to include in application:
- Existing and proposed roof plans
- Elevations showing all changes
- Street scene drawing
- Materials specification
- Heritage statement
    `
  },
  
  costs: {
    keywords: ['cost', 'price', 'budget', 'how much', 'expensive', 'fee', 'afford'],
    content: `
## Planning Application Costs

Understanding the full costs helps you budget effectively.

### Application fees (2024):
- **Householder applications**: £258
- **Listed Building Consent**: £0 (free)
- **Full planning permission**: £578 per dwelling
- **Change of use**: £578
- **Prior approval**: £120

### Professional fees:
- **Architect drawings**: £1,500 - £5,000
- **Planning consultant**: £500 - £2,000
- **Heritage statement**: £500 - £1,500
- **Tree survey**: £300 - £800
- **Structural engineer**: £500 - £2,000

### Pre-application advice:
- Camden: £200 (householder), £400 (minor)
- Westminster: £250 - £500
- Barnet: £180 - £360

### Construction costs (per sqm):
- Basic extension: £2,000 - £2,500
- High-end extension: £3,000 - £4,000
- Basement: £4,000 - £6,000
- Loft conversion: £1,500 - £2,500

### Tips to reduce costs:
1. Get pre-app advice to avoid refusals
2. Use our precedent search to inform design
3. Compare multiple architect quotes
4. Consider phased construction
    `
  },
  
  timelines: {
    keywords: ['how long', 'timeline', 'weeks', 'decision', 'determination', 'waiting time'],
    content: `
## Planning Application Timelines

Understanding timelines helps manage your project schedule.

### Statutory determination periods:
- **Householder applications**: 8 weeks
- **Minor applications**: 8 weeks
- **Major applications**: 13 weeks
- **Listed Building Consent**: 8 weeks (13 if Grade I/II*)

### Typical actual timelines (Camden):
- Householder: 8-12 weeks
- Listed building: 10-16 weeks
- Basements: 12-16 weeks
- Major schemes: 16-26 weeks

### What affects timing:
- **Validation delays**: Incomplete applications add 1-4 weeks
- **Amendments**: Each iteration adds 2-4 weeks
- **Committee referral**: Adds 4-8 weeks
- **S106 agreements**: Adds weeks to months
- **Extensions of time**: Officer may request

### Pre-application timelines:
- Written advice: 4-6 weeks
- Meeting included: 6-8 weeks
- Complex schemes: 8-12 weeks

### Tips to speed up:
1. Submit complete applications
2. Address officer concerns promptly
3. Get pre-app to identify issues early
4. Use planning agent for complex cases
    `
  },
  
  appeals: {
    keywords: ['appeal', 'refused', 'refusal', 'overturn', 'planning inspector', 'pins'],
    content: `
## Planning Appeals

If your application is refused or not determined in time, you can appeal.

### Appeal routes:
- **Written representations**: Most common, 8-12 weeks
- **Hearing**: For complex cases, 16-20 weeks
- **Inquiry**: Major/controversial cases, months

### Appeal deadlines:
- Householder: 12 weeks from decision
- Other applications: 6 months from decision
- Non-determination: 6 months from statutory deadline

### Success rates:
- Householder appeals: ~35% allowed
- Full planning appeals: ~30% allowed
- Listed building appeals: ~25% allowed

### When to appeal:
- Clear policy support for your proposal
- Similar schemes approved elsewhere
- Officer recommendation was for approval
- Refusal reasons are challengeable

### When NOT to appeal:
- Fundamental design issues
- Strong neighbor objection sustained
- Listed building character concerns
- You can submit improved scheme

### Appeal costs:
- DIY: Free
- Agent prepared: £1,000 - £3,000
- With professional witnesses: £5,000+
    `
  }
};

// Intent classification patterns
const INTENT_PATTERNS: Array<{
  pattern: RegExp;
  intent: string;
  confidence: number;
}> = [
  { pattern: /can i|am i allowed|do i need|is it possible/i, intent: 'permitted_check', confidence: 0.9 },
  { pattern: /how much|cost|price|budget|expensive/i, intent: 'cost_inquiry', confidence: 0.9 },
  { pattern: /how long|timeline|when|weeks/i, intent: 'timeline_inquiry', confidence: 0.9 },
  { pattern: /refused|rejected|appeal/i, intent: 'appeal_inquiry', confidence: 0.85 },
  { pattern: /check.*(property|address|postcode)/i, intent: 'property_check', confidence: 0.95 },
  { pattern: /find.*(builder|architect|professional)/i, intent: 'find_professional', confidence: 0.9 },
  { pattern: /precedent|similar|approved.*(street|nearby)/i, intent: 'precedent_search', confidence: 0.9 },
  { pattern: /conservation area/i, intent: 'conservation_info', confidence: 0.85 },
  { pattern: /listed building/i, intent: 'listed_building_info', confidence: 0.85 },
  { pattern: /basement|cellar|underground/i, intent: 'basement_info', confidence: 0.85 },
  { pattern: /extension|extend/i, intent: 'extension_info', confidence: 0.8 },
  { pattern: /loft|dormer|rooflight/i, intent: 'loft_info', confidence: 0.85 },
  { pattern: /permitted development|pd rights/i, intent: 'pd_info', confidence: 0.9 },
];

class PlanningCopilot {
  private conversations: Map<string, ConversationContext> = new Map();
  
  /**
   * Process a user message and generate a response
   */
  async chat(params: {
    sessionId: string;
    message: string;
    userId?: string;
    context?: {
      postcode?: string;
      projectType?: string;
      address?: string;
    };
  }): Promise<CopilotResponse> {
    const { sessionId, message, userId, context } = params;
    
    // Get or create conversation context
    let conversation = this.conversations.get(sessionId);
    if (!conversation) {
      conversation = this.createNewConversation(sessionId, userId);
    }
    
    // Add user message
    this.addMessage(conversation, 'user', message);
    
    // Extract entities from message
    this.extractEntities(conversation, message);
    if (context?.postcode) {
      conversation.extractedEntities.postcodes.push(context.postcode);
    }
    
    // Classify intent
    const intent = this.classifyIntent(message);
    
    // Generate response based on intent
    const response = await this.generateResponse(conversation, message, intent, context);
    
    // Add assistant message
    this.addMessage(conversation, 'assistant', response.message, {
      sources: response.sources,
      confidence: response.confidence,
      suggestedActions: response.suggestedActions
    });
    
    // Save conversation
    conversation.lastUpdated = new Date();
    this.conversations.set(sessionId, conversation);
    
    return response;
  }
  
  /**
   * Get conversation history
   */
  getConversation(sessionId: string): ConversationContext | undefined {
    return this.conversations.get(sessionId);
  }
  
  /**
   * Clear conversation
   */
  clearConversation(sessionId: string): boolean {
    return this.conversations.delete(sessionId);
  }
  
  /**
   * Get suggested questions based on context
   */
  getSuggestedQuestions(context?: {
    postcode?: string;
    projectType?: string;
    isConservationArea?: boolean;
    isListedBuilding?: boolean;
  }): string[] {
    const questions: string[] = [];
    
    if (context?.isConservationArea) {
      questions.push(
        'What can I do without planning permission in a conservation area?',
        'What materials are acceptable for extensions here?'
      );
    }
    
    if (context?.isListedBuilding) {
      questions.push(
        'What works need Listed Building Consent?',
        'Can I replace windows in a listed building?'
      );
    }
    
    if (context?.projectType === 'extension') {
      questions.push(
        'How deep can my rear extension be?',
        'Do I need to match existing materials?'
      );
    }
    
    if (context?.projectType === 'loft') {
      questions.push(
        'Can I have a front dormer?',
        'What type of rooflights are allowed?'
      );
    }
    
    // Default questions
    questions.push(
      'What planning applications have been approved on my street?',
      'How long will the planning process take?',
      'How much will it cost to submit a planning application?',
      'Should I get pre-application advice?'
    );
    
    return questions.slice(0, 5);
  }
  
  // Private methods
  
  private createNewConversation(sessionId: string, userId?: string): ConversationContext {
    return {
      sessionId,
      userId,
      messages: [],
      extractedEntities: {
        addresses: [],
        postcodes: [],
        projectTypes: [],
        professionals: [],
        dates: [],
        costs: [],
        areas: []
      },
      lastUpdated: new Date()
    };
  }
  
  private addMessage(
    conversation: ConversationContext,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: ConversationMessage['metadata']
  ): void {
    conversation.messages.push({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      metadata
    });
    
    // Keep only last 20 messages
    if (conversation.messages.length > 20) {
      conversation.messages = conversation.messages.slice(-20);
    }
  }
  
  private extractEntities(conversation: ConversationContext, message: string): void {
    // Extract postcodes
    const postcodePattern = /\b(NW[1-9]|NW1[01]|N[1-9]|N1[0-9]|N20?)\s*\d[A-Z]{2}\b/gi;
    const postcodes = message.match(postcodePattern) || [];
    conversation.extractedEntities.postcodes.push(...postcodes);
    
    // Extract project types
    const projectTypes = ['extension', 'loft', 'basement', 'dormer', 'conversion'];
    for (const type of projectTypes) {
      if (message.toLowerCase().includes(type)) {
        conversation.extractedEntities.projectTypes.push(type);
      }
    }
    
    // Extract costs/prices
    const costPattern = /£[\d,]+/g;
    const costs = message.match(costPattern) || [];
    conversation.extractedEntities.costs.push(...costs);
    
    // Deduplicate
    conversation.extractedEntities.postcodes = Array.from(new Set(conversation.extractedEntities.postcodes));
    conversation.extractedEntities.projectTypes = Array.from(new Set(conversation.extractedEntities.projectTypes));
  }
  
  private classifyIntent(message: string): { intent: string; confidence: number } {
    let bestMatch = { intent: 'general_inquiry', confidence: 0.5 };
    
    for (const { pattern, intent, confidence } of INTENT_PATTERNS) {
      if (pattern.test(message)) {
        if (confidence > bestMatch.confidence) {
          bestMatch = { intent, confidence };
        }
      }
    }
    
    return bestMatch;
  }
  
  private async generateResponse(
    conversation: ConversationContext,
    message: string,
    intent: { intent: string; confidence: number },
    context?: Record<string, unknown>
  ): Promise<CopilotResponse> {
    const { intent: intentType } = intent;
    
    // Get postcode from context or conversation
    const postcode = (context ? context['postcode'] as string : undefined) || 
                     conversation.extractedEntities.postcodes[0] ||
                     undefined;
    
    // Find relevant knowledge base content
    let knowledgeContent = '';
    let sources: string[] = [];
    
    for (const [key, knowledge] of Object.entries(PLANNING_KNOWLEDGE)) {
      if (knowledge.keywords.some(kw => message.toLowerCase().includes(kw))) {
        knowledgeContent += knowledge.content + '\n\n';
        sources.push(`Planning guidance: ${key.replace(/_/g, ' ')}`);
      }
    }
    
    // Generate base response
    let responseMessage = '';
    const suggestedActions: SuggestedAction[] = [];
    const followUpQuestions: string[] = [];
    let relatedData: unknown;
    
    switch (intentType) {
      case 'property_check':
        responseMessage = this.generatePropertyCheckResponse(postcode);
        if (postcode) {
          suggestedActions.push({
            type: 'check_property',
            label: 'Check Property Status',
            description: `Check heritage status for ${postcode}`,
            params: { postcode }
          });
        }
        followUpQuestions.push(
          'What type of project are you planning?',
          'Would you like to see what others have built nearby?'
        );
        break;
        
      case 'cost_inquiry':
        responseMessage = this.generateCostResponse(message, conversation);
        sources.push('Planning fee schedule 2024', 'Construction cost index');
        suggestedActions.push({
          type: 'estimate_cost',
          label: 'Get Detailed Estimate',
          description: 'Use our cost calculator for a personalized estimate',
          params: {}
        });
        followUpQuestions.push(
          'What size is your proposed extension?',
          'Would you like to find builders with quotes?'
        );
        break;
        
      case 'timeline_inquiry':
        responseMessage = this.generateTimelineResponse(message);
        sources.push('Camden planning statistics 2024', 'Government planning targets');
        followUpQuestions.push(
          'Do you have your documents ready to submit?',
          'Would you like to track an existing application?'
        );
        break;
        
      case 'precedent_search':
        responseMessage = await this.generatePrecedentResponse(postcode, conversation);
        if (postcode) {
          suggestedActions.push({
            type: 'view_precedents',
            label: 'View Street Precedents',
            description: 'See approved applications on your street',
            params: { postcode }
          });
        }
        sources.push('Camden planning portal', 'Local application database');
        followUpQuestions.push(
          'What type of development are you interested in?',
          'Would you like design guidance based on approvals?'
        );
        break;
        
      case 'find_professional':
        responseMessage = this.generateProfessionalResponse(message);
        suggestedActions.push({
          type: 'find_professional',
          label: 'Browse Professionals',
          description: 'Find verified architects and builders in your area',
          params: {}
        });
        sources.push('Professional directory', 'Review database');
        break;
        
      default:
        // Use knowledge base content if available
        if (knowledgeContent) {
          responseMessage = this.summarizeKnowledge(knowledgeContent, message);
        } else {
          responseMessage = this.generateGeneralResponse(message, conversation);
        }
        
        // Always suggest property check if no postcode known
        if (!postcode) {
          suggestedActions.push({
            type: 'check_property',
            label: 'Check Your Property',
            description: 'Enter your postcode to get specific guidance',
            params: {}
          });
        }
    }
    
    // Add follow-up questions based on context
    if (followUpQuestions.length === 0) {
      followUpQuestions.push(...this.getSuggestedQuestions({
        postcode,
        projectType: conversation.extractedEntities.projectTypes[0]
      }));
    }
    
    return {
      message: responseMessage,
      confidence: intent.confidence,
      sources: Array.from(new Set(sources)).slice(0, 5),
      suggestedActions,
      followUpQuestions: followUpQuestions.slice(0, 3),
      relatedData
    };
  }
  
  private generatePropertyCheckResponse(postcode?: string): string {
    if (postcode) {
      return `I can help you check the planning status for ${postcode}. ` +
             `This will tell you if your property is in a conservation area, ` +
             `listed building, or subject to Article 4 restrictions. ` +
             `Click "Check Property Status" to see the full details.`;
    }
    
    return `To give you accurate advice, I need to know where your property is located. ` +
           `Please enter your postcode or full address, and I'll check:\n\n` +
           `• Conservation area status\n` +
           `• Listed building status\n` +
           `• Article 4 restrictions\n` +
           `• Local planning policies\n\n` +
           `This will help me give you specific guidance for your situation.`;
  }
  
  private generateCostResponse(message: string, conversation: ConversationContext): string {
    const projectType = conversation.extractedEntities.projectTypes[0] || 'extension';
    
    return `Here's a guide to planning and construction costs for a ${projectType}:\n\n` +
           `**Planning Application Costs:**\n` +
           `• Householder application fee: £258\n` +
           `• Pre-application advice: £200-400\n` +
           `• Architect drawings: £1,500-5,000\n` +
           `• Planning consultant: £500-2,000\n\n` +
           `**Construction Costs (typical £/sqm):**\n` +
           `• Basic quality: £2,000-2,500\n` +
           `• Mid-range: £2,500-3,500\n` +
           `• High-end: £3,500-5,000\n\n` +
           `For a personalized estimate, use our cost calculator which factors in ` +
           `your specific location, property type, and heritage constraints.`;
  }
  
  private generateTimelineResponse(message: string): string {
    return `**Typical Planning Timelines:**\n\n` +
           `📋 **Application Preparation:** 2-6 weeks\n` +
           `Depends on complexity and whether you need surveys\n\n` +
           `⏱️ **Determination Period:**\n` +
           `• Householder applications: 8 weeks\n` +
           `• Listed building consent: 8-13 weeks\n` +
           `• Major applications: 13 weeks\n\n` +
           `📊 **Actual Averages (Camden):**\n` +
           `• Simple extensions: 8-10 weeks\n` +
           `• Loft conversions: 9-12 weeks\n` +
           `• Basements: 12-16 weeks\n\n` +
           `**Tips to speed up your application:**\n` +
           `1. Submit complete documentation\n` +
           `2. Get pre-application advice first\n` +
           `3. Address any heritage requirements upfront\n` +
           `4. Respond quickly to officer queries`;
  }
  
  private async generatePrecedentResponse(postcode: string | undefined, conversation: ConversationContext): Promise<string> {
    if (!postcode) {
      return `To show you relevant precedents, I need your postcode or street name. ` +
             `I can then show you:\n\n` +
             `• What's been approved on your street\n` +
             `• Similar projects nearby\n` +
             `• Common refusal reasons to avoid\n` +
             `• Design guidance based on approvals\n\n` +
             `Please enter your address or postcode to see local precedents.`;
    }
    
    // Would call precedent service here in production
    return `I can show you planning precedents near ${postcode}. ` +
           `This includes applications on your street and nearby that have been:\n\n` +
           `✅ Approved - with conditions and designs that worked\n` +
           `❌ Refused - with reasons to learn from\n\n` +
           `Click "View Street Precedents" to see the full analysis, including:\n` +
           `• Approval rates by project type\n` +
           `• Common materials used successfully\n` +
           `• Design features that get approved`;
  }
  
  private generateProfessionalResponse(message: string): string {
    const professional = message.toLowerCase().includes('architect') ? 'architect' :
                        message.toLowerCase().includes('builder') ? 'builder' :
                        'professional';
    
    return `I can help you find verified ${professional}s with experience in heritage areas.\n\n` +
           `Our directory includes:\n` +
           `• **Architects** specializing in conservation area design\n` +
           `• **Heritage consultants** for listed buildings\n` +
           `• **Builders** experienced with heritage projects\n` +
           `• **Planning consultants** to navigate complex applications\n\n` +
           `All professionals have verified reviews and project portfolios. ` +
           `Click "Browse Professionals" to search by location, specialty, and budget.`;
  }
  
  private summarizeKnowledge(content: string, question: string): string {
    // Simple extraction - would use AI summarization in production
    const lines = content.split('\n').filter(line => line.trim());
    const relevantLines: string[] = [];
    
    // Find most relevant sections
    let currentSection = '';
    for (const line of lines) {
      if (line.startsWith('##')) {
        currentSection = line;
      }
      
      // Check if line might answer the question
      const questionWords = question.toLowerCase().split(/\s+/);
      const lineWords = line.toLowerCase();
      const matches = questionWords.filter(w => w.length > 3 && lineWords.includes(w));
      
      if (matches.length > 0) {
        if (currentSection && !relevantLines.includes(currentSection)) {
          relevantLines.push(currentSection);
        }
        relevantLines.push(line);
      }
    }
    
    if (relevantLines.length > 0) {
      return relevantLines.slice(0, 12).join('\n');
    }
    
    // Return first few meaningful lines
    return lines.slice(0, 10).join('\n');
  }
  
  private generateGeneralResponse(message: string, conversation: ConversationContext): string {
    return `I'm here to help with your planning questions. I can assist with:\n\n` +
           `🏠 **Property Checks** - Conservation area, listed building status\n` +
           `📋 **Applications** - What you need, how to apply\n` +
           `💷 **Costs** - Fees, professional costs, construction estimates\n` +
           `⏱️ **Timelines** - How long things take\n` +
           `📊 **Precedents** - What's been approved nearby\n` +
           `👷 **Professionals** - Find architects, builders, consultants\n\n` +
           `What would you like to know about?`;
  }
}

export const planningCopilot = new PlanningCopilot();

export type {
  ConversationMessage,
  ConversationContext,
  CopilotResponse,
  SuggestedAction
};
