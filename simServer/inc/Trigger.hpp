#pragma once
#include <string>
namespace Schwarma
{
    class Condition
    {
        public:
            Condition()=default;
            ~Condition()=default;
            std::string lhs;
            std::string op;
            std::string rhs;
    };
    class Action
    {
        public:
            Action()=default;
            ~Action()=default;
            std::string actionType;
            std::string direction;
    }
    class Trigger
    {
        public:
            Trigger()=default;
            ~Trigger()=default;
            std::string name;
            Condition condition;
            Action action;

    }
}