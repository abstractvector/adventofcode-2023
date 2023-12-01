"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var _a = process.argv, dayChallenge = _a[2];
var moduleFile = (0, node_path_1.resolve)("src/".concat(dayChallenge, "/index.ts"));
await Promise.resolve("".concat(moduleFile)).then(function (s) { return require(s); });
