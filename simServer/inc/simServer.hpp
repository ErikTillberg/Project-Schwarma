#pragma once
#include <string>
#include <map>
#include <utility>
namespace Schwarma
{
    //constants for action codes
    int NOOP = -1;
    int ATTACK = 0;
    int DEFEND = 1;
    int MOVE = 2;

    int BOUND_LEFT = 0;
    int BOUND_RIGHT = 7;

    std::map<std::string,int> Distance
    {
        std::make_pair("touching",1),
        std::make_pair("close",2),
        std::make_pair("far",3)
    };

    namespace ConditionalOperators
    {
        const char*GREATER_THAN_OR_EQUAL_TO = ">=";
        const char*LESS_THAN_OR_EQUAL_TO = "<=";
        const char*EQUALS = "==";
        const char*GREATER_THAN = ">";
        const char*LESS_THAN = "<";
    }    
}
#include "Entity.hpp"
#include "Player.hpp"
#include "Simulation.hpp"