#!/bin/bash

rm simProcess
printf "Building Simulation Process\n"
g++ -Wall -fexceptions -fexpensive-optimizations -O3 -std=c++11 -c main.cpp -o main.o
if [ $? != 0 ]; then
    rm *.0
    printf "Failed to compile Simulation Process\n"
    exit 1
fi
g++  -o simProcess main.o 
if [ $? != 0 ]; then
    rm *.o
    printf "Failed to link Simulation Process"
    exit 1
fi
rm *.o
printf "Done\n"