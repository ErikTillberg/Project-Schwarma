import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import fs = require('fs'); 
    

/**
 * / route
 *
 * @class User
 */
export class IndexRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[IndexRoute::create] Creating index route.");

    //add route
    router.post("/", (req: Request, res: Response, next: NextFunction) => {
      new IndexRoute().index(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The route.
   *
   * @class IndexRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public index(req: Request, res: Response, next: NextFunction) {
    var spawn = require('child_process').spawnSync;
    //TODO add authentification
    console.log('POST: ',JSON.stringify(req.body));
     
    //TODO validate JSON
    var body = req.body;
    try {
      var player1 = body.players[0];
      var player2 = body.players[1];
      fs.writeFileSync("player1.json", JSON.stringify(player1), 'utf8');
      fs.writeFileSync("player2.json", JSON.stringify(player2), 'utf8');
    }
    catch (err) {
      console.log("Error writing playerX.json to disk");
      res.status(500);
      res.send("Internal Error")
    };
    
    try {
      var opts = {stdio: 'inherit'};
      spawn('simServer.exe', ["player1.json", "player2.json", "simulation.json"], opts);
    }
    catch (err) {
      console.log("Error spawning child process for simulation");
      res.status(500);
      res.send("Internal Error")
    }

    try {
      var sim = JSON.stringify(fs.readFileSync("simulation.json"));
    }
    catch (err) {
      console.log("Error reading simulation.json from disk");
      res.status(500);
      res.send("Internal Error")
    }

    res.send(JSON.stringify(sim));
  }
}