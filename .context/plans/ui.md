# 리뷰 UI 하단 배치 계획

## Context
현재 상품 상세 페이지(`/product/[id]`)에서 `split-layout` 믹스인으로 인해 데스크탑(≥1024px)에서 이미지, 구분선, 상품정보, 리뷰 섹션이 모두 **가로(flex-row)** 로 나란히 배치된다. 사용자는 리뷰 섹션을 상품정보 아래 **전체 너비 하단 영역**으로 이동하길 원한다.

## 현재 레이아웃
```
article.detail (split-layout → desktop: flex-row)
├── figure.image__box   (이미지, sticky)
├── div.detail__divider (세로 구분선)
├── DetailContent       (상품명/가격/옵션/구매버튼)
└── ReviewSection       (리뷰 — 현재 위치)
```

## 목표 레이아웃
```
article.detail (flex-col)
├── div.detail__top (split-layout → desktop: flex-row)
│   ├── figure.image__box
│   ├── div.detail__divider
│   └── DetailContent
└── ReviewSection   (하단 전체 너비)
```

## 변경 파일

### 1. `apps/shop/src/app/(shop)/product/[id]/page.tsx`
- `figure`, `div.detail__divider`, `DetailContent`를 `<div className={styles.detail__top}>` 으로 감싼다
- `<ReviewSection>`은 `detail__top` 밖, `article` 바로 아래에 배치

```tsx
<article className={styles.detail}>
  <div className={styles.detail__top}>
    <figure className={styles.image__box}>...</figure>
    <div className={styles.detail__divider} />
    <DetailContent productDetail={productDetail} />
  </div>
  <ReviewSection productId={id} rating={productDetail.rating} />
</article>
```

### 2. `apps/shop/src/app/(shop)/product/[id]/page.module.scss`
- `.detail`: `split-layout` 제거 → `flex-col` + `padding: 10rem 0` + `width: 100%`
- `.detail__top`: `split-layout(3rem, 0, 1024px)` 적용 (기존 `detail`의 역할)
- `.detail__divider`: 그대로 유지

```scss
.detail {
  @include flex-col;
  gap: 3rem;
  padding: 10rem 0;
  width: 100%;
}

.detail__top {
  @include split-layout(3rem, 0, 1024px);
}

.detail__divider {
  @media (min-width: 1024px) {
    border-left: 1px solid #dedede;
  }
}
```

## 검증
- 데스크탑: 상단에 [이미지 | 구분선 | 상품정보] 가로 배치, 하단에 리뷰 전체 너비
- 모바일: 이미지 → 상품정보 → 리뷰 순으로 세로 배치 (기존과 동일)
- 이미지의 `sticky-base(10rem)` 동작 유지 확인
