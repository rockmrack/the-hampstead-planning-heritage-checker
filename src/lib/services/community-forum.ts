/**
 * Community Forum Service
 * 
 * Powers community features for planning discussions:
 * - Neighborhood forums
 * - Planning application discussions
 * - Q&A with local experts
 * - Success story sharing
 * - Tips and advice threads
 */

// Types
export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'resident' | 'professional' | 'officer' | 'expert';
  title: string;
  content: string;
  category: ForumCategory;
  tags: string[];
  area: string; // NW3, NW5, etc.
  relatedAddress?: string;
  relatedApplicationId?: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  isPinned: boolean;
  isLocked: boolean;
  status: 'active' | 'archived' | 'moderated';
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorType: 'resident' | 'professional' | 'officer' | 'expert';
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  isAcceptedAnswer: boolean;
  parentReplyId?: string;
}

export type ForumCategory = 
  | 'general'
  | 'planning_advice'
  | 'application_discussion'
  | 'success_stories'
  | 'conservation_areas'
  | 'listed_buildings'
  | 'extensions'
  | 'loft_conversions'
  | 'basements'
  | 'new_builds'
  | 'professional_recommendations'
  | 'council_feedback'
  | 'appeals'
  | 'enforcement';

export interface ForumSearchParams {
  query?: string;
  category?: ForumCategory;
  area?: string;
  authorType?: ForumPost['authorType'];
  sortBy?: 'recent' | 'popular' | 'mostReplies';
  page?: number;
  limit?: number;
}

export interface ForumStats {
  totalPosts: number;
  totalReplies: number;
  activeUsers: number;
  postsToday: number;
  topContributors: {
    userId: string;
    name: string;
    posts: number;
    helpfulReplies: number;
  }[];
  popularTags: {
    tag: string;
    count: number;
  }[];
  areaActivity: {
    area: string;
    posts: number;
    activeDiscussions: number;
  }[];
}

// Sample data for demonstration
const SAMPLE_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    authorName: 'Sarah M.',
    authorType: 'resident',
    title: 'Successfully got planning permission for rear extension in Hampstead Conservation Area',
    content: `After 6 months of working with Camden Council, I'm delighted to share that we finally got approval for our single-storey rear extension at our Victorian terrace in NW3.

Key lessons learned:
1. Pre-application advice was invaluable - £300 well spent
2. Used traditional materials (London stock brick, timber windows)
3. Kept the extension subordinate to the main house
4. Heritage officer was very helpful once we addressed their initial concerns
5. Worked with an architect who specializes in conservation areas

Happy to answer any questions about the process!`,
    category: 'success_stories',
    tags: ['conservation area', 'rear extension', 'hampstead', 'approval'],
    area: 'NW3',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    viewCount: 342,
    likeCount: 28,
    replyCount: 15,
    isPinned: true,
    isLocked: false,
    status: 'active',
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    authorName: 'James L.',
    authorType: 'professional',
    title: 'Tips for loft conversions in NW5 - what officers look for',
    content: `As a local architect with 15 years experience in the Kentish Town area, I wanted to share some insights on what makes loft conversion applications successful here.

Camden officers typically focus on:
- Dormer size and placement (rear only in most cases)
- Materials matching existing roof
- Impact on neighbors' light and privacy
- Streetscape impact (front rooflights only)

The 45-degree rule is strictly applied for neighbor impact.

Feel free to ask specific questions!`,
    category: 'planning_advice',
    tags: ['loft conversion', 'kentish town', 'dormer', 'permitted development'],
    area: 'NW5',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    viewCount: 567,
    likeCount: 45,
    replyCount: 23,
    isPinned: false,
    isLocked: false,
    status: 'active',
  },
  {
    id: 'post-3',
    authorId: 'user-3',
    authorName: 'Planning Help',
    authorType: 'expert',
    title: 'Guide: Basement excavations in Hampstead - what you need to know',
    content: `Basement applications in NW3 are among the most scrutinized in London. Here's a comprehensive guide:

## Key Requirements

1. **Structural Assessment**: Independent engineer report required
2. **Hydrogeological Survey**: Understanding groundwater is critical
3. **Construction Management Plan**: Detailed traffic and noise controls
4. **Neighbor Consultation**: Best to inform neighbors early

## Common Reasons for Refusal
- Impact on trees (especially TPO trees)
- Inadequate flood risk assessment
- Insufficient construction methodology
- Unacceptable impact on neighbor amenity

## Timeline
Typically 13 weeks for major applications, but can extend to 6+ months with negotiations.

## Costs
Budget £2,000-£5,000 for application preparation including surveys.`,
    category: 'planning_advice',
    tags: ['basement', 'hampstead', 'major application', 'surveys'],
    area: 'NW3',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    viewCount: 892,
    likeCount: 67,
    replyCount: 31,
    isPinned: true,
    isLocked: false,
    status: 'active',
  },
];

const SAMPLE_REPLIES: ForumReply[] = [
  {
    id: 'reply-1',
    postId: 'post-1',
    authorId: 'user-4',
    authorName: 'Michael R.',
    authorType: 'resident',
    content: 'Congratulations! How long did the pre-application process take? We\'re thinking of doing something similar in NW3.',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    likeCount: 5,
    isAcceptedAnswer: false,
  },
  {
    id: 'reply-2',
    postId: 'post-1',
    authorId: 'user-1',
    authorName: 'Sarah M.',
    authorType: 'resident',
    content: 'The pre-app took about 6 weeks. We had a site meeting with the heritage officer which was really helpful. I\'d definitely recommend requesting one!',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    likeCount: 8,
    isAcceptedAnswer: true,
    parentReplyId: 'reply-1',
  },
];

// Forum Service Implementation
class CommunityForumService {
  private posts: Map<string, ForumPost> = new Map();
  private replies: Map<string, ForumReply[]> = new Map();

  constructor() {
    // Initialize with sample data
    SAMPLE_POSTS.forEach(post => this.posts.set(post.id, post));
    SAMPLE_REPLIES.forEach(reply => {
      const existing = this.replies.get(reply.postId) || [];
      existing.push(reply);
      this.replies.set(reply.postId, existing);
    });
  }

  /**
   * Search and list forum posts
   */
  async searchPosts(params: ForumSearchParams): Promise<{
    posts: ForumPost[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let filteredPosts = Array.from(this.posts.values());

    // Apply filters
    if (params.category) {
      filteredPosts = filteredPosts.filter(p => p.category === params.category);
    }

    if (params.area) {
      filteredPosts = filteredPosts.filter(p => p.area === params.area);
    }

    if (params.authorType) {
      filteredPosts = filteredPosts.filter(p => p.authorType === params.authorType);
    }

    if (params.query) {
      const query = params.query.toLowerCase();
      filteredPosts = filteredPosts.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (params.sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'mostReplies':
        filteredPosts.sort((a, b) => b.replyCount - a.replyCount);
        break;
      case 'recent':
      default:
        filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Pin posts to top
    filteredPosts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    // Paginate
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const paginatedPosts = filteredPosts.slice(start, start + limit);

    return {
      posts: paginatedPosts,
      total: filteredPosts.length,
      page,
      totalPages: Math.ceil(filteredPosts.length / limit),
    };
  }

  /**
   * Get a single post with replies
   */
  async getPost(postId: string): Promise<{
    post: ForumPost | null;
    replies: ForumReply[];
  }> {
    const post = this.posts.get(postId) || null;
    
    if (post) {
      // Increment view count
      post.viewCount += 1;
      this.posts.set(postId, post);
    }

    const replies = this.replies.get(postId) || [];
    
    // Sort replies by likes (most helpful first) or chronologically
    const sortedReplies = [...replies].sort((a, b) => {
      if (a.isAcceptedAnswer && !b.isAcceptedAnswer) return -1;
      if (!a.isAcceptedAnswer && b.isAcceptedAnswer) return 1;
      return b.likeCount - a.likeCount;
    });

    return {
      post,
      replies: sortedReplies,
    };
  }

  /**
   * Create a new post
   */
  async createPost(data: {
    authorId: string;
    authorName: string;
    authorType: ForumPost['authorType'];
    title: string;
    content: string;
    category: ForumCategory;
    tags: string[];
    area: string;
    relatedAddress?: string;
    relatedApplicationId?: string;
  }): Promise<ForumPost> {
    const now = new Date();
    const post: ForumPost = {
      id: `post-${Date.now()}`,
      ...data,
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
      likeCount: 0,
      replyCount: 0,
      isPinned: false,
      isLocked: false,
      status: 'active',
    };

    this.posts.set(post.id, post);
    return post;
  }

  /**
   * Add a reply to a post
   */
  async addReply(data: {
    postId: string;
    authorId: string;
    authorName: string;
    authorType: ForumReply['authorType'];
    content: string;
    parentReplyId?: string;
  }): Promise<ForumReply> {
    const post = this.posts.get(data.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const now = new Date();
    const reply: ForumReply = {
      id: `reply-${Date.now()}`,
      postId: data.postId,
      authorId: data.authorId,
      authorName: data.authorName,
      authorType: data.authorType,
      content: data.content,
      createdAt: now,
      updatedAt: now,
      likeCount: 0,
      isAcceptedAnswer: false,
      parentReplyId: data.parentReplyId,
    };

    const existingReplies = this.replies.get(data.postId) || [];
    existingReplies.push(reply);
    this.replies.set(data.postId, existingReplies);

    // Update post reply count
    post.replyCount += 1;
    post.updatedAt = now;
    this.posts.set(post.id, post);

    return reply;
  }

  /**
   * Like a post or reply
   */
  async likeContent(type: 'post' | 'reply', id: string): Promise<boolean> {
    if (type === 'post') {
      const post = this.posts.get(id);
      if (post) {
        post.likeCount += 1;
        this.posts.set(id, post);
        return true;
      }
    } else {
      const repliesEntries = Array.from(this.replies.entries());
      for (const [postId, replies] of repliesEntries) {
        const reply = replies.find((r: ForumReply) => r.id === id);
        if (reply) {
          reply.likeCount += 1;
          this.replies.set(postId, replies);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get forum statistics
   */
  async getStats(): Promise<ForumStats> {
    const allPosts = Array.from(this.posts.values());
    const allReplies = Array.from(this.replies.values()).flat();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Area activity
    const areaMap = new Map<string, { posts: number; discussions: number }>();
    for (const post of allPosts) {
      const existing = areaMap.get(post.area) || { posts: 0, discussions: 0 };
      existing.posts += 1;
      if (post.status === 'active' && !post.isLocked) {
        existing.discussions += 1;
      }
      areaMap.set(post.area, existing);
    }

    // Tag counts
    const tagMap = new Map<string, number>();
    for (const post of allPosts) {
      for (const tag of post.tags) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }

    // Top contributors
    const contributorMap = new Map<string, { name: string; posts: number; helpfulReplies: number }>();
    for (const post of allPosts) {
      const existing = contributorMap.get(post.authorId) || { name: post.authorName, posts: 0, helpfulReplies: 0 };
      existing.posts += 1;
      contributorMap.set(post.authorId, existing);
    }
    for (const reply of allReplies) {
      const existing = contributorMap.get(reply.authorId) || { name: reply.authorName, posts: 0, helpfulReplies: 0 };
      if (reply.isAcceptedAnswer || reply.likeCount >= 5) {
        existing.helpfulReplies += 1;
      }
      contributorMap.set(reply.authorId, existing);
    }

    return {
      totalPosts: allPosts.length,
      totalReplies: allReplies.length,
      activeUsers: contributorMap.size,
      postsToday: allPosts.filter(p => p.createdAt >= today).length,
      topContributors: Array.from(contributorMap.entries())
        .map(([userId, data]) => ({ userId, ...data }))
        .sort((a, b) => (b.posts + b.helpfulReplies) - (a.posts + a.helpfulReplies))
        .slice(0, 10),
      popularTags: Array.from(tagMap.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
      areaActivity: Array.from(areaMap.entries())
        .map(([area, data]) => ({ area, posts: data.posts, activeDiscussions: data.discussions }))
        .sort((a, b) => b.posts - a.posts),
    };
  }

  /**
   * Get posts for a specific area
   */
  async getAreaPosts(area: string, limit: number = 10): Promise<ForumPost[]> {
    const result = await this.searchPosts({ area, limit, sortBy: 'recent' });
    return result.posts;
  }

  /**
   * Get trending discussions
   */
  async getTrendingDiscussions(limit: number = 5): Promise<ForumPost[]> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentPosts = Array.from(this.posts.values())
      .filter(p => p.createdAt >= weekAgo && p.status === 'active');
    
    // Score based on views, likes, and replies
    const scored = recentPosts.map(p => ({
      post: p,
      score: p.viewCount * 0.1 + p.likeCount * 2 + p.replyCount * 3,
    }));
    
    scored.sort((a, b) => b.score - a.score);
    
    return scored.slice(0, limit).map(s => s.post);
  }

  /**
   * Get discussions related to a planning application
   */
  async getApplicationDiscussions(applicationId: string): Promise<ForumPost[]> {
    return Array.from(this.posts.values())
      .filter(p => p.relatedApplicationId === applicationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Search for expert answers
   */
  async getExpertAnswers(category?: ForumCategory): Promise<{
    post: ForumPost;
    expertReply: ForumReply;
  }[]> {
    const results: { post: ForumPost; expertReply: ForumReply }[] = [];
    
    const repliesEntries = Array.from(this.replies.entries());
    for (const [postId, replies] of repliesEntries) {
      const expertReplies = replies.filter(
        (r: ForumReply) => (r.authorType === 'expert' || r.authorType === 'professional' || r.authorType === 'officer') &&
             (r.isAcceptedAnswer || r.likeCount >= 5)
      );
      
      if (expertReplies.length > 0 && expertReplies[0]) {
        const post = this.posts.get(postId);
        if (post && (!category || post.category === category)) {
          results.push({
            post,
            expertReply: expertReplies[0],
          });
        }
      }
    }
    
    return results.sort((a, b) => b.expertReply.likeCount - a.expertReply.likeCount);
  }

  /**
   * Get category information
   */
  getCategoryInfo(category: ForumCategory): {
    name: string;
    description: string;
    icon: string;
  } {
    const categories: Record<ForumCategory, { name: string; description: string; icon: string }> = {
      general: {
        name: 'General Discussion',
        description: 'General planning and property development chat',
        icon: '💬',
      },
      planning_advice: {
        name: 'Planning Advice',
        description: 'Get and give advice on planning applications',
        icon: '📋',
      },
      application_discussion: {
        name: 'Application Discussions',
        description: 'Discuss specific planning applications',
        icon: '📄',
      },
      success_stories: {
        name: 'Success Stories',
        description: 'Share your planning wins and lessons learned',
        icon: '🎉',
      },
      conservation_areas: {
        name: 'Conservation Areas',
        description: 'Specific guidance for conservation area properties',
        icon: '🏛️',
      },
      listed_buildings: {
        name: 'Listed Buildings',
        description: 'Advice for listed building owners',
        icon: '🏰',
      },
      extensions: {
        name: 'Extensions',
        description: 'Rear, side, and wraparound extensions',
        icon: '🏠',
      },
      loft_conversions: {
        name: 'Loft Conversions',
        description: 'Dormers, rooflights, and loft spaces',
        icon: '🏗️',
      },
      basements: {
        name: 'Basements',
        description: 'Basement excavations and conversions',
        icon: '⬇️',
      },
      new_builds: {
        name: 'New Builds',
        description: 'New construction projects',
        icon: '🏢',
      },
      professional_recommendations: {
        name: 'Professional Recommendations',
        description: 'Recommend architects, builders, and consultants',
        icon: '👷',
      },
      council_feedback: {
        name: 'Council Feedback',
        description: 'Share experiences with Camden planning officers',
        icon: '🏛️',
      },
      appeals: {
        name: 'Appeals',
        description: 'Planning appeal processes and experiences',
        icon: '⚖️',
      },
      enforcement: {
        name: 'Enforcement',
        description: 'Enforcement notices and compliance',
        icon: '🚨',
      },
    };
    
    return categories[category];
  }

  /**
   * Get all categories
   */
  getAllCategories(): { category: ForumCategory; info: { name: string; description: string; icon: string }; postCount: number }[] {
    const allPosts = Array.from(this.posts.values());
    const categories: ForumCategory[] = [
      'general', 'planning_advice', 'application_discussion', 'success_stories',
      'conservation_areas', 'listed_buildings', 'extensions', 'loft_conversions',
      'basements', 'new_builds', 'professional_recommendations', 'council_feedback',
      'appeals', 'enforcement'
    ];
    
    return categories.map(cat => ({
      category: cat,
      info: this.getCategoryInfo(cat),
      postCount: allPosts.filter(p => p.category === cat).length,
    }));
  }
}

// Export singleton instance
export const communityForumService = new CommunityForumService();
