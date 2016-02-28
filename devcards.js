var createAtom = require('js-atom').createAtom;

var React = require('react');
var ReactDOM = require('react-dom');

var $ = React.createElement;

var devcardApi = require('./lib/devcard-api');

var DevCards = require('./lib/components/DevCards');

var DEVCARDS_DIV_ID = '__devcards-root';

// Singleton state
// TODO: eliminate?
var catalog = {};

exports.ns = ns;
function ns(name) {
  // Because execution of a loaded module is synchronous
  // we can expect a reloading namespace to be filled
  // in a single pass of the event loop
  // therefore we can enqueue a reRender for the next tick
  var cards = catalog[name] = [];
  function add(card) {
    cards.push(card);
    enqueueRender();
  }
  return devcardApi(add);
}

exports.atom = createAtom;

/**
 * Rendering
 */
function getRoot() {
  /* eslint-env browser */
  var root = document.getElementById(DEVCARDS_DIV_ID);
  if (root) return root;

  var newRoot = document.createElement('div');
  newRoot.id = DEVCARDS_DIV_ID;
  document.body.appendChild(newRoot);
  return newRoot;
}

function enqueueRender() {
  cancelAnimationFrame(enqueueRender.timer);
  enqueueRender.timer = requestAnimationFrame(render, 0);
}
function render() {
  ReactDOM.render($(DevCards, { catalog: catalog }), getRoot());
}
