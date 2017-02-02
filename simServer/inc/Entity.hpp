#pragma once
#include <fstream>
#include <string>
#include <vector>

#include <cstdlib>

#include "Trigger.hpp"

#include "../rapidjson/include/rapidjson/document.h"
#include "../rapidjson/include/rapidjson/istreamwrapper.h"
#include "../rapidjson/include/rapidjson/ostreamwrapper.h"
#include "../rapidjson/include/rapidjson/prettywriter.h"
namespace Schwarma
{
    //constants for action codes
    int NOOP = -1;
    int ATTACK = 0;
    int DEFEND = 1;
    int MOVE = 2;

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

    //class to hold percentage chance to roll each action
    //default is equal chance of all actions
    class BehaviourRolls
    {
        public:
            BehaviourRolls()=default;
            ~BehaviourRolls()=default;
            float actions[3] = {0.33,0.33,0.33};
    };

    //class describing some actor in the game world
    class Entity
    {
        public:
            //a label for the entity
            std::string name = "";
            //position in the (1 dimensional) world
            int position = 0;
            //base statistics (static)
            Schwarma::Stats baseStats;
            //current statistics (dynamic)
            Schwarma::Stats stats;
            //percentage chance to take an action
            Schwarma::BehaviourRolls behaviours;

            std::vector<Schwarma::Trigger> triggers;

            virtual bool loadFromSource(std::string&) = 0;
            virtual int attack(Schwarma::Entity*) = 0;
            virtual int defend(Schwarma::Entity*) = 0;
            virtual int move(Schwarma::Entity*) = 0;

            //roll for action
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
            bool loadFromFile(std::string file)
            {
                //Load json file specified by file
                rapidjson::GenericDocument<rapidjson::UTF8<>> json;
                std::ifstream fileStream(file.c_str(),std::ios::in);
                rapidjson::IStreamWrapper jsonFileStream(fileStream);
                json.ParseStream(jsonFileStream);
                if(json.HasParseError())
                    return false;
                
                auto& actionPercentages = json["actionPercentages"];
                this->behaviours.actions[Schwarma::ATTACK] = std::atof(actionPercentages["attack"].GetString());
                this->behaviours.actions[Schwarma::DEFEND] = std::atof(actionPercentages["defence"].GetString());
                this->behaviours.actions[Schwarma::MOVE] = std::atof(actionPercentages["move"].GetString());
                std::cout<<"loaded action percents\n";

                auto& baseStats = json["baseStats"];
                this->baseStats.health = std::atof(baseStats["health"].GetString());
                this->baseStats.damage = std::atof(baseStats["damage"].GetString());
                this->baseStats.resistanceToDamage = std::atof(baseStats["resistanceToDamage"].GetString());
                this->baseStats.resistanceToFire = std::atof(baseStats["resistanceToFire"].GetString());
                this->baseStats.resistanceToIce = std::atof(baseStats["resistanceToIce"].GetString());
                this->baseStats.resistanceToEarth = std::atof(baseStats["resistanceToEarth"].GetString());
                this->baseStats.movementSpeed = std::atoi(baseStats["movementSpeed"].GetString());

                std::cout<<"loaded base stats\n";

                auto& triggers = json["triggers"];
                if(triggers["move"].GetType() == rapidjson::Type::kArrayType)
                {
                    auto& move = triggers["move"];
                    for(rapidjson::SizeType i = 0; i < move.Size(); ++i)
                    {
                        auto& condition = move[i]["condition"];
                        auto& action = move[i]["action"];
                        if(condition.GetType() == rapidjson::Type::kObjectType &&
                        action.GetType() == rapidjson::Type::kObjectType)
                        {
                            this->triggers.push_back
                            (
                                Schwarma::Trigger
                                (
                                    "move",
                                    Schwarma::Condition
                                    (
                                        condition["lhs"].GetString(),
                                        condition["operator"].GetString(),
                                        condition["rhs"].GetString()
                                    ),
                                    Schwarma::Action
                                    (
                                        action["actionType"].GetString(),
                                        action["direction"].GetString(),
                                        "",
                                        ""
                                    )
                                )
                            );
                        }
                    }
                }
                return true;
            }
    };
}