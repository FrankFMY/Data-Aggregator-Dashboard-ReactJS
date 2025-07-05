export async function fetchUsers() {
  const res = await fetch('https://dummyjson.com/users');
  if (!res.ok) throw new Error('Ошибка загрузки пользователей');
  const json = await res.json();
  return json.users; // массив пользователей
}

export async function fetchPosts() {
  const res = await fetch('https://dummyjson.com/posts');
  if (!res.ok) throw new Error('Ошибка загрузки постов');
  const json = await res.json();
  return json.posts; // массив постов
}
