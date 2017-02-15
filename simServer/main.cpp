#include <cstdlib>
#include <ctime>
#include "inc/simServer.hpp"
using namespace std;

int main(int argc,char*argv[])
{
    //see rnadom number generator for weighted decision making
    ::srand(::time(NULL));

    //Setup some dummy player objects to test with
    Schwarma::Player player1;
    Schwarma::Player player2;

    player1.stats.health = 10;
    player2.stats.health = 10;


    player1.name = "Player 1";
    player2.name = "Player 2";

    player1.loadFromFile("player1.json");
    player1.position = 1;
    player2.position = 6;

    //Setup a new simulation with our two players
    Schwarma::Simulation sim(&player1,&player2);
    //Run the simulation (infinite loop for now) and pipe results to console 
    sim.run<decltype(std::cout)>(std::cout);
    
    return 0;
}