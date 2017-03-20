@echo off
del simServer
echo "Building Simulation Server"

g++ -Wall -fexceptions -fexpensive-optimizations -O3 -std=c++11 -c main.cpp -o main.o

IF %ERRORLEVEL% NEQ 0 (
    del main.o
    echo "Failed to compile Simulation Server"
    goto :EOF
)
g++  -o simServer main.o  -s

IF %ERRORLEVEL% NEQ 0 (
    del main.o
    echo "Failed to link Simulation Server"
    goto :EOF
)
del main.o
echo "Done"