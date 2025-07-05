import { Skeleton } from '../../shared/Skeleton';
import { Error } from '../../shared/Error';
import { UsersList } from './UsersList';
import type { User } from './UsersList';
import { usePersistentResource } from '../../hooks/usePersistentResource';

const STORAGE_KEY = 'users';

async function fetchUsersAll(): Promise<User[]> {
    const res = await fetch('https://dummyjson.com/users');
    if (!res.ok) throw new window.Error('Ошибка загрузки пользователей');
    const data = await res.json();
    return data.users;
}

const UsersPage: React.FC = () => {
    const {
        data: users,
        loading,
        error,
        load: loadUsers,
        clear: handleClear,
    } = usePersistentResource<User[]>({
        storageKey: STORAGE_KEY,
        fetcher: fetchUsersAll,
    });
    return (
        <div className='max-w-3xl mx-auto p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6'>
                <h1 className='text-2xl font-bold'>Пользователи</h1>
                <div className='flex gap-2'>
                    <button
                        onClick={loadUsers}
                        disabled={loading}
                        className='px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed'
                    >
                        Загрузить пользователей
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={loading || !users}
                        className='px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed'
                    >
                        Очистить
                    </button>
                </div>
            </div>
            {loading && <Skeleton height='2rem' />}
            {error && <Error error={error} />}
            {users && <UsersList users={users} />}
            {!users && !loading && (
                <div className='text-gray-400 text-center mt-8'>
                    Нет данных. Нажмите «Загрузить пользователей».
                </div>
            )}
        </div>
    );
};

export default UsersPage;
