@echo off
echo Migrating GreenCart Logistics to MySQL Database...
echo.

cd backend

echo Installing MySQL client...
pip install mysqlclient==2.2.0

echo.
echo Creating new migrations for MySQL...
py manage.py makemigrations

echo.
echo Running migrations...
py manage.py migrate

echo.
echo Loading CSV data...
py manage.py load_csvs

echo.
echo MySQL migration completed successfully!
echo Database: reservations
echo Host: localhost:3306
echo User: admindjango
echo.
pause