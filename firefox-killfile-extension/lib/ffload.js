"use strict";

/*
 * Trick the linker. Trollstore needs this.
 var fakey = require('sdk/simple-storage');
 */
var sandbox = require("sdk/loader/sandbox");

function sandboxLoadLibrary(libname) {
  var prevLoading = this.nowLoading;
  try {
    this.nowLoading = libname;
    this._load(libname);
  } finally {
    this.nowLoading = prevLoading;
  }
}

function sandboxDefine(dryRun, libname, deps, generator) {
  if (this.defined.indexOf(this.nowLoading) >= 0) {
    return;
  }
  var args = [];
  for(var i = 0; i < deps.length; i++) {
    var resolvedDep = deps[i].toLowerCase();
    if (/^\./.test(resolvedDep)) {
      resolvedDep = this.nowLoading.replace(/[^\/]*$/, '') + resolvedDep;
      while (/\/\.\.\//.test(resolvedDep)) {
        resolvedDep = resolvedDep.replace(/[^\/.]*\/\.\.\//, '', 'g');
      }
      while (/(^|\/)\.\//.test(resolvedDep)) {
        resolvedDep = resolvedDep.replace(/\/\.\//, '/', 'g');
        resolvedDep = resolvedDep.replace(/^\.\//, '', 'g');
      }
    }
    if (/^sdk\//.test(resolvedDep)) {
      this.definedModules[resolvedDep] = require(resolvedDep);
    } else {
      this.loadLibrary(resolvedDep + '.js');
    }
    if (!dryRun) {
      args.push(this.definedModules[resolvedDep]);
    }
  }
  if (!dryRun) {
    this.definedModules[this.nowLoading] = generator.apply(this, args);
  }
  this.defined.push(this.nowLoading);
}

var depComputingSandbox = sandbox.sandbox();
depComputingSandbox.console = console;
depComputingSandbox.defined = [];
depComputingSandbox.nowLoading = undefined;
depComputingSandbox._load = sandbox.load.bind(sandbox, depComputingSandbox);
depComputingSandbox.loadLibrary = sandboxLoadLibrary.bind(depComputingSandbox);
depComputingSandbox.define = sandboxDefine.bind(depComputingSandbox, true);


function computeDeps(url) {
  if (url.substr(-3) != '.js') {
    url += '.js';
  }
  depComputingSandbox.defined = [];
  depComputingSandbox.loadLibrary(url);
  var retval = depComputingSandbox.defined;
  console.log("Returning from computeDeps: " + JSON.stringify(retval));
  return retval;
}

function Loader() {
  this.sandbox = sandbox.sandbox();
  this.sandbox.console = console;
  this.sandbox.defined = [];
  this.sandbox.nowLoading = undefined;
  this.sandbox._load = sandbox.load.bind(sandbox, this.sandbox);
  this.sandbox.loadLibrary = sandboxLoadLibrary.bind(this.sandbox);
  this.sandbox.define = sandboxDefine.bind(this.sandbox, false);
  this.sandbox.definedModules = {};
}

Loader.prototype.get = function loaderGet(url) {
  if (url.substr(-3) != '.js') {
    url += '.js';
  }
  this.sandbox.loadLibrary(url);
  return this.sandbox.definedModules[url];
}

exports.loader = function() {return new Loader();}
exports.computeDeps = computeDeps;
