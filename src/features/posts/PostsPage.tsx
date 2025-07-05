import { useEffect, useState, useCallback } from 'react';
import { fetchPosts } from '../../api/jsonplaceholder';
import { useAsync } from '../../hooks/useAsync';
import { Skeleton } from '../../shared/Skeleton';
import { Error } from '../../shared/Error';
import { PostsList } from './PostsList';
import type { Post } from './PostsList';
import { PostModal } from './PostModal';

const STORAGE_KEY = 'posts';

const PostsPage = () => {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const { loading, error, data, run } = useAsync<Post[], []>(fetchPosts);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setPosts(JSON.parse(saved));
            } catch {
                // ignore
            }
        }
    }, []);

    useEffect(() => {
        if (data) {
            setPosts(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [data]);

    const handleClear = () => {
        setPosts(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    // Закрытие модалки по ESC и клику вне окна
    const handleModalClose = useCallback(() => setSelectedPost(null), []);
    useEffect(() => {
        if (!selectedPost) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleModalClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [selectedPost, handleModalClose]);

    // Клик вне окна
    useEffect(() => {
        if (!selectedPost) return;
        const onClick = (e: MouseEvent) => {
            const modal = document.querySelector('.post-modal-content');
            if (modal && !modal.contains(e.target as Node)) handleModalClose();
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [selectedPost, handleModalClose]);

    return (
        <div className='max-w-3xl mx-auto p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6'>
                <h1 className='text-2xl font-bold'>Посты</h1>
                <div className='flex gap-2'>
                    <button
                        onClick={() => run()}
                        disabled={loading}
                        className='px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed'
                    >
                        Загрузить посты
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={loading || !posts}
                        className='px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed'
                    >
                        Очистить
                    </button>
                </div>
            </div>
            {loading && <Skeleton height='2rem' />}
            {error && <Error error={error} />}
            {posts && (
                <PostsList
                    posts={posts}
                    onPostClick={setSelectedPost}
                />
            )}
            {!posts && !loading && (
                <div className='text-gray-400 text-center mt-8'>
                    Нет данных. Нажмите «Загрузить посты».
                </div>
            )}
            {selectedPost && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                    <div className='post-modal-content'>
                        <PostModal
                            post={selectedPost}
                            onClose={handleModalClose}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostsPage;
