# START

import mysql.connector
from datetime import datetime

mydb = mysql.connector.connect(
    host="remotemysql.com",
    user="jsdmPgLJ0k",
    password="t0XUXdJsm9",
    database="jsdmPgLJ0k",
)
mycursor = mydb.cursor()

# END

# Insertion Code Snippet
PID = 1     # PID
StartID = 1  # StartStationID
mycursor.execute("""INSERT INTO TravelRecord (PID,StartID) VALUES ('%s', '%s')""" % (
    PID, StartID))
mydb.commit()
print(mycursor.rowcount, "record inserted.")


# Updation Code Snippet
PID = 1
EndID = 3  # EndStationID
now = datetime.now()
formatted_date = now.strftime('%Y-%m-%d %H:%M:%S')

mycursor.execute(
    """SELECT TicketID,StartID FROM TravelRecord WHERE PID= '%s' and Fare is NULL""" % (PID))
myresult = mycursor.fetchone()

StartID = myresult[1]
Ticket = myresult[0]
Fare = abs(StartID-EndID)*10

mycursor.execute("""UPDATE TravelRecord SET EndID='%s', EndTime='%s', Fare='%s' WHERE TicketID = '%s'""" % (
    EndID, formatted_date, Fare, Ticket))

mydb.commit()
print(mycursor.rowcount, "record updated.")
