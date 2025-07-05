import type { Post } from './PostsList';

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

export function PostModal({ post, onClose }: PostModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-fade-in border border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold focus:outline-none"
          aria-label="Закрыть"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{post.title}</h2>
        <div className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{post.body}</div>
        {post.userId && (
          <div className="text-xs text-gray-400 dark:text-gray-300 mt-6">
            User ID: {post.userId}
          </div>
        )}
      </div>
    </div>
  );
}
