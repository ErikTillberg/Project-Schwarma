#pragma once
#include <iostream>
#include <string>
#include "Entity.hpp"
#include "eval.hpp"
namespace Schwarma
{
    //! Class representing a player character in the game world
    class Player : public Schwarma::Entity
    {
        public:
            Player()=default;
            ~Player()=default;

            //! Method to load a player from some source (probably JSON?)
            bool loadFromSource(std::string&src)
            {
                return true;
            }
            //! Attempt to evaluate a move trigger against enemy
            /*!
                \return new position in the world if successful, -1 on failure
            */
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
                                if(it->action.actionType == "mobility")
                                {
                                    for(auto cit = this->cards.begin(); cit != this->cards.end(); ++cit)
                                    {
                                        if(cit->name == it->action.item)
                                        {
                                    
                                            if(cit->direction == "away")
                                            {
                                                //std::cerr<<"away\n";
                                                if(enemy->position > this->position /*&&
                                                this->position != Schwarma::BOUND_LEFT*/)
                                                {
                                                    this->position -= this->baseStats.movementSpeed;
                                                }
                                                else if(enemy->position < this->position /*&&
                                                this->position != Schwarma::BOUND_RIGHT*/)
                                                {
                                                    this->position += this->baseStats.movementSpeed;
                                                }
                                            }
                                            else if(cit->direction == "toward")
                                            {
                                                //std::cerr<<"toward\n";
                                                if(enemy->position > this->position/* &&
                                                this->position != Schwarma::BOUND_LEFT*/)
                                                {
                                                    this->position += this->baseStats.movementSpeed;
                                                }
                                                else if(enemy->position < this->position /*&&
                                                this->position != Schwarma::BOUND_RIGHT*/)
                                                {
                                                    this->position -= this->baseStats.movementSpeed;
                                                }
                                            }
                                        }
                                    }

                                    if(this->position < Schwarma::BOUND_LEFT)
                                        this->position = Schwarma::BOUND_LEFT;
                                    if(this->position > Schwarma::BOUND_RIGHT)
                                        this->position = Schwarma::BOUND_RIGHT;
                                    return this->position;
                                }
                            }
                        }
                        catch(std::runtime_error*e)
                        {
                            std::cerr<<e->what()<<std::endl;
                            std::cerr<<"In move trigger "<<it-this->triggers.begin()<<" for "<<this->name<<std::endl;
                        }
                    }
                }
                return -1;
            }
            //! Attempt to evaluate an attack trigger against enemy
            /*!
                \return card used to attack if successful, nullptr on failure
            */
            const Schwarma::Card*attack(Schwarma::Entity*enemy)
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
                                   for(auto wit = this->cards.begin(); wit != this->cards.end(); ++wit)
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
                            std::cerr<<e->what()<<std::endl;
                            std::cerr<<"In attack trigger "<<(it-this->triggers.begin())<<" for "<<this->name<<std::endl;
                        }
                    }
                }
                return nullptr;
            }


            const Schwarma::Card*defend(Schwarma::Entity*enemy)
            {
                auto end = this->triggers.end();
                for(auto it = this->triggers.begin(); it != end; ++it)
                {
                    if(it->name == "defense")
                    {
                        try
                        {
                            if(Schwarma::evalCondition(it->condition,*this,*enemy))
                            {
                                if(it->action.actionType == "defense")
                                {
                                   for(auto card = this->cards.begin(); card != this->cards.end(); ++card)
                                   {    
                                       if(card->name == it->action.item)
                                       {
                                           return &(*card);
                                       }
                                   } 
                                }
                                throw new std::runtime_error("Defemse trigger "+(it-this->triggers.begin())+std::string(" evaluated true but could not execute"));
                            }
                        }
                        catch(std::runtime_error*e)
                        {
                            std::cerr<<e->what()<<std::endl;
                            std::cerr<<"In defense trigger "<<(it-this->triggers.begin())<<" for "<<this->name<<std::endl;
                        }
                    }
                }
                return nullptr;
            }
    };
}