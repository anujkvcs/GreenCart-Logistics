@echo off
echo Setting up Enhanced GreenCart Logistics...
echo.

cd backend

echo Installing packages...
py -m pip install -r requirements.txt

echo.
echo Database setup complete!
echo Starting Django server...
py manage.py runserver

pause