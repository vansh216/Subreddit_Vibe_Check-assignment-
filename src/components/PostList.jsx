import PostCard from "./PostCard";

/**
 * @param {Array} posts - array of post objects, each with a .sentiment field
 */
export default function PostList({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="w-full max-w-xl">
      <p className="mb-3 text-sm font-semibold text-zinc-300">
        All Posts ({posts.length})
      </p>

      <div className="flex max-h-[32rem] flex-col gap-3 overflow-y-auto pr-1">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}