#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include "inc/Player.hpp"
#include "inc/Simulation.hpp"
using namespace std;

int main(int argc,char*argv[])
{
    //see rnadom number generator for weighted decision making
    ::srand(::time(NULL));

    //Setup some dummy player objects to test with
    Schwarma::Player player1;
    Schwarma::Player player2;

   /* player1.stats.health = 10;
    player2.stats.health = 10;

    //Set players on opposite ends of the stage
    player1.position = 1;
    player2.position = 7;

    player1.name = "Player 1";
    player2.name = "Player 2";*/

    player1.loadFromFile("player1.json");
    player1.position = 1;
    player2.position = 2;
    //Print all triggers loaded from player1.json
    /*for(auto it = player1.triggers.begin(); it != player1.triggers.end(); ++it)
    {
        std::cout<<"if "<<it->condition.lhs<<" "<<it->condition.op<<" "<<it->condition.rhs<<" then\n";
        std::cout<<it->action.actionType<<" "<<it->action.direction<<" end\n";
    }*/
    try
    {
        std::cout<<Schwarma::evalCondition(player1.triggers[0].condition,player1,player2)<<"\n";
    }
    catch(std::exception*e)
    {
        std::cout<<e->what()<<std::endl;
    }

    //Setup a new simulation with our two players
    //Schwarma::Simulation sim(&player1,&player2);
    //Run the simulation (infinite loop for now) and pipe results to console 
    //sim.run<decltype(std::cout)>(std::cout);
    
    return 0;
}