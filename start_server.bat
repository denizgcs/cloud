@echo off
echo Meta Cloud Flask Uygulamasini baslatiliyor...
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Python yüklü değil!
    echo Lütfen Python 3.x yükleyin: https://python.org
    pause
    exit
)

:: Check if Flask is installed
python -c "import flask" >nul 2>&1
if %errorlevel% neq 0 (
    echo Flask kuruluyor...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo HATA: Flask kurulumu başarısız!
        pause
        exit
    )
)

echo.
echo ========================================
echo  Meta Cloud Flask Uygulamasi
echo ========================================
echo  Ana Sayfa: http://localhost:5000
echo  Admin Panel: http://localhost:5000/admin
echo  API Endpoint: http://localhost:5000/get-submissions
echo ========================================
echo.

:: Start Flask app
python app.py

echo.
echo Uygulama kapatildi.
pause
