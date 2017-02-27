#pragma once
#include "Entity.hpp"
#include "Player.hpp"
namespace Schwarma
{
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
            //! Run a simulation, outputting results to stream
            template<class T>
            int run(T&stream,const char*formatType = nullptr)
            {
                if(formatType && (::strcmp(formatType,"json")) == 0)
                    stream<<"["<<std::endl;
                //0 for player1, 1 for player 2
                int turn = 0;

                //run until someone has been defeated
                while(this->players[0]->stats.health > 0 && this->players[1]->stats.health > 0)
                {
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

                    //if player has decided to attack
                    if(action == Schwarma::ATTACK)
                    {
                        //give player 2 a chance to roll for defence
                        int defend = p2->doAction();
                        //player 2 successfully rolled defence
                        //keep turn at the same value. Player 2 loses their turn for defending
                        if(defend == Schwarma::DEFEND)
                        {
                            p2->defend(p1);
                        }
                        //otherwise player 2 did not decide to defend
                        else
                        {
                            //simulate turn
                            tickEntityAgainst<decltype(stream)>(p1,p2,action,stream,formatType);
                            //next turn
                            if(turn == 0) turn++;
                            else if (turn == 1) turn--;
                            continue;
                        }
                    }
                    //simulate the turn
                    else if(action == Schwarma::MOVE)
                    {
                        tickEntityAgainst<decltype(stream)>(p1,p2,action,stream,formatType);
                        //next turn
                        if(turn == 0) turn++;
                        else if (turn == 1) turn--;
                        continue;
                    }
                }
                if(formatType && (::strcmp(formatType,"json")) == 0)
                {
                    stream<<"{}"<<std::endl;
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
                    if(pos)
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
                    const Schwarma::Weapon&wep = *entity1->attack(entity2);
                    if(&wep != nullptr)
                    {
                        entity2->stats.health -= wep.damage;
                        if(!formatType)
                            stream<<entity1->name<<" attacked with "<<wep.name<<std::endl;
                        else if(formatType && (::strcmp(formatType,"json") == 0))
                        {
                            stream<<"{\"action\":\"attack\",\"player\":\""<<entity1->name<<"\",\"number\":\""<<wep.damage<<"\"},"<<std::endl;
                        }
                    }
                    /*else
                        stream<<entity1->name<<" attack nooped"<<std::endl;*/
                }
            }

    };
}