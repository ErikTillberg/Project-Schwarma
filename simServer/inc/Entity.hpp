#pragma once
#include <string>
namespace Schwarma
{
    class Stats
    {
        public:
            Stats()=default;
            ~Stats()=default;
            int health = 0;
            int resistanceToDamage = 0;
            int resistanceToKinetic = 0;
            int resistanceToFire = 0;
            int resistanceToIce = 0;
            int resistanceToEarth = 0;
            int movementSpeed = 0;
    };
    class Entity
    {
        public:
            int position = 0;
            Schwarma::Stats baseStats;
            virtual bool loadFromSource(std::string&) = 0;
    };
}