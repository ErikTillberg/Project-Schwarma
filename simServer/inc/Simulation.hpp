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

                while(this->player1->health > 0 && this->player2->health > 0)
                {
                    
                }
            }

    };
}