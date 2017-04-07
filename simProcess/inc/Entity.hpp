#pragma once
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>

#include <cstdlib>
#include <cmath>

#include "Trigger.hpp"
#include "Card.hpp"
#include "Stats.hpp"
#include "BehaviourRolls.hpp"

#include "../rapidjson/include/rapidjson/document.h"
#include "../rapidjson/include/rapidjson/istreamwrapper.h"
#include "../rapidjson/include/rapidjson/ostreamwrapper.h"
#include "../rapidjson/include/rapidjson/prettywriter.h"
namespace Schwarma
{
    //! Class describing some actor in the game world
    class Entity
    {
        public:
            //! A string holding the entitys unique name
            std::string player_name;
            //! A label for the entity
            std::string name = "";
            //! Position in the (1 dimensional) world
            int position = 0;
            //! Base statistics (static)
            Schwarma::Stats baseStats;
            //! Current statistics (dynamic)
            Schwarma::Stats stats;
            //! Percentage chance to take an action
            Schwarma::BehaviourRolls behaviours;
            //! Collection of conditions and actions 
            std::vector<Schwarma::Trigger> triggers;
            //! Collection of cards wielded by the Entity
            std::vector<Schwarma::Card> cards;

            virtual bool loadFromSource(std::string&) = 0;
            virtual const Schwarma::Card*attack(Schwarma::Entity*) = 0;
            virtual const Schwarma::Card*defend(Schwarma::Entity*) = 0;
            virtual int move(Schwarma::Entity*) = 0;

            //! Roll for action
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
            //! Loads an entity from the JSON document json
            bool load(rapidjson::GenericValue<rapidjson::UTF8<> >&json)
            {     
                if(!json.HasMember("base_stats"))
                    return false;
                

                if(!json.HasMember("actionPercentages"))
                    return false;

                this->player_name = json["player_name"].GetString();
                //Get reference to actionPercentages object
                auto&actionPercentages = json["actionPercentages"];
                //Parse properties into class
                this->behaviours.actions[Schwarma::ATTACK] = actionPercentages["attack"].GetDouble();
                this->behaviours.actions[Schwarma::DEFEND] = actionPercentages["defense"].GetDouble();
                this->behaviours.actions[Schwarma::MOVE] = actionPercentages["move"].GetDouble();


                auto&baseStats = json["base_stats"];
                this->baseStats.health = baseStats["health"].GetDouble();
                this->baseStats.damage = baseStats["damage"].GetDouble();
                this->baseStats.resistanceToDamage = baseStats["resistance_to_damage"].GetDouble();
                this->baseStats.resistanceToFire = baseStats["resistance_to_fire"].GetDouble();
                this->baseStats.resistanceToIce = baseStats["resistance_to_ice"].GetDouble();
                this->baseStats.resistanceToEarth = baseStats["resistance_to_earth"].GetDouble();
                this->baseStats.movementSpeed = baseStats["movement_speed"].GetDouble();



                auto&cards = json["cards"];
                for(rapidjson::SizeType i = 0; i < cards.Size(); ++i)
                {
                    this->cards.push_back(Schwarma::Card::parseCard(cards[i]));
                }


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
                if(triggers.HasMember("defense"))
                {
                    if(triggers["defense"].GetType() == rapidjson::Type::kArrayType)
                    {
                        auto&defense = triggers["defense"];
                        for(rapidjson::SizeType i = 0; i < defense.Size(); ++i)
                        {
                            this->triggers.push_back(Schwarma::Trigger::parseTrigger<decltype(defense[i])>(defense[i],"defense"));
                        }
                    }
                }

                this->stats = this->baseStats;
                return true;
            }
            //! Calculate distance between Entity this and b
            int distance(Entity&b)
            {
                return std::abs(this->position - b.position);
            }
    }; 
}