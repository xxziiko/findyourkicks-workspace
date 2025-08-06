#!/bin/bash

# 🔙 Docker 컨테이너 방식에서 기존 수동 nginx 방식으로 롤백

set -e  # 에러 발생 시 스크립트 중단

echo "🔙 Docker 방식에서 기존 Nginx 방식으로 롤백 시작..."

# 환경변수 확인
if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKERHUB_ADMIN" ] || [ -z "$DOCKERHUB_SHOP" ]; then
    echo "❌ 환경변수가 설정되지 않았습니다."
    echo "다음 변수들을 설정해주세요: DOCKER_USERNAME, DOCKERHUB_ADMIN, DOCKERHUB_SHOP"
    exit 1
fi

echo "📊 현재 상태 확인..."
echo "Docker 컨테이너 상태:"
sudo docker compose ps || true

echo "Nginx 서비스 상태:"
sudo systemctl status nginx --no-pager || true

# 1. Docker 스택 중단
echo "⏹️  Docker 스택 중단..."
sudo docker compose down || true

# 2. 포트 확인 및 정리
echo "🔍 포트 상태 확인..."
sudo netstat -tlnp | grep :80 | head -5 || true
sudo netstat -tlnp | grep :443 | head -5 || true

# 기존 개별 컨테이너들도 정리
echo "🧹 기존 개별 컨테이너 정리..."
sudo docker stop findyourkicks-shop findyourkicks-admin 2>/dev/null || true
sudo docker rm findyourkicks-shop findyourkicks-admin 2>/dev/null || true

# 3. 기존 nginx 재시작
echo "🔄 기존 Nginx 서비스 재시작..."
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx --no-pager

# 4. 개별 컨테이너로 앱 실행 (기존 방식)
echo "🚀 개별 앱 컨테이너 시작..."

# 최신 이미지 pull
echo "📥 최신 이미지 다운로드..."
sudo docker pull $DOCKER_USERNAME/$DOCKERHUB_SHOP:latest
sudo docker pull $DOCKER_USERNAME/$DOCKERHUB_ADMIN:latest

# Shop 앱 시작
echo "🛍️  Shop 앱 시작..."
sudo docker run -d \
    --name findyourkicks-shop \
    --restart unless-stopped \
    -p 3001:3001 \
    $DOCKER_USERNAME/$DOCKERHUB_SHOP:latest

# Admin 앱 시작
echo "⚙️  Admin 앱 시작..."
sudo docker run -d \
    --name findyourkicks-admin \
    --restart unless-stopped \
    -p 3000:3000 \
    $DOCKER_USERNAME/$DOCKERHUB_ADMIN:latest

# 5. 헬스체크
echo "🏥 서비스 헬스체크..."
sleep 10

echo "컨테이너 상태:"
sudo docker ps | grep findyourkicks

echo "웹사이트 접근 테스트:"
curl -I https://findyourkicks.shop/ping || echo "❌ Shop 사이트 접근 실패"
curl -I https://findyourkicks-admin.site/ping || echo "❌ Admin 사이트 접근 실패"

echo "✅ 롤백 완료!"
echo "📊 최종 상태:"
echo "- Nginx: $(sudo systemctl is-active nginx)"
echo "- Shop 컨테이너: $(sudo docker inspect -f '{{.State.Status}}' findyourkicks-shop 2>/dev/null || echo 'Not found')"
echo "- Admin 컨테이너: $(sudo docker inspect -f '{{.State.Status}}' findyourkicks-admin 2>/dev/null || echo 'Not found')" 