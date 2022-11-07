import { Colors } from "~/application/enums/shared/Colors";
import { db } from "~/utils/db.server";
import { getMdxContent } from "~/utils/services/learnService";

export async function seedLearn() {
  await seedTags([
    { name: "aviation", color: Colors.PURPLE },
    { name: "atpl", color: Colors.YELLOW },
    { name: "private", color: Colors.INDIGO },
    { name: "pilot", color: Colors.BLUE },
    { name: "easa", color: Colors.GREEN },
    { name: "language", color: Colors.GRAY },
    { name: "english", color: Colors.GREEN },
    { name: "toelf", color: Colors.AMBER },
    { name: "ielts", color: Colors.CYAN },
    { name: "business", color: Colors.LIME }
  ]);

  await seedAuthors([
    {
      slug: "muratbudak",
      firstName: "Murat",
      lastName: "BUDAK",
      image: "https://pbs.twimg.com/profile_images/1312953216431259649/qWkcabB9_400x400.jpg",
      url: "https://twitter.com/canuck_budak",
    },
  ]);

  await seedCategories([
    { name: "Aviation", color: Colors.INDIGO },
    { name: "Language", color: Colors.ORANGE },
    { name: "Math", color: Colors.AMBER },
  ]);

  return await seedLearnPosts();
}

export async function seedLearnPosts() {
  const posts = [
    {
      slug: "easa-2021-atpl-a-question-database",
      title: "ATPL(A) EASA 2021 QuestionBank database",
      description: "Prepare you ATPL(A) exam with this up to date questions",
      date: new Date("2022-12-01T16:43:00.000Z"),
      image: "https://i.imgur.com/T3YULdC.jpg",
      totalQuestions: 1307,
      authorSlug: "muratbudak",
      categoryName: "Aviation",
      tagNames: ["aviation", "atpl", "easa", "private", "pilot"],
      published: true,
    },
    {
      slug: "easa-2016-ecqb7-0-question-database",
      title: "EASA 2016 (ECQB 7.0) Question Database",
      description: "Updated question with students feedbacks",
      date: new Date("2022-04-20T13:48:43.000Z"),
      image:
        "https://i.imgur.com/qeEkBM4.jpg",
      totalQuestions: 1120,
      authorSlug: "muratbudak",
      categoryName: "Aviation",
      tagNames: ["aviation", "atpl", "private", "pilot"],
      published: true,
    },
    {
      slug: "bookletzero-english-questions-b1",
      title: "BookletZERO - English Level B1",
      description: "here is the english exam questions",
      date: new Date("2022-05-31T21:09:43.000Z"),
      image:
        "https://i.imgur.com/S5LLAyq.jpg",
      totalQuestions: 950,
      authorSlug: "muratbudak",
      categoryName: "Language",
      tagNames: ["language", "english"],
      published: true,
    },
    {
      slug: "bookletzero-english-questions-level-b2",
      title: "English Questions Level B2",
      description:
        "Another exam questions for preparations Level B2",
      date: new Date("2022-06-18T19:43:00.000Z"),
      image:
        "https://i.imgur.com/S5LLAyq.jpg",
      totalQuestions: 1018,
      authorSlug: "muratbudak",
      categoryName: "Language",
      tagNames: ["language", "english"],
      published: true,
    },
    {
      slug: "bookletzero-english-questions-for-toefl",
      title: "TOEFL questions for your career plans",
      description: "Nice questions to prepare yourself",
      date: new Date("2022-07-01T16:14:00.000Z"),
      image: "https://i.imgur.com/S5LLAyq.jpg",
      totalQuestions: 983,
      authorSlug: "muratbudak",
      categoryName: "Language",
      tagNames: ["language", "english"],
      published: true,
    }
  ];

  return await Promise.all(
    posts.map(async (post) => {
      await new Promise((r) => setTimeout(r, 100));
      return await seedLearnPost(post);
    })
  );
}

async function seedTags(tags: { name: string; color: Colors }[]) {
  return await Promise.all(
    tags.map(async (data) => {
      return await db.learnTag.create({
        data,
      });
    })
  );
}

async function seedAuthors(
  authors: {
    slug: string;
    firstName: string;
    lastName: string;
    image: string;
    url: string;
  }[]
) {
  return await Promise.all(
    authors.map(async (data) => {
      return await db.learnAuthor.create({
        data,
      });
    })
  );
}

async function seedCategories(
  items: {
    name: string;
    color: Colors;
  }[]
) {
  return await Promise.all(
    items.map(async (data) => {
      return await db.learnCategory.create({
        data,
      });
    })
  );
}

async function seedLearnPost(post: {
  slug: string;
  title: string;
  description: string;
  date: Date;
  image: string;
  totalQuestions: number;
  published: boolean;
  authorSlug: string;
  categoryName: string;
  tagNames: string[];
}) {
  const existingLearnPost = await db.learnPost.findUnique({
    where: {
      slug: post.slug,
    },
  });
  if (existingLearnPost) {
    // eslint-disable-next-line no-console
    console.log("existing learn post with slug: " + post.slug);
    return;
  }

  const author = await db.learnAuthor.findUnique({
    where: {
      slug: post.authorSlug,
    },
  });
  const category = await db.learnCategory.findUnique({
    where: {
      name: post.categoryName,
    },
  });
  const tags = await db.learnTag.findMany({
    where: {
      name: { in: post.tagNames },
    },
  });
  const tagIds = tags.map((tag) => {
    return {
      tagId: tag.id,
    };
  });

  const content = await getMdxContent(post.slug);
  return await db.learnPost.create({
    data: {
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      image: post.image,
      content,
      totalQuestions: post.totalQuestions,
      published: post.published,
      authorId: author?.id ?? "",
      categoryId: category?.id ?? "",
      tags: {
        create: tagIds,
      },
    },
  });
}
