#pragma once
#include <fstream>
#include <string>
#include "Entity.hpp"
#include "Player.hpp"

#include "../rapidjson/include/rapidjson/document.h"
#include "../rapidjson/include/rapidjson/istreamwrapper.h"
#include "../rapidjson/include/rapidjson/ostreamwrapper.h"
#include "../rapidjson/include/rapidjson/prettywriter.h"
namespace Schwarma
{
    //! Singleton class used to generate a simulation between two Player
    class Simulation
    {
        private:
            Schwarma::Player* players[2];
        public:
            Simulation(Schwarma::Player*player1,Schwarma::Player*player2)
            {
                this->players[0] = player1;
                this->players[1] = player2;
            }
            bool loadPlayerDataFromFile(const char*path)
            {
                rapidjson::GenericDocument<rapidjson::UTF8<>> json;
                std::ifstream fileStream(path,std::ios::in);
                rapidjson::IStreamWrapper jsonFileStream(fileStream);
                json.ParseStream(jsonFileStream);

                auto&players = json["players"];
                bool res = false;
                res = this->players[0]->load(players[0]);
                if(res == false)
                    return res;
                res = this->players[1]->load(players[1]);
                return res;
            }
            //! Run a simulation, outputting results to stream
            template<class T>
            int run(T&stream,const char*formatType = nullptr)
            {
                if(formatType && (::strcmp(formatType,"json")) == 0)
                    stream<<"["<<std::endl;
                //0 for player1, 1 for player 2
                int turn = 0;

                int numTurns = 1;
                //run until someone has been defeated
                while(this->players[0]->stats.health > 0 && this->players[1]->stats.health > 0)
                {
                    if(numTurns >= 40)
                        break;
                    //pause until user hits enter (For debug purposes)
                    //std::cin.get();

                    //assume action is a non-operation
                    int action = Schwarma::NOOP;

                    //these pointers will swap addressess as each player takes turns being simulated
                    Schwarma::Player*p1;
                    Schwarma::Player*p2;

                    //swap pointers depending on turn
                    //p1 is the player being simulated in each turn
                    if(turn == 0)
                    {
                        p1 = this->players[0];
                        p2 = this->players[1];
                    }
                    if(turn == 1)
                    {
                        p1 = this->players[1];
                        p2 = this->players[0];
                    }

                    //get action of player    
                    action = p1->doAction();
                    //simulate turn
                    tickEntityAgainst<decltype(stream)>(p1,p2,action,stream,formatType);
                    numTurns++;
                    //next turn
                    if(turn == 0) turn++;
                    else if (turn == 1) turn--;
                    continue;
                }
                if(formatType && (::strcmp(formatType,"json")) == 0)
                {
                    if(this->players[0]->stats.health <= 0)
                        stream<<"{\"winner\":\"player2\"}"<<std::endl;
                    else if(this->players[1]->stats.health <= 0)
                        stream<<"{\"winner\":\"player1\"}"<<std::endl;
                    else
                        stream<<"{\"winner\":\"none\"}"<<std::endl;
                    stream<<"]";
                }
                return 0;
            }
        private:

            //simulates a turn for entity1 "Against" entity2
            //entity1 will move toward and attack entity2 if those actions are passed 
            template<class T>
            void tickEntityAgainst(Schwarma::Entity*entity1,Schwarma::Entity*entity2,int action,T&stream,const char*formatType = nullptr)
            {
                /*if(action == Schwarma::NOOP)
                    stream<<entity1->name<<" Took No Action\n";*/
                if(action == Schwarma::MOVE)
                {
                    int pos = entity1->move(entity2);
                    /*if(pos == -1)
                        stream<<entity1->name<<" did not move\n";*/
                    if(pos != -1)
                    {
                        if(!formatType)
                            stream<<entity1->name<<" Moved to position "<<pos<<"\n";
                        else if(formatType && (::strcmp(formatType,"json") == 0))
                        {
                            stream<<"{\"action\":\"movePlayer\",\"player\":\""<<entity1->name<<"\",\"number\":\""<<pos<<"\"},"<<std::endl;
                        }
                    }
                }
                if(action == Schwarma::ATTACK)
                {
                    const Schwarma::Card&wep = *entity1->attack(entity2);
                    if(&wep != nullptr)
                    {
                        //entity2->stats.health -= wep.value;
                        double damageToInflict = 0;
                        double baseDamage = (wep.value - entity2->stats.resistanceToDamage);
                        if(baseDamage < 0)
                            baseDamage = 0;
                        double fireDamage = 0;
                        double earthDamage = 0;
                        double iceDamage = 0;
                        if(wep.element == "fire")
                            fireDamage = (wep.elemental_value - entity2->stats.resistanceToFire);
                        if(wep.element == "water")
                            iceDamage = (wep.elemental_value - entity2->stats.resistanceToIce);
                        if(wep.element == "earth")
                            earthDamage = (wep.elemental_value - entity2->stats.resistanceToEarth);
                        
                        damageToInflict = baseDamage + fireDamage + earthDamage + iceDamage;

                        entity2->stats.health -= damageToInflict;
                        if(!formatType)
                            stream<<entity1->name<<" attacked with "<<wep.name<<" for "<<damageToInflict<<" damage "<<std::endl;
                        else if(formatType && (::strcmp(formatType,"json") == 0))
                        {
                            stream<<"{\"action\":\"attack\",\"player\":\""<<entity1->name<<"\",\"number\":\""<<damageToInflict<<"\"},"<<std::endl;
                        }
                    }
                    /*else
                        stream<<entity1->name<<" attack nooped"<<std::endl;*/
                }
                if(action == Schwarma::DEFEND)
                {
                    const Schwarma::Card&card = *entity1->defend(entity2);
                    if(&card != nullptr)
                    {
                        entity1->stats.health += card.value;
                        if(!formatType)
                            stream<<entity1->name<<" healed with "<<card.name<<" for "<<card.value<<std::endl;
                        else if(formatType && (::strcmp(formatType,"json") == 0))
                        {
                            stream<<"{\"action\":\"defense\",\"player\":\""<<entity1->name<<"\",\"number\":\""<<card.value<<"\"},"<<std::endl;
                        }
                    }
                }
            }

    };
}