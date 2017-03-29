import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import {IndexRoute} from "./routes/index";

import * as fs from "fs";
import * as cp from "child_process";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //use logger middleware
    this.app.use(logger("dev"));

    //use json form parser middleware
    //this.app.use(bodyParser.json());

    this.app.use(function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
        data += chunk;
    });
    req.on('end', function() {

      /*  req.body = JSON.parse(data);
        var fileNameData = "battleData" + req.body.battle_id + ".json";
        fs.writeFileSync(fileNameData, JSON.stringify(data), 'utf8');
        next();*/




    var body = JSON.parse(data.toString());
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
      fs.writeFileSync(fileNameSim,"");
      let status = cp.spawnSync("./simProcess",[fileNameData,fileNameSim,"json"]);
      console.log("simProcess error "+status.error);
      console.log("simProcess stdou "+status.stdout.toString());
      console.log("simProcess stderr "+status.stderr.toString());
    }
    catch (err) {
      console.log("Error spawning child process for simulation. "+err);
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







    });
});

    //use override middleware
    this.app.use(methodOverride());

    //catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //error handling
    this.app.use(errorHandler());
 }  

  /**
  * Create router.
  *
  * @class Server
  * @method config
  * @return void
  */
 private routes() {
    let router: express.Router;
    router = express.Router();

    //IndexRoute
    IndexRoute.create(router);

    //use router middleware
    this.app.use(router);
 }
}