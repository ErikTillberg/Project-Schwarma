#pragma once
#include <string>

#include <cstdlib>

#include "../rapidjson/include/rapidjson/document.h"
#include "../rapidjson/include/rapidjson/istreamwrapper.h"
#include "../rapidjson/include/rapidjson/ostreamwrapper.h"
#include "../rapidjson/include/rapidjson/prettywriter.h"
namespace Schwarma
{
    //! Class describing a weapon wielded by an Entity  
    class Weapon
    {
        public:
            Weapon
            (
                std::string name,
                int damage,
                std::string element
            ) : 
            name(name),damage(damage),element(element){}
            ~Weapon() = default;
            std::string name;
            int damage;
            std::string element;

            template<class T>
            static Schwarma::Weapon parseWeapon(T&obj)
            {
                if(obj.HasMember("name") && obj.HasMember("damage") && obj.HasMember("element"))
                {
                    return Schwarma::Weapon
                    (
                        obj["name"].GetString(),
                        std::atoi(obj["damage"].GetString()),
                        obj["element"].GetString()
                    );
                }
                else
                {
                    return Schwarma::Weapon
                    (
                        "",
                        0,
                        ""
                    );
                }
            }
    };
}