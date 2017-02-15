#pragma once
#include <string>
#include "Entity.hpp"
namespace Schwarma
{
    //class representing a player character in the game world
    class Player : public Schwarma::Entity
    {
        public:
            Player()=default;
            ~Player()=default;

            //method to load a player from some source (probably JSON?)
            bool loadFromSource(std::string&src)
            {
                return true;
            }

            int move(Schwarma::Entity*enemy)
            {
                auto end = this->triggers.end();
                for(auto it = this->triggers.begin(); it != end; ++it)
                {
                    if(it->name == "move")
                    {
                        try
                        {
                            if(Schwarma::evalCondition(it->condition,*this,*enemy))
                            {
                                if(it->action.actionType == "move")
                                {
                                    if(it->action.direction == "away")
                                    {
                                        if(enemy->position > this->position &&
                                        this->position != Schwarma::BOUND_LEFT)
                                        {
                                            this->position -= this->baseStats.movementSpeed;
                                            if(this->position < Schwarma::BOUND_LEFT)
                                                this->position = Schwarma::BOUND_LEFT;
                                            return this->position;
                                        }
                                        else if(enemy->position < this->position &&
                                        this->position != Schwarma::BOUND_RIGHT)
                                        {
                                            this->position += this->baseStats.movementSpeed;
                                            if(this->position > Schwarma::BOUND_RIGHT)
                                                this->position = Schwarma::BOUND_RIGHT;
                                            return this->position;
                                        }
                                    }
                                }
                            }
                        }
                        catch(std::runtime_error*e)
                        {
                            std::cout<<e->what()<<std::endl;
                            std::cout<<"In move trigger "<<it-this->triggers.begin()<<" for "<<this->name<<std::endl;
                        }
                    }
                }
                return -1;
            }
                                                                                              
            Schwarma::Weapon*attack(Schwarma::Entity*enemy)
            {
                auto end = this->triggers.end();
                for(auto it = this->triggers.begin(); it != end; ++it)
                {
                    if(it->name == "attack")
                    {
                        try
                        {
                            if(Schwarma::evalCondition(it->condition,*this,*enemy))
                            {
                                if(it->action.actionType == "attack")
                                {
                                   for(auto wit = this->weapons.begin(); wit != this->weapons.end(); ++wit)
                                   {
                                       if(wit->name == it->action.item)
                                       {
                                           return &(*wit);
                                       }
                                   } 
                                }
                                throw new std::runtime_error("Attack trigger "+(it-this->triggers.begin())+std::string(" evaluated true but could not execute"));
                            }
                        }
                        catch(std::runtime_error*e)
                        {
                            std::cout<<e->what()<<std::endl;
                            std::cout<<"In attack trigger "<<(it-this->triggers.begin())<<" for "<<this->name<<std::endl;
                        }
                    }
                }
                return nullptr;
                /*
                if((this->position - enemy->position) == 1 ||
                (enemy->position - this->position) == 1)
                    return 1;
                return 0;*/
            }

            //this needs to be thought out more
            //currently just prints result of enemy attack
            int defend(Schwarma::Entity*enemy)
            {
                //int damage = enemy->attack(this);
                //if(damage)
                  //  std::cout<<this->name<<" defended from "<<enemy->attack(this)<<" points of damage\n";
                //return damage;
            }
    };
}