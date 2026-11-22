#!/usr/bin/env bash
# Phase 1 setup: generates the Spring Boot and Vite base projects and merges
# them with the files in this folder WITHOUT overwriting anything already here.
# Requires: curl, unzip, Java 21, Node 20+, Docker. On Windows use Git Bash or WSL.
set -e
cd "$(dirname "$0")"

echo "==> Starting PostgreSQL"
docker compose up -d

echo "==> Generating Spring Boot project"
rm -rf _api_tmp && mkdir _api_tmp
curl -fsSL https://start.spring.io/starter.zip \
  -d type=maven-project -d language=java -d javaVersion=21 \
  -d groupId=com.bharathraj -d artifactId=portfolio-api -d name=portfolio-api \
  -d packageName=com.bharathraj.portfolio \
  -d dependencies=web,data-jpa,security,validation,postgresql,flyway,actuator \
  -o _api_tmp/api.zip
unzip -q _api_tmp/api.zip -d _api_tmp/out
rm -f _api_tmp/out/src/main/resources/application.properties
cp -Rn _api_tmp/out/. backend/
rm -rf _api_tmp
chmod +x backend/mvnw

echo "==> Generating Vite React + TypeScript project"
rm -rf _vite_tmp
npm create vite@latest _vite_tmp -- --template react-ts
cp -Rn _vite_tmp/. frontend/
rm -rf _vite_tmp

echo "==> Installing frontend dependencies"
cd frontend
npm install
npm install three @react-three/fiber @react-three/drei framer-motion react-router-dom axios
npm install -D @types/three
cd ..

echo
echo "Done. Next:"
echo "  Terminal 1:  cd backend && ./mvnw spring-boot:run"
echo "  Terminal 2:  cd frontend && npm run dev"
