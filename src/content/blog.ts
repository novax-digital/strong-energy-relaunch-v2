import blogPostsJson from "./generated/blog-posts.json";
import type { BlogPost } from "@/types/content";

export const blogPosts = blogPostsJson as BlogPost[];
