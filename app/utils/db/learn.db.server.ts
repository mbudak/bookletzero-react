import { LearnAuthor, LearnCategory, LearnPost, LearnPostTag, LearnTag, SubscriptionPrice } from "@prisma/client";
import { Colors } from "~/application/enums/shared/Colors";
import { db } from "../db.server";

export type LearnPostWithDetails = LearnPost & {
  author: LearnAuthor;
  category: LearnCategory;
  tags: (LearnPostTag & { tag: LearnTag })[];
  prices: SubscriptionPrice[]
};

export async function getAllSubscriptionsByUser(userId: string) {
  return await db.userSubscription.findMany({
    where: {
      userId
    },
    include: {
      learnPost: true
    }
  })
}



export async function getAllLearnPosts(published?: boolean): Promise<LearnPostWithDetails[]> {
  let where = {};
  if (published) {
    where = {
      published,
    };
  }
  return await db.learnPost.findMany({
    where,
    orderBy: {
      date: "desc"
    },
    include: {
      author: true,
      category: true,
      prices: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  })
}

export async function getLearnPost(idOrSlug: string): Promise<LearnPostWithDetails | null> {
    return await db.learnPost.findFirst({
      where: {
        OR: [
          {
            id: idOrSlug,
          },
          {
            slug: idOrSlug,
          },
        ],
      },
      include: {
        author: true,
        category: true,
        prices: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }
  
  export async function deleteLearnPost(id: string) {
    return await db.learnPost.delete({
      where: {
        id,
      },
    });
  }
  
  export async function getAllAuthors(): Promise<LearnAuthor[]> {
    return await db.learnAuthor.findMany({
      orderBy: {
        firstName: "asc",
      },
    });
  }
  
  export async function getAllCategories(): Promise<LearnCategory[]> {
    return await db.learnCategory.findMany({
      orderBy: {
        color: "asc",
      },
    });
  }
  
  export async function getAllTags(): Promise<LearnTag[]> {
    return await db.learnCategory.findMany({
      orderBy: {
        color: "asc",
      },
    });
  }
  
  export async function createLearnPost(data: {
    slug: string;
    title: string;
    description: string;
    date: Date;
    image: string;
    content: string;
    totalQuestions: number;
    published: boolean;
    authorId: string;
    categoryId: string;
    tagNames: string[];
  }): Promise<LearnPost> {
    const tags: LearnTag[] = [];
  
    await Promise.all(
      data.tagNames.map(async (tagName) => {
        const tag = await db.learnTag.findUnique({
          where: { name: tagName.trim() },
        });
        if (tag) {
          tags.push(tag);
        } else {
          const tag = await db.learnTag.create({
            data: {
              name: tagName.trim(),
              color: Colors.BLUE,
            },
          });
          tags.push(tag);
        }
      })
    );
  
    const tagIds = tags.map((tag) => {
      return {
        tagId: tag.id,
      };
    });
  
    const post = await db.learnPost.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        date: data.date,
        image: data.image,
        content: data.content,
        totalQuestions: data.totalQuestions,
        published: data.published,
        authorId: data.authorId,
        categoryId: data.categoryId,
        tags: {
          create: tagIds,
        },
      },
    });
  
    await syncPostTags(post, data.tagNames);
  
    return post;
  }
  
  export async function updateLearnPost(
    id: string,
    data: {
      slug: string;
      title: string;
      description: string;
      date: Date;
      image: string;
      content: string;
      totalQuestions: number;
      published: boolean;
      authorId: string;
      categoryId: string;
      tagNames: string[];
    }
  ): Promise<LearnPost> {
    const post = await db.learnPost.update({
      where: {
        id,
      },
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        date: data.date,
        image: data.image,
        content: data.content,
        totalQuestions: data.totalQuestions,
        published: data.published,
        authorId: data.authorId,
        categoryId: data.categoryId,
      },
    });
  
    await syncPostTags(post, data.tagNames);
  
    return post;
  }
  
  export async function updateLearnPostPublished(id: string, published: boolean): Promise<LearnPost> {
    return await db.learnPost.update({
      where: {
        id,
      },
      data: {
        published,
      },
    });
  }
  
  export async function syncPostTags(post: LearnPost, tagNames: string[]) {
    const tagsWithoutDuplicates = Array.from(new Set(tagNames));
    const tags = await Promise.all(
      tagsWithoutDuplicates.map(async (tagName) => {
        const tag = await db.learnTag.findUnique({
          where: { name: tagName.trim() },
        });
        if (tag) {
          return tag;
        } else {
          return await db.learnTag.create({
            data: {
              name: tagName.trim(),
              color: Colors.BLUE,
            },
          });
        }
      })
    );
    await db.learnPostTag.deleteMany({
      where: {
        postId: post.id,
      },
    });
    await Promise.all(
      tags.map(async (tag) => {
        return await db.learnPostTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      })
    );
  }
  