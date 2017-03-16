#pragma once
#include "Entity.hpp"
namespace Schwarma
{
    //! Evaluates the conditional expression given in it's parameters.
    template<class T1,class T2>
    inline bool evalConditionalExpression(const std::string&op,const T1&lhs,const T2&rhs)
    {
        if(op == Schwarma::ConditionalOperators::GREATER_THAN_OR_EQUAL_TO)
        {
            if(lhs >= rhs)
                return true;
        }
        else if(op == Schwarma::ConditionalOperators::GREATER_THAN)
        {
            if(lhs > rhs)
                return true;
        }
        else if(op == Schwarma::ConditionalOperators::EQUALS)
        {
            if(lhs == rhs)
                return true;
        }
        else if(op == Schwarma::ConditionalOperators::LESS_THAN_OR_EQUAL_TO)
        {
            if(lhs <= rhs)
                return true;
        }
        else if(op == Schwarma::ConditionalOperators::LESS_THAN)
        {
            if(lhs < rhs)
                return true;
        }
        return false;
    }
    //! Evaluates the Condition condition, using Entity a and b. Validates the Condition, throws exception if invalid.
    inline bool evalCondition(const Schwarma::Condition&condition,Schwarma::Entity&a,Schwarma::Entity&b)
    {
        if(condition.lhs == "distance")
        {
            if(Schwarma::Distance.count(condition.rhs) == 0)
                throw new std::runtime_error(std::string("Invalid rhs \"")+condition.rhs+std::string("\"")+" in condition \""+condition.lhs+condition.op+condition.rhs+"\"");
            return Schwarma::evalConditionalExpression<int,int>
            (
                condition.op,
                a.distance(b),
                Schwarma::Distance[condition.rhs]
            );    
        }
        else if(condition.lhs == "playerHP")
        {
            return Schwarma::evalConditionalExpression<int,int>
            (
                condition.op,
                std::atoi(a.stats.health),
                std::atoi(condition.rhs)
            );
        }
        else if(condition.lhs == "enemyHP")
        {
            return Schwarma::evalConditionalExpression<int,int>
            (
                condition.op,
                std::atoi(b.stats.health),
                std::atoi(condition.rhs)
            );
        }
        throw new std::runtime_error(std::string("Invalid rhs \"")+condition.rhs+std::string("\"")+" in condition \""+condition.lhs+condition.op+condition.rhs+"\"");
    }
}