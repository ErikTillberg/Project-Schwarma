#include <fstream>
#include <cstdlib>
#include <ctime>
#include "inc/simProcess.hpp"
using namespace std;

int main(int argc,char*argv[])
{
    //seed random number generator for weighted decision making
    ::srand(::time(NULL));

    Schwarma::Player player1;
    Schwarma::Player player2;

    player1.position = 1;
    player2.position = 6;

    player1.name = "1";
    player2.name = "2";
    Schwarma::Simulation sim(&player1,&player2);
    sim.loadPlayerDataFromFile(argv[1]);

    
    if((::strcmp(argv[2],"cout") == 0))
    {
        sim.run<decltype(std::cout)>
        (
            std::cout,
            (::strcmp(argv[3],"json") == 0) ? "json" : nullptr
        );    
    }
    else
    {
        std::ofstream stream(argv[2],std::ios::out|std::ios::trunc);
        sim.run<std::ofstream>
        (
            stream,
            (::strcmp(argv[3],"json") == 0) ? "json" : nullptr
        );
    }    
    return 0;
}