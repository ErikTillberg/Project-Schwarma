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
                return 0;
            }
            int attack(Schwarma::Entity*enemy)
            {
                return 0;
            }
            int defend(Schwarma::Entity*enemy)
            {
                return 0;
            }
    };
}