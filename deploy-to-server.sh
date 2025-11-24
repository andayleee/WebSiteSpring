#!/bin/bash

# Configuration
SERVER_USER="root"
SERVER_HOST="146.103.101.127"
JAR_FILE=$(ls target/*.jar | grep -v original | head -1)
APP_NAME="website-0.0.1-SNAPSHOT"

echo "Deploying $JAR_FILE to server..."

# Copy JAR to server
scp $JAR_FILE $SERVER_USER@$SERVER_HOST:/tmp/$APP_NAME.jar

# Execute remote commands
ssh $SERVER_USER@$SERVER_HOST << EOF
    echo "Stopping service..."
    sudo systemctl stop $APP_NAME || true
    
    echo "Updating application..."
    sudo mv /tmp/$APP_NAME.jar /opt/mysite/
    sudo chown appuser:appuser /opt/mysite/$APP_NAME.jar
    sudo chmod 500 /opt/mysite/$APP_NAME.jar
    
    echo "Starting service..."
    sudo systemctl start $APP_NAME
    sudo systemctl status $APP_NAME
EOF

echo "Deployment completed!"