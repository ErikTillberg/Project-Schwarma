#pragma once
#include <string>
namespace Schwarma
{
    class Condition
    {
        public:
            Condition
            (
                std::string lhs,
                std::string op,
                std::string rhs
            ) :
            lhs(lhs),op(op),rhs(rhs){}
            ~Condition()=default;
            std::string lhs;
            std::string op;
            std::string rhs;
    };
    class Action
    {
        public:
            Action
            (
                std::string actionType,
                std::string direction,
                std::string item,
                std::string card
            ) :
            actionType(actionType),direction(direction),item(item),card(card){}
            ~Action()=default;
            std::string actionType;
            std::string direction;
            std::string item;
            std::string card;
    };
    class Trigger
    {
        public:
            Trigger()=default;
            ~Trigger()=default;
            std::string name;
            Condition condition;
            Action action;

    };
}