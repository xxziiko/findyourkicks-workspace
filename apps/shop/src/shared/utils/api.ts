import { assert } from '@findyourkicks/shared';

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export async function request<Response, Body = void>(
  method: string,
  endpoint: string,
  body?: Body,
  options?: RequestInit,
): Promise<Response> {
  const fetchOptions: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`,
    fetchOptions,
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

function createApiMethod(method: 'POST' | 'PATCH' | 'DELETE') {
  return <Response, Body = void>(
    endpoint: string,
    body?: Body,
    options?: RequestInit,
  ) => {
    return request<Response, Body>(method, endpoint, body, options);
  };
}

function createApiMethodWithHeaders(method: 'GET') {
  return <Response>(endpoint: string, options?: RequestInit) => {
    return request<Response>(method, endpoint, undefined, options);
  };
}

export const api = {
  get: createApiMethodWithHeaders('GET'),
  post: createApiMethod('POST'),
  patch: createApiMethod('PATCH'),
  delete: createApiMethod('DELETE'),
};
