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
     
    var body = req.body;
    var fileNameData = "battleData" + body.battle_id + ".json";
    var fileNameSim = "simulation" + body.battle_id + ".json";

    try {
      fs.writeFileSync(fileNameData, JSON.stringify(body), 'utf8');
    }
    catch (err) {
      console.log("Error writing battleData json to disk");
      res.status(500).send("Internal Error");
    };
    
    try {
      var opts = {stdio: 'inherit'};
      spawn('simServer.exe', [fileNameData, fileNameSim, "json"], opts);
    }
    catch (err) {
      console.log("Error spawning child process for simulation");
      res.status(500).send("Internal Error");
    }

    try {
      var sim = fs.readFileSync(fileNameSim);
    }
    catch (err) {
      console.log("Error reading simulation json from disk");
      res.status(500).send("Internal Error");
    }

    res.send(sim);
  }
}