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
                    if(turn == 0)
                    {
                        player1Action = this->player1->doAction();
                        if(player1Action == Schwarma::NOOP)
                            stream<<"Player 1 Took No Action\n";
                        if(player1Action == Schwarma::MOVE)
                        {
                            int dist = player1->move(player2);
                            if(dist == 1)
                                stream<<"Player 1 Moved One Space Towards Player 2\n";
                            else if(dist == 0)
                                stream<<"Player 1 Did Not Move\n";
                        }
                        if(player1Action == Schwarma::ATTACK)
                        {
                            int res = player1->attack(player2);
                            if(res)
                                stream<<"Player 1 Attacked Player 2\n";
                            else if(res == 0)
                                stream<<"Player 1 Did Not Attack\n";
                        }
                    }
                }
            }

    };
}