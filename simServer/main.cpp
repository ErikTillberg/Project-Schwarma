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
    for(int i = 0; i != 10; i++)
    {
        int action = player1.doAction();
        if(action == Schwarma::ATTACK)
            std::cout<<"Player 1 Attacked"<<std::endl;
        if(action == Schwarma::DEFEND)
            std::cout<<"Player 1 Defended"<<std::endl;
        if(action == Schwarma::MOVE)
            std::cout<<"Player 1 Moved"<<std::endl;
    }
    return 0;
}