# 이미지 최적화 스크립트 실행 가이드

> Supabase Storage 이미지 URL 최적화 스크립트 실행 방법

## 🚀 빠른 시작

### 1. 환경변수 설정

#### Admin 앱 환경변수 (`apps/admin/.env`)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Shop 앱 환경변수 (`apps/shop/.env`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. 의존성 설치
```bash
pnpm add -D tsx dotenv
```

### 3. 스크립트 실행
```bash
# 드라이 런으로 테스트
pnpm optimize-images:dry-run

# 실제 실행
pnpm optimize-images
```

---

## 📋 상세 실행 단계

### 1단계: 환경 확인

#### 1.1 환경변수 확인 스크립트 실행
```bash
npx tsx scripts/checkEnv.ts
```

**예상 출력:**
```
🔍 환경변수 파일 로딩 중...
✅ 환경변수 파일 로드됨: apps/admin/.env
✅ 환경변수 파일 로드됨: apps/shop/.env

🔍 Supabase 관련 환경변수 확인:
SUPABASE_URL: ❌ 설정되지 않음
VITE_SUPABASE_URL: ✅ 설정됨
NEXT_PUBLIC_SUPABASE_URL: ✅ 설정됨

SUPABASE_SERVICE_ROLE_KEY: ❌ 설정되지 않음
VITE_SUPABASE_ANON_KEY: ✅ 설정됨
NEXT_PUBLIC_SUPABASE_ANON_KEY: ✅ 설정됨

🔗 Supabase URL: https://your-project.supabase.co
```

#### 1.2 Supabase 연결 테스트
```bash
# 스크립트가 정상적으로 Supabase에 연결되는지 확인
npx tsx scripts/optimizeImageUrls.ts --test-connection
```

### 2단계: 드라이 런 테스트

#### 2.1 드라이 런 실행
```bash
pnpm optimize-images:dry-run
```

**예상 출력:**
```
🔍 환경변수 파일 로딩 중...
✅ 환경변수 파일 로드됨: apps/admin/.env
✅ 환경변수 파일 로드됨: apps/shop/.env

🔍 환경변수 확인:
Admin 앱 (VITE_): ✅ URL 설정됨
Shop 앱 (NEXT_PUBLIC_): ✅ URL 설정됨
직접 설정: ❌ URL 없음
✅ 사용할 Supabase URL: https://your-project.supabase.co
✅ 사용할 Supabase Key: eyJhbGciOi...

🚀 이미지 URL 최적화 시작... (드라이 런 모드)

📊 총 150개의 상품을 처리합니다.

🔍 드라이 런 - 상품 prod_001:
   기존: https://supabase.co/storage/v1/object/public/products/image1.webp
   최적화: https://supabase.co/storage/v1/object/public/products/image1.webp?width=800&height=800&quality=80&format=webp

🔍 드라이 런 - 상품 prod_002:
   기존: https://supabase.co/storage/v1/object/public/products/image2.webp
   최적화: https://supabase.co/storage/v1/object/public/products/image2.webp?width=800&height=800&quality=80&format=webp

⏭️  이미 최적화된 이미지: prod_003

📈 최적화 결과:
✅ 성공: 145개
❌ 실패: 0개
⏭️  건너뜀: 5개

🎉 이미지 URL 최적화 완료!
```

#### 2.2 결과 검토
드라이 런 결과를 확인하여 다음 사항들을 점검하세요:

- **처리할 상품 수**: 예상과 일치하는지 확인
- **이미 최적화된 이미지**: 이미 처리된 이미지가 있는지 확인
- **URL 변환 결과**: 최적화된 URL이 올바른 형식인지 확인

### 3단계: 실제 실행

#### 3.1 백업 생성 (권장)
```sql
-- 데이터베이스 백업 (선택사항)
CREATE TABLE products_backup AS SELECT * FROM products;
```

#### 3.2 실제 최적화 실행
```bash
pnpm optimize-images
```

**예상 출력:**
```
🔍 환경변수 파일 로딩 중...
✅ 환경변수 파일 로드됨: apps/admin/.env
✅ 환경변수 파일 로드됨: apps/shop/.env

🔍 환경변수 확인:
Admin 앱 (VITE_): ✅ URL 설정됨
Shop 앱 (NEXT_PUBLIC_): ✅ URL 설정됨
직접 설정: ❌ URL 없음
✅ 사용할 Supabase URL: https://your-project.supabase.co
✅ 사용할 Supabase Key: eyJhbGciOi...

🚀 이미지 URL 최적화 시작...

📊 총 150개의 상품을 처리합니다.

✅ 상품 prod_001 이미지 URL 최적화 완료
✅ 상품 prod_002 이미지 URL 최적화 완료
⏭️  이미 최적화된 이미지: prod_003
✅ 상품 prod_004 이미지 URL 최적화 완료
...

📈 최적화 결과:
✅ 성공: 145개
❌ 실패: 2개
⏭️  건너뜀: 3개

🎉 이미지 URL 최적화 완료!
```

### 4단계: 결과 검증

#### 4.1 데이터베이스 확인
```sql
-- 최적화된 이미지 URL 확인
SELECT product_id, image 
FROM products 
WHERE image LIKE '%?width=%' 
LIMIT 5;

-- 최적화되지 않은 이미지 확인 (있다면 문제가 있음)
SELECT product_id, image 
FROM products 
WHERE image NOT LIKE '%?width=%' 
AND image IS NOT NULL;
```

#### 4.2 성능 테스트
```bash
# 이미지 로딩 속도 측정
curl -w "@curl-format.txt" -o /dev/null -s "최적화된_이미지_URL"

# curl-format.txt 파일 생성
cat > curl-format.txt << EOF
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

---

## 🔧 고급 옵션

### 커스텀 파라미터로 실행

#### 1. 스크립트 수정
```typescript
// scripts/optimizeImageUrls.ts 수정
const optimizeImageUrl = (
  originalUrl: string, 
  width: number = 800,    // 기본값 변경
  height: number = 800,   // 기본값 변경
  quality: number = 80    // 기본값 변경
) => {
  return `${originalUrl}?width=${width}&height=${height}&quality=${quality}&format=webp`;
};
```

#### 2. 다양한 크기 옵션
```typescript
// 썸네일용 (200x200, 70% 품질)
const thumbnailUrl = optimizeImageUrl(imageUrl, 200, 200, 70);

// 중간 크기 (800x800, 80% 품질)
const mediumUrl = optimizeImageUrl(imageUrl, 800, 800, 80);

// 큰 크기 (1200x1200, 90% 품질)
const largeUrl = optimizeImageUrl(imageUrl, 1200, 1200, 90);
```

### 배치 크기 조정

#### 1. 대량 데이터 처리
```typescript
// scripts/optimizeImageUrls.ts 수정
const BATCH_SIZE = 50; // 한 번에 처리할 상품 수

const updateProductImageUrls = async (dryRun: boolean = false) => {
  let offset = 0;
  
  while (true) {
    const { data: products } = await supabase
      .from('products')
      .select('product_id, image')
      .not('image', 'is', null)
      .range(offset, offset + BATCH_SIZE - 1);
    
    if (!products || products.length === 0) break;
    
    // 배치 처리
    for (const product of products) {
      // 처리 로직
    }
    
    offset += BATCH_SIZE;
    
    // API 호출 제한을 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};
```

### 에러 복구

#### 1. 실패한 항목 재처리
```bash
# 실패한 항목만 재처리하는 스크립트
npx tsx scripts/retryFailedOptimizations.ts
```

#### 2. 롤백 스크립트
```bash
# 최적화를 되돌리는 스크립트
npx tsx scripts/rollbackOptimizations.ts
```

---

## 🚨 문제 해결

### 일반적인 문제들

#### 1. 환경변수 오류
```
Error: supabaseUrl is required.
```

**해결 방법:**
```bash
# 환경변수 파일 확인
ls -la apps/admin/.env apps/shop/.env

# 환경변수 내용 확인
cat apps/admin/.env
cat apps/shop/.env
```

#### 2. Supabase 연결 오류
```
Error: Invalid API key
```

**해결 방법:**
```bash
# API 키 확인
echo $VITE_SUPABASE_ANON_KEY
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Supabase 프로젝트 설정에서 올바른 키 확인
```

#### 3. 권한 오류
```
Error: new row violates row-level security policy
```

**해결 방법:**
```bash
# Service Role Key 사용
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
pnpm optimize-images
```

#### 4. 네트워크 타임아웃
```
Error: timeout
```

**해결 방법:**
```typescript
// 스크립트에 타임아웃 설정 추가
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.0.0'
    }
  }
});
```

### 로그 분석

#### 1. 상세 로그 활성화
```bash
# 디버그 모드로 실행
DEBUG=* pnpm optimize-images
```

#### 2. 로그 파일 저장
```bash
# 로그 파일로 저장
pnpm optimize-images 2>&1 | tee optimization.log
```

---

## 📊 모니터링

### 성능 지표 추적

#### 1. 이미지 로딩 시간 측정
```javascript
// 브라우저에서 이미지 로딩 시간 측정
const measureImageLoadTime = (url) => {
  const start = performance.now();
  const img = new Image();
  
  img.onload = () => {
    const loadTime = performance.now() - start;
    console.log(`이미지 로딩 시간: ${loadTime}ms`);
  };
  
  img.src = url;
};
```

#### 2. Core Web Vitals 모니터링
```javascript
// LCP (Largest Contentful Paint) 측정
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP:', entry.startTime);
  }
}).observe({entryTypes: ['largest-contentful-paint']});
```

### 알림 설정

#### 1. 성능 임계값 설정
```typescript
// 이미지 로딩 시간이 2초를 초과하면 알림
const ALERT_THRESHOLD = 2000;

if (loadTime > ALERT_THRESHOLD) {
  console.warn(`이미지 로딩 시간이 임계값을 초과: ${loadTime}ms`);
}
```

---

## 📚 추가 자료

- [이미지 최적화 분석 문서](./image-optimization-analysis.md)
- [Supabase Storage 문서](https://supabase.com/docs/guides/storage)
- [Next.js 이미지 최적화](https://nextjs.org/docs/basic-features/image-optimization)

---

*최종 업데이트: 2025년 1월* 