#pragma once
#include <string>
#include <map>
#include <utility>
namespace Schwarma
{
    //! Index into Schwarma::BehaviourRolls::actions for a no-operation
    int NOOP = -1;
    //! Index into Schwarma::BehaviourRolls::actions for an attack
    int ATTACK = 0;
    //! Index into Schwarma::BehaviourRolls::actions for defence
    int DEFEND = 1;
    //! Index into Schwarma::BehaviourRolls::actions for movement
    int MOVE = 2;

    //! The left most bound of the world
    int BOUND_LEFT = 0;
    //! The right most bound of the world
    int BOUND_RIGHT = 7;

    //! Distance constants between two players`for use in triggers
    std::map<std::string,int> Distance
    {
        std::make_pair("touching",1),
        std::make_pair("close",2),
        std::make_pair("far",3)
    };

    namespace ConditionalOperators
    {
        //! Mapping from string representation for logical >= 
        const char*GREATER_THAN_OR_EQUAL_TO = ">=";
        //! Mapping from string representation for logical <= 
        const char*LESS_THAN_OR_EQUAL_TO = "<=";
        //! Mapping from string representation for logical ==
        const char*EQUALS = "==";
        //! Mapping from string representation for logical >
        const char*GREATER_THAN = ">";
        //! Mapping from string representation for logical <
        const char*LESS_THAN = "<";
    }    
}
#include "Entity.hpp"
#include "Player.hpp"
#include "Simulation.hpp"