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
            template<class T>
            int run(T&stream)
            {
                int turn = 0;

                while(this->players[0]->stats.health > 0 && this->players[1]->stats.health > 0)
                {
                    std::cin.get();
                    int action = Schwarma::NOOP;
                    Schwarma::Player*p1;
                    Schwarma::Player*p2;
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
                        
                    action = p1->doAction();
                    if(action == Schwarma::ATTACK)
                    {
                        int defend = p2->doAction();
                        if(defend == Schwarma::DEFEND)
                        {
                            p2->defend(p1);
                        }
                        else
                        {
                            tickEntityAgainst<decltype(stream)>(p1,p2,action,stream);
                            if(turn == 0) turn++;
                            else if (turn == 1) turn--;
                            continue;
                        }
                    }
                    else if(action == Schwarma::MOVE)
                    {
                        tickEntityAgainst<decltype(stream)>(p1,p2,action,stream);
                        if(turn == 0) turn++;
                        else if (turn == 1) turn--;
                        continue;
                    }
                }
                return 0;
            }
        private:
            template<class T>
            void tickEntityAgainst(Schwarma::Entity*entity1,Schwarma::Entity*entity2,int action,T&stream)
            {
                if(action == Schwarma::NOOP)
                    stream<<entity1->name<<" Took No Action\n";
                if(action == Schwarma::MOVE)
                {
                    int dist = entity1->move(entity2);
                    if(dist == 1)
                        stream<<entity1->name<<" Moved "<<dist<<" Spaces Towards "<<entity2->name<<"\n";
                    else if(dist == 0)
                        stream<<entity1->name<<" Did Not Move\n";
                }
                if(action == Schwarma::ATTACK)
                {
                    int res = entity1->attack(entity2);
                    if(res)
                        stream<<entity1->name<<" inflicted "<<res<<" damage to "<<entity2->name<<"\n";
                    else if(res == 0)
                        stream<<entity1->name<<" Did Not Attack\n";
                }
            }

    };
}