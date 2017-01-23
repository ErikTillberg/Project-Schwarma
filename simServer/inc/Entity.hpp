#include <fstream>
#include <string>
namespace Schwarma
{
    class Entity
    {
        public:
            int position = 0;
            virtual bool loadFromSource(std::string&) = 0;
    };
}