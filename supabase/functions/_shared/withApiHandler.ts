import { corsHeaders } from './cors.ts';

/**
 * Supabase Edge Function용 API 핸들러 래퍼입니다.
 *
 * 이 함수는 공통된 API 응답 처리를 캡슐화하여, 각 함수마다 반복적으로 작성해야 하는
 * CORS 처리, 에러 처리, JSON 응답 포맷 등을 일관되게 적용해줍니다.
 *
 * 주요 기능:
 * - `OPTIONS` 메서드 요청(CORS preflight)에 대해 CORS 헤더와 함께 즉시 응답합니다.
 * - handler에서 반환한 `data`, `error` 값을 기반으로 성공/실패 응답을 생성합니다.
 * - 예외가 발생할 경우 500 에러로 처리하며 JSON 형식으로 반환합니다.
 *
 * @param req - 들어온 HTTP 요청(Request 객체)
 * @param handler - 비즈니스 로직을 처리하는 비동기 함수. `{ data, error }` 형식의 객체를 반환해야 합니다.
 *
 * @returns 표준화된 JSON 응답(Response 객체)을 반환합니다.
 *
 * @example
 * ```ts
 * Deno.serve((req) =>
 *   withApiHandler(req, async (req) => {
 *     const { data, error } = await supabase.from('categories').select('*');
 *     return { data, error };
 *   })
 * );
 * ```
 */
export const withApiHandler = async (
  req: Request,
  handler: (req: Request) => Promise<Response>,
) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { data, error } = await handler(req);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};
