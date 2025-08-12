@echo off
echo Setting up GreenCart Logistics Project...

echo.
echo === Backend Setup ===
cd backend

echo Installing Python dependencies...
pip install -r requirements.txt

echo Running migrations...
py manage.py makemigrations
py manage.py migrate

echo Loading CSV data...
py manage.py load_csvs

echo Creating superuser (optional - press Ctrl+C to skip)...
py manage.py createsuperuser

cd ..

echo.
echo === Frontend Setup ===
cd frontend

echo Installing Node dependencies...
npm install

cd ..

echo.
echo === Setup Complete ===
echo Backend: Run 'cd backend && py manage.py runserver'
echo Frontend: Run 'cd frontend && npm run dev'
echo.
echo To use cloud database:
echo 1. Set up Railway/Neon PostgreSQL (see SETUP_CLOUD_DB.md)
echo 2. Add DATABASE_URL to .env file
echo 3. Run: py manage.py migrate && py manage.py load_csvs
echo.
pause