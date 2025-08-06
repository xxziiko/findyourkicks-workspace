import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// 앱별 .env 파일 경로
const APP_ENV_PATHS = [
  path.join(__dirname, '../apps/shop/.env'),
  path.join(__dirname, '../apps/admin/.env'),
];

// 환경변수 로드 함수
const loadEnvironmentVariables = () => {
  console.log('🔍 환경변수 파일 로딩 중...');
  
  let loadedFiles = 0;
  
  // 각 앱의 .env 파일 로드
  for (const envPath of APP_ENV_PATHS) {
    if (fs.existsSync(envPath)) {
      const result = dotenv.config({ path: envPath });
      if (!result.error) {
        console.log(`✅ 환경변수 파일 로드됨: ${path.relative(process.cwd(), envPath)}`);
        loadedFiles++;
      } else {
        console.log(`⚠️  환경변수 파일 로드 실패: ${path.relative(process.cwd(), envPath)}`);
      }
    } else {
      console.log(`❌ 환경변수 파일 없음: ${path.relative(process.cwd(), envPath)}`);
    }
  }
  
  if (loadedFiles === 0) {
    console.log('⚠️  로드된 환경변수 파일이 없습니다.');
  }
  
  return loadedFiles > 0;
};

// 환경변수 로드
loadEnvironmentVariables();

// 환경변수 확인 및 설정
const getSupabaseConfig = () => {
  // Admin 앱 환경변수 (VITE_ 접두사)
  const adminSupabaseUrl = process.env.VITE_SUPABASE_URL;
  const adminSupabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  // Shop 앱 환경변수 (NEXT_PUBLIC_ 접두사)
  const shopSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const shopSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // 일반 환경변수 (직접 설정된 경우)
  const directSupabaseUrl = process.env.SUPABASE_URL;
  const directSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  // 우선순위: 직접 설정 > Admin > Shop
  const supabaseUrl = directSupabaseUrl || adminSupabaseUrl || shopSupabaseUrl;
  const supabaseKey = directSupabaseKey || adminSupabaseKey || shopSupabaseKey;
  
  console.log('\n🔍 환경변수 확인:');
  console.log('Admin 앱 (VITE_):', adminSupabaseUrl ? '✅ URL 설정됨' : '❌ URL 없음');
  console.log('Shop 앱 (NEXT_PUBLIC_):', shopSupabaseUrl ? '✅ URL 설정됨' : '❌ URL 없음');
  console.log('직접 설정:', directSupabaseUrl ? '✅ URL 설정됨' : '❌ URL 없음');
  
  if (!supabaseUrl) {
    throw new Error(`
❌ Supabase URL이 설정되지 않았습니다.

다음 파일들 중 하나에 환경변수를 설정해주세요:
- apps/admin/.env: VITE_SUPABASE_URL=your_url
- apps/shop/.env: NEXT_PUBLIC_SUPABASE_URL=your_url

또는 직접 환경변수로 설정:
- SUPABASE_URL=your_url

현재 설정된 환경변수:
${Object.keys(process.env).filter(key => key.includes('SUPABASE')).map(key => `- ${key}: ${process.env[key] ? '설정됨' : '설정되지 않음'}`).join('\n')}
    `);
  }

  if (!supabaseKey) {
    throw new Error(`
❌ Supabase Key가 설정되지 않았습니다.

다음 파일들 중 하나에 환경변수를 설정해주세요:
- apps/admin/.env: VITE_SUPABASE_ANON_KEY=your_key
- apps/shop/.env: NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

또는 직접 환경변수로 설정:
- SUPABASE_SERVICE_ROLE_KEY=your_key (권장)
- SUPABASE_ANON_KEY=your_key

현재 설정된 환경변수:
${Object.keys(process.env).filter(key => key.includes('SUPABASE')).map(key => `- ${key}: ${process.env[key] ? '설정됨' : '설정되지 않음'}`).join('\n')}
    `);
  }

  console.log(`✅ 사용할 Supabase URL: ${supabaseUrl}`);
  console.log(`✅ 사용할 Supabase Key: ${supabaseKey.substring(0, 10)}...`);

  return { supabaseUrl, supabaseKey };
};

// Supabase 클라이언트 생성
const { supabaseUrl, supabaseKey } = getSupabaseConfig();
const supabase = createClient(supabaseUrl, supabaseKey);


const rollbackImageUrls = async () => {
  console.log('🔄 이미지 URL 롤백 시작...');

  try {
    const { data: products } = await supabase
      .from('products')
      .select('product_id, image')

    for (const product of products || []) {
      // URL 파라미터 제거하여 원본 URL로 복원
      let originalUrl = product.image.split('?')[0];
      
      // ✅ object/sign을 object/public으로 변경
      if (originalUrl.includes('/storage/v1/object/sign/')) {
        originalUrl = originalUrl.replace('/storage/v1/object/sign/', '/storage/v1/object/public/');
        console.log(`✅ 경로 변경: object/sign → object/public`);
      }
      
      await supabase
        .from('products')
        .update({ image: originalUrl })
        .eq('product_id', product.product_id);
      
      console.log(`✅ ${product.product_id} 롤백 완료: ${originalUrl}`);
    }

    console.log('🎉 모든 이미지 URL 롤백 완료!');
  } catch (error) {
    console.error('💥 롤백 중 오류:', error);
  }
};

rollbackImageUrls(); 