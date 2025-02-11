FROM mysql:latest

# Set environment variables for MySQL
ENV MYSQL_DATABASE=employees_db
ENV MYSQL_ROOT_PASSWORD=Aditi@1122
ENV MYSQL_DATABASE=employees_db
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=Aditi@1122

# Copy the SQL scripts to the Docker entrypoint directory
COPY ./sql-scripts/ /docker-entrypoint-initdb.d/

EXPOSE 3306
