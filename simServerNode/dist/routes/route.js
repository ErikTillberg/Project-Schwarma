"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRoute {
    constructor() {
        this.title = "Advanced Project Server";
        this.scripts = [];
    }
    addScript(src) {
        this.scripts.push(src);
        return this;
    }
}
exports.BaseRoute = BaseRoute;
