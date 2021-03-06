import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import {IndexRoute} from "./routes/index";

import sleep from "./sleep";

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
    //req.setEncoding('utf8');
    req.on('data', function(chunk) { 
        data += chunk;
    });
    req.on('end', function() {

      console.log("original: \n"+data);
      fs.writeFileSync("original.json",data);
      sleep(2);
      //Start and end of the whole object are getting quoted
      //data = data.replace(new RegExp("(\"{)","g"),"{");
     // data = data.replace(new RegExp("(\"})","g"),"}");
      data = data.replace(new RegExp("(\\\\)","g"),"");

      if(data[0] == "\"")
        data = data.substr(1);
      if(data[data.length - 1] == "\"")
        data = data.slice(0,-1);

      data = data.replace(new RegExp("(u003e)","g"),">");
      data = data.replace(new RegExp("(u003c)","g"),"<");
      data = data.replace(new RegExp("(u003d)","g"),"=");

      fs.writeFileSync("cleaned.json",data);
      (<any>req).rawBody = data;
      req.body = JSON.parse(data);
      next();
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