FROM openjdk:17.0.2

WORKDIR /app

COPY ./target/UserService-0.0.1-SNAPSHOT.jar /app

EXPOSE 8003

ENV spring.datasource.url=jdbc:mysql://database-mysql:3306/product_catalog_db

ENTRYPOINT ["java", "-jar", "UserService-0.0.1-SNAPSHOT.jar"]