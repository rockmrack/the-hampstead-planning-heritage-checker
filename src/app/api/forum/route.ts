import { NextRequest, NextResponse } from 'next/server';
import { 
  communityForumService, 
  type ForumSearchParams,
  type ForumCategory 
} from '@/lib/services/community-forum';

export const dynamic = 'force-dynamic';

/**
 * Community Forum API
 * 
 * Endpoints for community discussions about planning:
 * - Browse and search posts
 * - Create discussions
 * - Reply to posts
 * - Get trending topics
 * - Expert Q&A
 */

// GET /api/forum - List/search posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'search';
    
    switch (action) {
      case 'search': {
        const params: ForumSearchParams = {
          query: searchParams.get('q') || undefined,
          category: searchParams.get('category') as ForumCategory || undefined,
          area: searchParams.get('area') || undefined,
          authorType: searchParams.get('authorType') as ForumSearchParams['authorType'] || undefined,
          sortBy: (searchParams.get('sortBy') as ForumSearchParams['sortBy']) || 'recent',
          page: parseInt(searchParams.get('page') || '1', 10),
          limit: parseInt(searchParams.get('limit') || '20', 10),
        };
        
        const results = await communityForumService.searchPosts(params);
        
        return NextResponse.json({
          success: true,
          data: results,
        });
      }
      
      case 'post': {
        const postId = searchParams.get('id');
        if (!postId) {
          return NextResponse.json(
            { success: false, error: 'Post ID is required' },
            { status: 400 }
          );
        }
        
        const result = await communityForumService.getPost(postId);
        
        if (!result.post) {
          return NextResponse.json(
            { success: false, error: 'Post not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: result,
        });
      }
      
      case 'trending': {
        const limit = parseInt(searchParams.get('limit') || '5', 10);
        const trending = await communityForumService.getTrendingDiscussions(limit);
        
        return NextResponse.json({
          success: true,
          data: trending,
        });
      }
      
      case 'stats': {
        const stats = await communityForumService.getStats();
        
        return NextResponse.json({
          success: true,
          data: stats,
        });
      }
      
      case 'categories': {
        const categories = communityForumService.getAllCategories();
        
        return NextResponse.json({
          success: true,
          data: categories,
        });
      }
      
      case 'area': {
        const area = searchParams.get('area');
        if (!area) {
          return NextResponse.json(
            { success: false, error: 'Area is required' },
            { status: 400 }
          );
        }
        
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const posts = await communityForumService.getAreaPosts(area, limit);
        
        return NextResponse.json({
          success: true,
          data: posts,
        });
      }
      
      case 'expert-answers': {
        const category = searchParams.get('category') as ForumCategory || undefined;
        const answers = await communityForumService.getExpertAnswers(category);
        
        return NextResponse.json({
          success: true,
          data: answers,
        });
      }
      
      case 'application': {
        const applicationId = searchParams.get('applicationId');
        if (!applicationId) {
          return NextResponse.json(
            { success: false, error: 'Application ID is required' },
            { status: 400 }
          );
        }
        
        const discussions = await communityForumService.getApplicationDiscussions(applicationId);
        
        return NextResponse.json({
          success: true,
          data: discussions,
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Forum GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch forum data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/forum - Create post or reply
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'createPost';
    
    switch (action) {
      case 'createPost': {
        const { authorId, authorName, authorType, title, content, category, tags, area, relatedAddress, relatedApplicationId } = body;
        
        // Validate required fields
        if (!authorId || !authorName || !title || !content || !category || !area) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Missing required fields: authorId, authorName, title, content, category, area' 
            },
            { status: 400 }
          );
        }
        
        const post = await communityForumService.createPost({
          authorId,
          authorName,
          authorType: authorType || 'resident',
          title,
          content,
          category,
          tags: tags || [],
          area,
          relatedAddress,
          relatedApplicationId,
        });
        
        return NextResponse.json({
          success: true,
          data: post,
        }, { status: 201 });
      }
      
      case 'reply': {
        const { postId, authorId, authorName, authorType, content, parentReplyId } = body;
        
        // Validate required fields
        if (!postId || !authorId || !authorName || !content) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Missing required fields: postId, authorId, authorName, content' 
            },
            { status: 400 }
          );
        }
        
        const reply = await communityForumService.addReply({
          postId,
          authorId,
          authorName,
          authorType: authorType || 'resident',
          content,
          parentReplyId,
        });
        
        return NextResponse.json({
          success: true,
          data: reply,
        }, { status: 201 });
      }
      
      case 'like': {
        const { type, id } = body;
        
        if (!type || !id) {
          return NextResponse.json(
            { success: false, error: 'Type and ID are required' },
            { status: 400 }
          );
        }
        
        const success = await communityForumService.likeContent(type, id);
        
        if (!success) {
          return NextResponse.json(
            { success: false, error: 'Content not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          message: 'Like added',
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Forum POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process forum request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS - API documentation
export async function OPTIONS() {
  return NextResponse.json({
    success: true,
    endpoints: {
      search: {
        method: 'GET',
        path: '/api/forum?action=search',
        params: {
          q: 'Search query (optional)',
          category: 'Forum category (optional)',
          area: 'Area code like NW3 (optional)',
          authorType: 'resident|professional|officer|expert (optional)',
          sortBy: 'recent|popular|mostReplies (optional)',
          page: 'Page number (optional)',
          limit: 'Results per page (optional)'
        }
      },
      getPost: {
        method: 'GET',
        path: '/api/forum?action=post&id={postId}',
      },
      getTrending: {
        method: 'GET',
        path: '/api/forum?action=trending&limit=5',
      },
      getStats: {
        method: 'GET',
        path: '/api/forum?action=stats',
      },
      getCategories: {
        method: 'GET',
        path: '/api/forum?action=categories',
      },
      getAreaPosts: {
        method: 'GET',
        path: '/api/forum?action=area&area=NW3&limit=10',
      },
      getExpertAnswers: {
        method: 'GET',
        path: '/api/forum?action=expert-answers&category=planning_advice',
      },
      createPost: {
        method: 'POST',
        path: '/api/forum',
        body: {
          action: 'createPost',
          authorId: 'string (required)',
          authorName: 'string (required)',
          authorType: 'resident|professional|officer|expert (optional)',
          title: 'string (required)',
          content: 'string (required)',
          category: 'ForumCategory (required)',
          tags: 'string[] (optional)',
          area: 'string (required)',
          relatedAddress: 'string (optional)',
          relatedApplicationId: 'string (optional)'
        }
      },
      reply: {
        method: 'POST',
        path: '/api/forum',
        body: {
          action: 'reply',
          postId: 'string (required)',
          authorId: 'string (required)',
          authorName: 'string (required)',
          authorType: 'resident|professional|officer|expert (optional)',
          content: 'string (required)',
          parentReplyId: 'string (optional)'
        }
      },
      like: {
        method: 'POST',
        path: '/api/forum',
        body: {
          action: 'like',
          type: 'post|reply',
          id: 'string'
        }
      }
    },
    categories: [
      'general', 'planning_advice', 'application_discussion', 'success_stories',
      'conservation_areas', 'listed_buildings', 'extensions', 'loft_conversions',
      'basements', 'new_builds', 'professional_recommendations', 'council_feedback',
      'appeals', 'enforcement'
    ]
  });
}
