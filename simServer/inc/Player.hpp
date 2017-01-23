#pragma once
#include <string>
#include "Entity.hpp"
namespace Schwarma
{
    class Player : public Schwarma::Entity
    {
        public:
            Player()=default;
            ~Player()=default;
            bool loadFromSource(std::string&src)
            {
                return true;
            }
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
            int attack(Schwarma::Entity*enemy)
            {
                if((this->position - enemy->position) == 1 ||
                (enemy->position - this->position) == 1)
                    return 1;
                return 0;
            }
            int defend(Schwarma::Entity*enemy)
            {
                int damage = enemy->attack(this);
                if(damage)
                    std::cout<<this->name<<" defended from "<<enemy->attack(this)<<" points of damage\n";
                return damage;
            }
    };
}