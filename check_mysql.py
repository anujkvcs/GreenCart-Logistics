import mysql.connector
from mysql.connector import Error

def check_mysql_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='admindjango',
            password='employee@123!'
        )
        
        if connection.is_connected():
            print("✅ MySQL connection successful!")
            
            cursor = connection.cursor()
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"MySQL Server version: {version[0]}")
            
            # Check if database exists
            cursor.execute("SHOW DATABASES")
            databases = [db[0] for db in cursor.fetchall()]
            
            if 'reservations' in databases:
                print("✅ Database 'reservations' exists")
            else:
                print("❌ Database 'reservations' not found")
                print("Creating database 'reservations'...")
                cursor.execute("CREATE DATABASE reservations")
                print("✅ Database 'reservations' created")
            
            cursor.close()
            
    except Error as e:
        print(f"❌ MySQL connection failed: {e}")
        
    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()

if __name__ == "__main__":
    check_mysql_connection()