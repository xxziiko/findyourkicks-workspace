FROM nginx:alpine

# curl 설치 (헬스체크용)
RUN apk add --no-cache curl

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# SSL 인증서 디렉토리 생성
RUN mkdir -p /etc/letsencrypt

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"] 