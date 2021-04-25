import mysql.connector
import os
import shutil
parent_dir = "D:/WebDev/College Projects/Metro Project/Metro-Admin/uploads/"
mydb = mysql.connector.connect(
    host="remotemysql.com",
    user="jsdmPgLJ0k",
    password="t0XUXdJsm9",
    database="jsdmPgLJ0k",
)
mycursor = mydb.cursor()
mycursor1 = mydb.cursor()

mycursor.execute(
    """SELECT PID,FileID,Processed FROM PassengerDetails where Processed=0""")
result = mycursor.fetchall()
for i in result:
    if(i[2] == 0):
        mycursor1.execute(
            """UPDATE PassengerDetails SET Processed=%s WHERE PID='%s'""" % (1, i[0]))
        print(mycursor1)
        mydb.commit()
        PID = i[0]
        fid = i[1]
        directory = str(PID)
        path = os.path.join(parent_dir, directory)
        os.mkdir(path)
        k = 0
        n = len(fid)//32
        for i in range(n):
            filename = parent_dir+fid[k:k+32]
            newfile = filename+".jpg"
            os.rename(filename, newfile)
            print(newfile)
            shutil.move(newfile, path)
            k += 32
        print(n)
