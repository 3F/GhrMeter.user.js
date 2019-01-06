@echo off

if not exist "./node_modules/" call npm install

call gulp -t Debug