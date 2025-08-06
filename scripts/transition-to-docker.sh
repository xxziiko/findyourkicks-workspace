#!/bin/bash

# 🔄 기존 수동 Nginx에서 Docker Compose 방식으로 전환

set -e

echo "🔄 Docker 컨테이너 방식으로 전환 시작..."

# 환경변수 확인
if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKERHUB_ADMIN" ] || [ -z "$DOCKERHUB_SHOP" ]; then
    echo "❌ 환경변수가 설정되지 않았습니다."
    echo "다음 변수들을 설정해주세요:"
    echo "export DOCKER_USERNAME=your_username"
    echo "export DOCKERHUB_ADMIN=findyourkicks-admin"
    echo "export DOCKERHUB_SHOP=findyourkicks-shop"
    exit 1
fi

# 필수 파일 확인
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml 파일이 없습니다."
    echo "프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

echo "📊 전환 전 상태 확인..."
echo "현재 Nginx 상태:"
sudo systemctl status nginx --no-pager || true

echo "현재 Docker 컨테이너:"
sudo docker ps | grep findyourkicks || echo "찾을 수 없음"

echo "포트 80/443 사용 상태:"
sudo netstat -tlnp | grep :80 || echo "포트 80 사용 중 아님"
sudo netstat -tlnp | grep :443 || echo "포트 443 사용 중 아님"

# 사용자 확인
echo ""
echo "⚠️  주의: 이 작업은 서비스에 짧은 다운타임을 발생시킵니다."
echo "계속 진행하시겠습니까? (y/N)"
read -r CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "❌ 전환이 취소되었습니다."
    exit 0
fi

echo "🚀 전환 작업 시작..."

# 1. 기존 개별 컨테이너 중지
echo "⏹️  기존 개별 컨테이너 중지..."
sudo docker stop findyourkicks-shop findyourkicks-admin 2>/dev/null || true
sudo docker rm findyourkicks-shop findyourkicks-admin 2>/dev/null || true

# 2. 기존 nginx 중단
echo "⏹️  기존 nginx 중단..."
sudo systemctl stop nginx
sudo systemctl disable nginx

# 3. 포트 확인
echo "🔍 포트 상태 재확인..."
sleep 2
sudo netstat -tlnp | grep :80 && echo "❌ 포트 80이 여전히 사용 중입니다" || echo "✅ 포트 80 사용 가능"
sudo netstat -tlnp | grep :443 && echo "❌ 포트 443이 여전히 사용 중입니다" || echo "✅ 포트 443 사용 가능"

# 4. 최신 이미지 pull
echo "📥 최신 Docker 이미지 다운로드..."
sudo docker pull $DOCKER_USERNAME/$DOCKERHUB_NGINX:latest
sudo docker pull $DOCKER_USERNAME/$DOCKERHUB_SHOP:latest
sudo docker pull $DOCKER_USERNAME/$DOCKERHUB_ADMIN:latest

# 5. Docker Compose로 전체 스택 시작
echo "🚀 Docker 스택 시작..."
sudo docker compose up -d

# 6. 헬스체크
echo "🏥 헬스체크 실행..."
sleep 30

echo "컨테이너 상태 확인:"
sudo docker compose ps

echo "컨테이너 로그 확인:"
sudo docker compose logs --tail=10 nginx
sudo docker compose logs --tail=10 shop
sudo docker compose logs --tail=10 admin

# 7. 웹사이트 접근 테스트
echo "🌐 웹사이트 테스트..."
echo "Shop 사이트 테스트:"
if curl -I https://findyourkicks.shop/ping -m 10; then
    echo "✅ Shop 사이트 정상"
else
    echo "❌ Shop 사이트 접근 실패"
fi

echo "Admin 사이트 테스트:"
if curl -I https://findyourkicks-admin.site/ping -m 10; then
    echo "✅ Admin 사이트 정상"
else
    echo "❌ Admin 사이트 접근 실패"
fi

echo "✅ 전환 완료!"
echo ""
echo "📊 최종 상태 요약:"
echo "- Nginx (기존): $(sudo systemctl is-active nginx)"
echo "- Docker 스택: $(sudo docker compose ps --format 'table {{.Service}}\t{{.Status}}')"
echo ""
echo "🔧 유용한 명령어들:"
echo "- 로그 확인: sudo docker compose logs -f"
echo "- 상태 확인: sudo docker compose ps"
echo "- 재시작: sudo docker compose restart"
echo "- 중지: sudo docker compose down"
echo ""
echo "🆘 문제 발생 시 롤백:"
echo "./scripts/rollback-to-native.sh" 