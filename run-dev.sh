#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Run with Maven
mvn spring-boot:run