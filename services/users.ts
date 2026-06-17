import { apiFetch } from './api';

export async function createUser(): Promise<void> {
  await apiFetch('/api/users', { method: 'POST' });
}
