import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../../api/jsonplaceholder';
import { useAsync } from '../../hooks/useAsync';
import { Skeleton } from '../../shared/Skeleton';
import { Error } from '../../shared/Error';
import { UsersList } from './UsersList';
import type { User } from './UsersList';

const STORAGE_KEY = 'users';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[] | null>(null);
    const { loading, error, data, run } = useAsync<User[], []>(fetchUsers);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setUsers(JSON.parse(saved));
            } catch {
                // ignore
            }
        }
    }, []);

    useEffect(() => {
        if (data) {
            setUsers(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [data]);

    const handleClear = () => {
        setUsers(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <div className='max-w-3xl mx-auto p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6'>
                <h1 className='text-2xl font-bold'>Пользователи</h1>
                <div className='flex gap-2'>
                    <button
                        onClick={() => run()}
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
