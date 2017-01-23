#pragma once
#include <string>
#include "Entity.hpp"
namespace Schwarma
{
    //class representing a player character in the game world
    class Player : public Schwarma::Entity
    {
        public:
            Player()=default;
            ~Player()=default;

            //method to load a player from some source (probably JSON?)
            bool loadFromSource(std::string&src)
            {
                return true;
            }

            //move player toward target if not already 1 space away
            int move(Schwarma::Entity*enemy)
            {
                if((this->position - enemy->position) == 1 ||
                (enemy->position - this->position) == 1)
                    return 0;
                else if(enemy->position > this->position)
                {
                    this->position++;
                    return 1;
                }
                else if (enemy->position < this->position)
                {
                    this->position--;
                    return 1;
                }
                return 0;
            }

            //attack target if 1 space away
            //needs to be thought out more
            int attack(Schwarma::Entity*enemy)
            {
                if((this->position - enemy->position) == 1 ||
                (enemy->position - this->position) == 1)
                    return 1;
                return 0;
            }

            //this needs to be thought out more
            //currently just prints result of enemy attack
            int defend(Schwarma::Entity*enemy)
            {
                int damage = enemy->attack(this);
                if(damage)
                    std::cout<<this->name<<" defended from "<<enemy->attack(this)<<" points of damage\n";
                return damage;
            }
    };
}