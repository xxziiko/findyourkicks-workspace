import { assert } from '@/shared/utils/';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

const getApiUrl = (endpoint: string) =>
  `${process.env.NEXT_PUBLIC_API_URL}/api${endpoint}`;

async function request<Response, Body = void>(
  method: string,
  endpoint: string,
  body?: Body,
): Promise<ApiResponse<Response>> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(getApiUrl(endpoint), options);
  const responseData = await res.json();

  const error: ApiError = {
    message: responseData.message || 'API 요청 실패',
    status: res.status,
    code: responseData.code,
  };

  assert(res.ok, `${error.status}, ${error.message}`);

  return responseData;
}

export const api = {
  get: <Response>(endpoint: string) => request<Response>('GET', endpoint),
  post: <Response, Body = void>(endpoint: string, body?: Body) =>
    request<Response, Body>('POST', endpoint, body),
  patch: <Response, Body = void>(endpoint: string, body?: Body) =>
    request<Response, Body>('PATCH', endpoint, body),
  delete: <Response>(endpoint: string) => request<Response>('DELETE', endpoint),
};
