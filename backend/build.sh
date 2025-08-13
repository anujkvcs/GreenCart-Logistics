#!/usr/bin/env bash
# Install system dependencies for MySQL
apt-get update
apt-get install -y default-libmysqlclient-dev build-essential pkg-config

# Install Python dependencies
pip install -r requirements.txt