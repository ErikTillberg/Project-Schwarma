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
            
    };
}