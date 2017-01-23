#pragma once
#include "Entity.hpp"
#include "Player.hpp"
namespace Schwarma
{
    class Simulation
    {
        private:
            Schwarma::Player* player1;
            Schwarma::Player* player2;
        public:
            Simulation(Schwarma::Player*player1,Schwarma::Player*player2)
            {
                this->player1 = player1;
                this->player2 = player2;
            }
            template<class T>
            int run(T&stream)
            {
                int player1Action = Schwarma::NOOP;
                int player2Action = Schwarma::NOOP;
                int turn = 0;

                while(this->player1->stats.health > 0 && this->player2->stats.health > 0)
                {
                    std::cin.get();
                    if(turn == 0)
                    {
                        this->tickEntityAgainst<decltype(stream)>(player1,player2,player1->doAction(),stream);
                    }
                }
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
                        stream<<entity1->name<<" Moved "<<dist<<" Spaces Towards"<<entity2->name<<"\n";
                    else if(dist == 0)
                        stream<<entity1->name<<" Did Not Move\n";
                }
                if(action == Schwarma::ATTACK)
                {
                    int res = entity1->attack(entity2);
                    if(res)
                        stream<<entity1->name<<" Attacked "<<entity2->name<<"\n";
                    else if(res == 0)
                        stream<<entity1->name<<" Did Not Attack\n";
                }
            }

    };
}