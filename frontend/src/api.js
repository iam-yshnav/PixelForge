const API_BASE = '/api/v1';

export async function apiPost(path, body = {}, token = null) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
  return res;
}

export async function apiGet(path, token = null) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });
  return res;
}
