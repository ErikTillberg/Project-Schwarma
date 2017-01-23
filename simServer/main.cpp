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
        std::cout<<player1.doAction()<<std::endl;
    }
    return 0;
}