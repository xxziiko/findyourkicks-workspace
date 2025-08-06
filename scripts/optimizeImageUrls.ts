import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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

// 이미지 URL 최적화 함수
const optimizeImageUrl = (originalUrl: string, width: number = 380, height: number = 380, quality: number = 80) => {
  // ✅ URL 인코딩 개선
  const params = new URLSearchParams({
    width: width.toString(),
    height: height.toString(),
    quality: quality.toString(),
    format: 'webp'
  });
  
  return `${originalUrl}?${params.toString()}`;
};

// 상품 이미지 URL 업데이트 함수
const updateProductImageUrls = async (dryRun: boolean = false) => {
  console.log(`\n🚀 이미지 URL 최적화 시작... ${dryRun ? '(드라이 런 모드)' : ''}`);

  try {
    // 1. 모든 상품 조회
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('product_id, image')
      .not('image', 'is', null);

    if (fetchError) {
      throw new Error(`상품 조회 실패: ${fetchError.message}`);
    }

    if (!products || products.length === 0) {
      console.log('📝 업데이트할 상품이 없습니다.');
      return;
    }

    console.log(`📊 총 ${products.length}개의 상품을 처리합니다.`);

    // 2. 각 상품의 이미지 URL 최적화
    let updatedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      try {
        if (!product.image) continue;

        // 이미 최적화된 URL인지 확인
        if (product.image.includes('?width=')) {
          console.log(`⏭️  이미 최적화된 이미지: ${product.product_id}`);
          skippedCount++;
          continue;
        }

        // 이미지 URL 최적화
        const optimizedUrl = optimizeImageUrl(product.image);

        if (dryRun) {
          console.log(`🔍 드라이 런 - 상품 ${product.product_id}:`);
          console.log(`   기존: ${product.image}`);
          console.log(`   최적화: ${optimizedUrl}`);
          updatedCount++;
        } else {
          // 데이터베이스 업데이트
          const { error: updateError } = await supabase
            .from('products')
            .update({ image: optimizedUrl })
            .eq('product_id', product.product_id);

          if (updateError) {
            console.error(`❌ 상품 ${product.product_id} 업데이트 실패:`, updateError.message);
            errorCount++;
          } else {
            console.log(`✅ 상품 ${product.product_id} 이미지 URL 최적화 완료`);
            updatedCount++;
          }
        }

        // API 호출 제한을 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ 상품 ${product.product_id} 처리 중 오류:`, error);
        errorCount++;
      }
    }

    console.log('\n📈 최적화 결과:');
    console.log(`✅ 성공: ${updatedCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`⏭️  건너뜀: ${skippedCount}개`);

  } catch (error) {
    console.error('💥 스크립트 실행 중 오류:', error);
    process.exit(1);
  }
};

// 명령행 인수 처리
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// 스크립트 실행
if (require.main === module) {
  updateProductImageUrls(dryRun)
    .then(() => {
      console.log('\n🎉 이미지 URL 최적화 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { updateProductImageUrls, optimizeImageUrl }; 