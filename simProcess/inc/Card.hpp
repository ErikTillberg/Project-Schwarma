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
            std::string name;
            double value;
            std::string element;
            double elemental_value;
            std::string direction;

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