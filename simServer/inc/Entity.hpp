#pragma once
#include <fstream>
#include <string>
#include <vector>
#include <map>

#include <cstdlib>
#include <cmath>

#include "Trigger.hpp"
#include "Weapon.hpp"
#include "Stats.hpp"
#include "BehaviourRolls.hpp"

#include "../rapidjson/include/rapidjson/document.h"
#include "../rapidjson/include/rapidjson/istreamwrapper.h"
#include "../rapidjson/include/rapidjson/ostreamwrapper.h"
#include "../rapidjson/include/rapidjson/prettywriter.h"
namespace Schwarma
{
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

            std::vector<Schwarma::Weapon> weapons;

            virtual bool loadFromSource(std::string&) = 0;
            virtual const Schwarma::Weapon*attack(Schwarma::Entity*) = 0;
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
            //Loads an entity from file specifed by string file
            bool loadFromFile(std::string file)
            {
                //Load json file specified by file
                rapidjson::GenericDocument<rapidjson::UTF8<>> json;
                std::ifstream fileStream(file.c_str(),std::ios::in);
                rapidjson::IStreamWrapper jsonFileStream(fileStream);
                json.ParseStream(jsonFileStream);
                if(json.HasParseError())
                    return false;
                
                if(!json.HasMember("baseStats"))
                    return false;
                
                if(!json.HasMember("actionPercentages"))
                    return false;

                if(!json.HasMember("weapons"))
                    return false;
                
                //Get reference to actionPercentages object
                auto&actionPercentages = json["actionPercentages"];
                //Parse properties into class
                this->behaviours.actions[Schwarma::ATTACK] = std::atof(actionPercentages["attack"].GetString());
                this->behaviours.actions[Schwarma::DEFEND] = std::atof(actionPercentages["defence"].GetString());
                this->behaviours.actions[Schwarma::MOVE] = std::atof(actionPercentages["move"].GetString());

                auto&baseStats = json["baseStats"];
                this->baseStats.health = std::atof(baseStats["health"].GetString());
                this->baseStats.damage = std::atof(baseStats["damage"].GetString());
                this->baseStats.resistanceToDamage = std::atof(baseStats["resistanceToDamage"].GetString());
                this->baseStats.resistanceToFire = std::atof(baseStats["resistanceToFire"].GetString());
                this->baseStats.resistanceToIce = std::atof(baseStats["resistanceToIce"].GetString());
                this->baseStats.resistanceToEarth = std::atof(baseStats["resistanceToEarth"].GetString());
                this->baseStats.movementSpeed = std::atoi(baseStats["movementSpeed"].GetString());


                auto&weapons = json["weapons"];
                if(weapons.GetType() == rapidjson::Type::kArrayType)
                {
                    for(rapidjson::SizeType i = 0; i < weapons.Size(); ++i)
                    {
                        this->weapons.push_back(Schwarma::Weapon::parseWeapon<decltype(weapons[i])>(weapons[i]));
                    }
                }
                else 
                    return false;
                

                //Get reference to triggers object
                auto&triggers = json["triggers"];
                //Check for move triggers
                if(triggers.HasMember("move"))
                {
                    //triggers.move is of the right type
                    if(triggers["move"].GetType() == rapidjson::Type::kArrayType)
                    {
                        //Get reference to triggers.move
                        auto&move = triggers["move"];
                        //For each object in triggers.move, parse it into the entity's triggers vector
                        for(rapidjson::SizeType i = 0; i < move.Size(); ++i)
                        {
                            this->triggers.push_back(Schwarma::Trigger::parseTrigger<decltype(move[i])>(move[i],"move"));
                        }
                    }
                }
                if(triggers.HasMember("attack"))
                {
                    if(triggers["attack"].GetType() == rapidjson::Type::kArrayType)
                    {
                        auto&attack = triggers["attack"];
                        for(rapidjson::SizeType i = 0; i < attack.Size(); ++i)
                        {
                            this->triggers.push_back(Schwarma::Trigger::parseTrigger<decltype(attack[i])>(attack[i],"attack"));
                        }
                    }
                }
                return true;
            }
            int distance(Entity&b)
            {
                return std::abs(this->position - b.position);
            }
    }; 
}