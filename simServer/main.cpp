#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include "inc/Player.hpp"
#include "inc/Simulation.hpp"
using namespace std;

int main(int argc,char*argv[])
{
    ::srand(::time(NULL));
    Schwarma::Player player1;
    Schwarma::Player player2;
    player1.stats.health = 10;
    player2.stats.health = 10;

    player1.position = 1;
    player2.position = 7;
    player1.name = "Player 1";
    player2.name = "Player2";
    Schwarma::Simulation sim(&player1,&player2);
    sim.run<decltype(std::cout)>(std::cout);
    
    return 0;
}