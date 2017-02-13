#pragma once
#include <fstream>
#include <string>
#include <vector>
#include <map>

#include <cstdlib>
#include <cmath>

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

    int BOUND_LEFT = 0;
    int BOUND_RIGHT = 7;

    std::map<std::string,int> Distance
    {
        std::make_pair("touching",1),
        std::make_pair("close",2),
        std::make_pair("far",3)
    };

    namespace ConditionalOperators
    {
        const char*GREATER_THAN_OR_EQUAL_TO = ">=";
        const char*LESS_THAN_OR_EQUAL_TO = "<=";
        const char*EQUALS = "==";
        const char*GREATER_THAN = ">";
        const char*LESS_THAN = "<";
    }

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
    template<class T1,class T2>
    inline bool evalConditionalExpression(std::string op,T1 lhs,T2 rhs)
    {
        if(op == Schwarma::ConditionalOperators::GREATER_THAN_OR_EQUAL_TO)
        {
            if(lhs >= rhs)
                return true;
        }
        else if(op == Schwarma::ConditionalOperators::GREATER_THAN)
        {
            if(lhs > rhs)
                return true;
        }
        else if(op == Schwarma::ConditionalOperators::EQUALS)
        {
            if(lhs == rhs)
                return true;
        }
        else if(op == Schwarma::ConditionalOperators::LESS_THAN_OR_EQUAL_TO)
        {
            if(lhs <= rhs)
                return true;
        }
        else if(op == Schwarma::ConditionalOperators::LESS_THAN)
        {
            if(lhs < rhs)
                return true;
        }
        return false;
    }
    inline bool evalCondition(const Schwarma::Condition&condition,Schwarma::Entity&a,Schwarma::Entity&b)
    {
        if(condition.lhs == "distance")
        {
            if(Schwarma::Distance.count(condition.rhs) == 0)
                throw new std::runtime_error(std::string("Invalid rhs \"")+condition.rhs+std::string("\""));
            return Schwarma::evalConditionalExpression<int,int>
            (
                condition.op,
                a.distance(b),
                Schwarma::Distance[condition.rhs]
            );    
        }
        return false;
    }
}