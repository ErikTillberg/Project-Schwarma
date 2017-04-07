"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const fs = require("fs");
class IndexRoute extends route_1.BaseRoute {
    static create(router) {
        console.log("[IndexRoute::create] Creating index route.");
        router.post("/", (req, res, next) => {
            new IndexRoute().index(req, res, next);
        });
    }
    constructor() {
        super();
    }
    index(req, res, next) {
        var spawn = require('child_process').spawnSync;
        var body = req.body;
        var fileNameData = "battleData" + body.battle_id + ".json";
        var fileNameSim = "simulation" + body.battle_id + ".json";
        try {
            fs.writeFileSync(fileNameData, JSON.stringify(body), 'utf8');
        }
        catch (err) {
            console.log("Error writing battleData json to disk");
            res.status(500).send("Internal Error");
        }
        ;
        try {
            var opts = { stdio: 'inherit' };
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
exports.IndexRoute = IndexRoute;
