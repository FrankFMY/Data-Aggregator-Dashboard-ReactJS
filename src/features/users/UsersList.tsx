export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  image?: string;
  address?: { city?: string } | string;
  company?: { name?: string } | string;
}

export function UsersList({ users }: { users: User[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {users.map((u) => (
        <div
          key={u.id}
          className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-l-4 border-l-blue-400 dark:border-l-blue-600 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition"
        >
          <img
            src={
              u.image || `https://api.dicebear.com/7.x/initials/svg?seed=${u.firstName || u.name}`
            }
            alt={u.firstName || u.name}
            className="w-14 h-14 rounded-full object-cover border border-gray-200 bg-gray-50"
          />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate text-gray-900 dark:text-gray-100">
              {u.firstName || u.name} {u.lastName || ''}
            </div>
            <div className="text-blue-700 dark:text-blue-300 text-sm truncate">{u.email}</div>
            {u.address && (
              <div className="text-gray-500 dark:text-gray-300 text-xs truncate">
                <span className="inline-block mr-2">
                  <svg
                    className="inline w-4 h-4 mr-1 text-gray-400 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {typeof u.address === 'string' ? u.address : u.address.city}
                </span>
              </div>
            )}
            {u.company && (
              <div className="text-gray-400 dark:text-gray-300 text-xs truncate">
                <svg
                  className="inline w-4 h-4 mr-1 text-gray-400 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-6 4v4a1 1 0 001 1h3m6-5v4a1 1 0 01-1 1h-3"
                  />
                </svg>
                {typeof u.company === 'string' ? u.company : u.company.name}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
