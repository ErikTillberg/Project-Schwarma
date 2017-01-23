#!/bin/bash

rm simServer
printf "Building Simulation Server\n"
g++ -Wall -fexceptions -fexpensive-optimizations -O3 -std=c++11 -c main.cpp -o main.o
if [ $? != 0 ]; then
    rm *.0
    printf "Failed to compile Simulation Server\n"
    exit 1
fi
g++  -o simServer main.o  -s  
if [ $? != 0 ]; then
    rm *.o
    printf "Failed to link Simulation Server"
    exit 1
fi
rm *.o
printf "Done\n"