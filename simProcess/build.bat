@echo off
del simProcess
echo "Building Simulation Process"

g++ -Wall -fexceptions -fexpensive-optimizations -O3 -std=c++11 -c main.cpp -o main.o

IF %ERRORLEVEL% NEQ 0 (
    del main.o
    echo "Failed to compile Simulation Process"
    goto :EOF
)
g++ -static -static-libgcc -static-libstdc++  -o simProcess main.o  -s

IF %ERRORLEVEL% NEQ 0 (
    del main.o
    echo "Failed to link Simulation Process"
    goto :EOF
)
del main.o
echo "Done"