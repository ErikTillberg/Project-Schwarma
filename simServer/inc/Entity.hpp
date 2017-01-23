#pragma once
#include <string>
namespace Schwarma
{
    int ATTACK = 0;
    int DEFEND = 1;
    int MOVE = 2;
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
    class BehaviourRolls
    {
        public:
            BehaviourRolls()=default;
            ~BehaviourRolls()=default;
            float actions[2] = {33.33,33.33,33.33};
    };
    class Entity
    {
        public:
            int position = 0;
            Schwarma::Stats baseStats;
            Schwarma::BehaviourRolls behaviours;
            virtual bool loadFromSource(std::string&) = 0;
    };
}