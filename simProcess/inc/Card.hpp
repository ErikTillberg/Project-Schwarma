#pragma once
#include <string>

#include <cstdlib>

#include "../rapidjson/include/rapidjson/document.h"
#include "../rapidjson/include/rapidjson/istreamwrapper.h"
#include "../rapidjson/include/rapidjson/ostreamwrapper.h"
#include "../rapidjson/include/rapidjson/prettywriter.h"
namespace Schwarma
{
    //! Class describing a Card wielded by an Entity  
    class Card
    {
        public:
            Card
            (
                std::string name,
                double value,
                std::string element,
                double elemental_value,
                std::string direction
            ) : 
            name(name),value(value),element(element),elemental_value(elemental_value),direction(direction){}
            ~Card() = default;
            //! Card name
            std::string name;
            //! Card value(interpreted differently depending on how the card is invoked)
            double value
            //! Element of the card
            std::string element;
            //! Special elementl value of the card. Also interpreted differently depending on how the card is invoked
            double elemental_value;
            //! Direction to travel. Used only for mobility cards
            std::string direction;

            //!Parse the card out of the json object pointed to by obj
            /*! Will fill properties that don't exist with empty strings.
                Returns Card full of empty strings on failure
            */
            template<class T>
            static Schwarma::Card parseCard(T&obj)
            {
                return Schwarma::Card
                (
                    obj.HasMember("name") ? obj["name"].GetString() : "",
                    obj.HasMember("value") ? obj["value"].GetDouble() : 0,
                    obj.HasMember("element") ? obj["element"].GetString() : "",
                    obj.HasMember("element_value") ? obj["element_value"].GetDouble() : 0,
                    obj.HasMember("direction") ? obj["direction"].GetString() : ""
                );
            }
    };
}