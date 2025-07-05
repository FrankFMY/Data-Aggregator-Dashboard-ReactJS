export interface Post {
    id: number;
    title: string;
    body: string;
    userId?: number;
}

interface PostsListProps {
    posts: Post[];
    onPostClick?: (post: Post) => void;
}

export function PostsList({ posts, onPostClick }: PostsListProps) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {posts.map((post) => (
                <div
                    key={post.id}
                    className='bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg dark:shadow-lg transition flex flex-col gap-2 cursor-pointer'
                    onClick={() => onPostClick?.(post)}
                    tabIndex={0}
                    role='button'
                    aria-label={`Открыть пост: ${post.title}`}
                >
                    <div className='font-bold text-lg truncate text-gray-900 dark:text-gray-100'>
                        {post.title}
                    </div>
                    <div className='text-gray-700 dark:text-gray-100 text-sm line-clamp-3'>
                        {post.body}
                    </div>
                    {post.userId && (
                        <div className='text-xs text-gray-400 dark:text-gray-300 mt-auto'>
                            User ID: {post.userId}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
