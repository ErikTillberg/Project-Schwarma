#pragma once
#include <string>

#include "../rapidjson/include/rapidjson/document.h"
#include "../rapidjson/include/rapidjson/istreamwrapper.h"
#include "../rapidjson/include/rapidjson/ostreamwrapper.h"
#include "../rapidjson/include/rapidjson/prettywriter.h"
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
            Trigger
            (
                std::string name,
                Schwarma::Condition condition,
                Schwarma::Action action
            ) :
            name(name),condition(condition),action(action){}
            ~Trigger()=default;
            std::string name;
            Condition condition;
            Action action;

            template< class T>
            static Schwarma::Trigger parseTrigger(T&obj,const char*objName)
            {
                auto&condition = obj["condition"];
                auto&action = obj["action"];
                if(condition.GetType() == rapidjson::Type::kObjectType &&
                action.GetType() == rapidjson::Type::kObjectType)
                {
                    return Schwarma::Trigger
                    (
                        objName,
                        Schwarma::Condition
                        (
                            condition.HasMember("lhs") ? condition["lhs"].GetString() : "",
                            condition.HasMember("operator") ? condition["operator"].GetString() : "",
                            condition.HasMember("rhs") ? condition["rhs"].GetString() : ""
                        ),
                        Schwarma::Action
                        (
                            action.HasMember("actionType") ? action["actionType"].GetString() : "",
                            action.HasMember("direction") ? action["direction"].GetString() : "",
                            action.HasMember("item") ? action["item"].GetString() : "",
                            action.HasMember("card") ? action["card"].GetString() : ""
                        )
                    );
                }
                return Schwarma::Trigger(objName,Schwarma::Condition("","",""),Schwarma::Action("","","",""));
            }
    };
}