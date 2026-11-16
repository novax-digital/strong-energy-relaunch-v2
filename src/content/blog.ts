import blogPostsJson from "./generated/blog-posts.json";
import { reviewBlogPosts } from "./review-blog-posts";
import type { BlogPost } from "@/types/content";

export const blogPosts = [...reviewBlogPosts, ...blogPostsJson] as BlogPost[];
