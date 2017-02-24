#!/bin/bash

i="0"

while [ $i -lt 10000 ]
do
./simServer player1.json player1.json cout > /dev/null
i=$[$i+1]
done