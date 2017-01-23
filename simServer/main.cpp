#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include "inc/Player.hpp"
using namespace std;

int main(int argc,char*argv[])
{
    ::srand(::time(NULL));
    Schwarma::Player player1;
    Schwarma::Player player2;
    player1.stats.health = 10;
    player2.stats.health = 10;

    player1.position = 0;
    player2.position = 7;
    
    return 0;
}