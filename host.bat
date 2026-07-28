@echo off
setlocal enabledelayedexpansion
title scoofy.xyz guestbook (running - close window to stop + wipe)
cd /d "%~dp0"

REM ============================================================
REM  scoofy.xyz :: self-host the guestbook on this PC.
REM  double-click me. close the window to stop (and wipe) it.
REM  pick a port:   host.bat 8080     (default is 3000)
REM ============================================================

REM ---- port: first argument, else 3000 ----
set "PORT=%~1"
if "%PORT%"=="" set "PORT=3000"

REM ---- salt for hashing IPs (any random string; it's ephemeral anyway) ----
if "%IP_SALT%"=="" set "IP_SALT=scoofy-local-change-me"

REM ---- need Node ----
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js isn't installed.
  echo   Get it from https://nodejs.org  ^(click the big LTS button^), then run this again.
  echo.
  pause
  exit /b 1
)

REM ---- find this PC's LAN ip so people on the same wi-fi can sign too ----
set "LANIP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do if not defined LANIP set "LANIP=%%a"
if defined LANIP set "LANIP=!LANIP: =!"

echo.
echo   =========================================================
echo     scoofy.xyz guestbook  ::  EPHEMERAL  ::  wipes on close
echo   ---------------------------------------------------------
echo     this pc      http://localhost:%PORT%
if defined LANIP echo     same wi-fi   http://!LANIP!:%PORT%
echo     stop + wipe  just close this window
echo   =========================================================
echo.

REM ---- open the guestbook, then run the server in the foreground ----
start "" "http://localhost:%PORT%/guestbook.html"
node server.js

echo.
echo   server stopped - guestbook wiped. bye.
pause
