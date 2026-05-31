@echo off
title DevPortfolio Local Server Starter
echo ===================================================
echo   DevPortfolio 로컬 개발 서버를 가동합니다.
echo ===================================================
echo.
echo [1/2] 의존성 모듈 설치 상태 점검 중...
call npm install
echo.
echo [2/2] Vite 개발 서버 가동 시작...
echo.
echo 아래 주소가 나타나면 브라우저에 복사해 붙여넣으세요:
echo http://localhost:5173
echo.
echo ---------------------------------------------------
call npm run dev
pause
