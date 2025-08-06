#!/bin/bash

# 📦 현재 EC2 Nginx 설정 및 SSL 인증서 백업

set -e

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/nginx-backup-$BACKUP_DATE"

echo "📦 현재 Nginx 설정 백업 시작..."
echo "백업 디렉토리: $BACKUP_DIR"

# 백업 디렉토리 생성
sudo mkdir -p $BACKUP_DIR

# 1. Nginx 설정 백업
echo "📋 Nginx 설정 파일 백업..."
sudo cp -r /etc/nginx $BACKUP_DIR/nginx-config
sudo chown -R ubuntu:ubuntu $BACKUP_DIR/nginx-config

# 2. SSL 인증서 백업 (Let's Encrypt)
echo "🔐 SSL 인증서 백업..."
if [ -d "/etc/letsencrypt" ]; then
    sudo cp -r /etc/letsencrypt $BACKUP_DIR/letsencrypt
    sudo chown -R ubuntu:ubuntu $BACKUP_DIR/letsencrypt
    echo "✅ Let's Encrypt 인증서 백업 완료"
else
    echo "⚠️  Let's Encrypt 디렉토리를 찾을 수 없습니다."
fi

# 3. 현재 실행 중인 컨테이너 정보 백업
echo "🐳 현재 Docker 컨테이너 상태 백업..."
sudo docker ps -a > $BACKUP_DIR/docker-containers.txt
sudo docker images > $BACKUP_DIR/docker-images.txt

# 4. 시스템 서비스 상태 백업
echo "⚙️  시스템 서비스 상태 백업..."
sudo systemctl status nginx --no-pager > $BACKUP_DIR/nginx-service-status.txt || true
sudo systemctl list-units --type=service --state=running > $BACKUP_DIR/running-services.txt

# 5. 네트워크 포트 상태 백업
echo "🌐 네트워크 포트 상태 백업..."
sudo netstat -tlnp > $BACKUP_DIR/port-status.txt

# 6. 현재 Nginx 설정 테스트
echo "🔍 현재 Nginx 설정 테스트..."
sudo nginx -t > $BACKUP_DIR/nginx-config-test.txt 2>&1 || true

# 7. 백업 정보 요약 파일 생성
cat > $BACKUP_DIR/backup-info.txt << EOF
백업 생성 시간: $(date)
백업 생성자: $(whoami)
시스템 정보: $(uname -a)
백업 대상:
- Nginx 설정: /etc/nginx
- SSL 인증서: /etc/letsencrypt
- Docker 컨테이너 상태
- 시스템 서비스 상태
- 네트워크 포트 상태

복원 방법:
1. Nginx 설정 복원:
   sudo cp -r $BACKUP_DIR/nginx-config /etc/nginx
   sudo systemctl restart nginx

2. SSL 인증서 복원:
   sudo cp -r $BACKUP_DIR/letsencrypt /etc/letsencrypt
   sudo systemctl restart nginx

3. 서비스 재시작:
   sudo systemctl enable nginx
   sudo systemctl start nginx
EOF

# 8. 백업 디렉토리 권한 설정
sudo chown -R ubuntu:ubuntu $BACKUP_DIR
chmod -R 755 $BACKUP_DIR

# 9. 백업 압축 (선택사항)
echo "📁 백업 파일 압축..."
tar -czf "/home/ubuntu/nginx-backup-$BACKUP_DATE.tar.gz" -C "/home/ubuntu" "nginx-backup-$BACKUP_DATE"

echo "✅ 백업 완료!"
echo "📍 백업 위치:"
echo "  - 디렉토리: $BACKUP_DIR"
echo "  - 압축 파일: /home/ubuntu/nginx-backup-$BACKUP_DATE.tar.gz"
echo ""
echo "🔄 복원이 필요한 경우 다음 명령어 사용:"
echo "  tar -xzf /home/ubuntu/nginx-backup-$BACKUP_DATE.tar.gz -C /home/ubuntu"
echo "  sudo cp -r /home/ubuntu/nginx-backup-$BACKUP_DATE/nginx-config /etc/nginx"
echo "  sudo cp -r /home/ubuntu/nginx-backup-$BACKUP_DATE/letsencrypt /etc/letsencrypt"
echo "  sudo systemctl restart nginx" 