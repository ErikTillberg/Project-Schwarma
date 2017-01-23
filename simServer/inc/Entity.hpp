#pragma once
#include <string>
#include <cstdlib>
namespace Schwarma
{
    int NOOP = -1;
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
            float actions[3] = {0.33,0.33,0.33};
    };
    class Entity
    {
        public:
            int position = 0;
            Schwarma::Stats baseStats;
            Schwarma::BehaviourRolls behaviours;
            virtual bool loadFromSource(std::string&) = 0;
            int doAction()
            {
                //Algorithm based on answer by jephthah
                //https://www.daniweb.com/programming/software-development/threads/269329/weighted-dice
                float percent = (float)(rand()%1024)/1024;
                if(percent < this->behaviours.actions[Schwarma::ATTACK])
                    return Schwarma::ATTACK;
                if(percent < (this->behaviours.actions[Schwarma::ATTACK] +
                this->behaviours.actions[Schwarma::DEFEND]))
                    return Schwarma::DEFEND;
                if(percent < (this->behaviours.actions[Schwarma::ATTACK] +
                this->behaviours.actions[Schwarma::DEFEND] + 
                this->behaviours.actions[Schwarma::MOVE]))
                    return Schwarma::MOVE;

                return Schwarma::NOOP;
            }
    };
}