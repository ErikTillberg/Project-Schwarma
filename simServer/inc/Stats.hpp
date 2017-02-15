#pragma once
namespace Schwarma
{
    //class to hold statistics about an entity
    class Stats
    {
        public:
            Stats()=default;
            ~Stats()=default;
            float health = 0;
            float damage = 0;
            float resistanceToDamage = 0;
            float resistanceToKinetic = 0;
            float resistanceToFire = 0;
            float resistanceToIce = 0;
            float resistanceToEarth = 0;
            int movementSpeed = 0;
    };
}