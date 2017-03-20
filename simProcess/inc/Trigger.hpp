#pragma once
#include <string>

#include "../rapidjson/include/rapidjson/document.h"
#include "../rapidjson/include/rapidjson/istreamwrapper.h"
#include "../rapidjson/include/rapidjson/ostreamwrapper.h"
#include "../rapidjson/include/rapidjson/prettywriter.h"
namespace Schwarma
{
    //! Class describing the condition which must be true in order to take an action in a Trigger
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
    //! Class describing an action to take by a player when a Trigger is evaluated successfully
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
    //! Class describing an action trigger
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

            //!Parse the trigger out of the json object pointed to by obj
            /*!Set its name to objName
                Will fill properties that don't exist with empty strings.
                Returns Trigger full of empty strings on failure
            */
            template<class T>
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