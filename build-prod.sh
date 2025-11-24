#!/bin/bash

echo "Building production JAR..."
mvn clean package -DskipTests -Pprod

if [ $? -eq 0 ]; then
    echo "Build successful! JAR file: target/$(ls target/*.jar | grep -v original)"
else
    echo "Build failed!"
    exit 1
fi