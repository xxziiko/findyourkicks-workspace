import { assert } from '@/shared/utils/';

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export async function request<Response, Body = void>(
  method: string,
  endpoint: string,
  body?: Body,
  headers?: HeadersInit,
): Promise<Response> {
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`,
    options,
  );
  const responseData = await res.json();

  const error: ApiError = {
    message: responseData.message || 'API 요청 실패',
    status: res.status,
    code: responseData.code,
  };

  assert(res.ok, `${error.status}, ${error}`);

  return responseData;
}

function createApiMethod(method: 'GET' | 'POST' | 'PATCH' | 'DELETE') {
  return <Response, Body = void>(endpoint: string, body?: Body) => {
    return request<Response, Body>(method, endpoint, body);
  };
}

export const api = {
  get: createApiMethod('GET'),
  post: createApiMethod('POST'),
  patch: createApiMethod('PATCH'),
  delete: createApiMethod('DELETE'),
};
