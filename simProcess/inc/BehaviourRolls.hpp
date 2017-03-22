#pragma once
namespace Schwarma
{
    //! Class to hold percentage chance to roll each action. Default is equal chance of all actions
    class BehaviourRolls
    {
        public:
            BehaviourRolls()=default;
            ~BehaviourRolls()=default;
            float actions[3] = {0.33,0.33,0.33};
    };
}