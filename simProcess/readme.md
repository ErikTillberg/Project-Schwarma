# simProcess.exe

Simulation process used to simulate one round of a battle between two players.
## Building
Assumes g++ is in your systems PATH.
### Windows
```
> install
> build
```
### Linux, Msys Bash / Cygwin Bash 
```
$ bash install.bash
$ bash build.bash
```
## Usage:
```
simProcess player1.json player2.json outPutFile outPutFormat
```
Where

player1.json, player2.json are the paths to two unique JSON files describing players
1 and 2 respectively. See sample.json for outline of document format.
  
outPutFile is the path to a file to write output to.  
Note: If a value of "cout" is passed for outPutFile then output will be directed to the console.

outPutFormat(optional) denotes the format to output.  
Note: The only valid value for this argument is "json" to output in JSON format. If no outPutFormat is supplied,
or a value other than "json" is supplied then the output format will be human readable English.