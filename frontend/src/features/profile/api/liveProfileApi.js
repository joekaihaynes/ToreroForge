// Semester 2 data source: the Node.js API. Endpoints are listed in frontend/README.md.
// The backend applies the privacy rules and reads the user from the JWT.

import { api, toQuery } from '../../../lib/apiClient.js';
import { fromApi, toApi } from '../profileContract.js';

export const liveProfileApi = {
  async getProfile(id, viewerId) {
    const path = id === viewerId ? '/profiles/me' : `/profiles/${encodeURIComponent(id)}`;
    return fromApi(await api.get(path), viewerId);
  },

  async getProfilesByIds(ids, viewerId) {
    if (!ids.length) return [];
    const rows = await api.get(`/profiles${toQuery({ ids: ids.join(',') })}`);
    return rows.map((r) => fromApi(r, viewerId));
  },

  async searchProfiles(filters, viewerId) {
    const rows = await api.get(`/profiles${toQuery(filters)}`);
    return rows.map((r) => fromApi(r, viewerId));
  },

  async updateProfile(userId, changes) {
    return fromApi(await api.patch('/profiles/me', toApi(changes)), userId);
  },
};