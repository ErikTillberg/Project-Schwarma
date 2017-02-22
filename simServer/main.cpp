#include <fstream>
#include <cstdlib>
#include <ctime>
#include "inc/simServer.hpp"
using namespace std;

int main(int argc,char*argv[])
{
    if(argc < 4)
    {
        std::cout<<"Invalid number of arguments!\n";
        return 1;
    }
    //see rnadom number generator for weighted decision making
    ::srand(::time(NULL));

    Schwarma::Player player1;
    Schwarma::Player player2;

    player1.name = "Player 1";
    player2.name = "Player 2";

    bool res = player1.loadFromFile(argv[1]);
    if(!res)
    {
        std::cout<<"Could not load "<<argv[1]<<std::endl;   
        return 1;
    }
    res = player2.loadFromFile(argv[2]);
    if(!res)
    {
        std::cout<<"Could not load "<<argv[2]<<std::endl;
        return 1;
    }
    player1.position = 1;
    player2.position = 6;

    Schwarma::Simulation sim(&player1,&player2);

    //If arg 3 is cout then pipe to stdout
    if(argc >= 4 && (::strcmp(argv[3],"cout") == 0))
        sim.run<decltype(std::cout)>(std::cout);
    //Otherwise interpret arg 3 as a file to pipe to
    else
    {
        std::ofstream stream(argv[3],std::ios::out|std::ios::trunc);
        sim.run<std::ofstream>(stream);
    }
    
    return 0;
}