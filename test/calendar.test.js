
import { html, render } from '../node_modules/lit-html/lit-html.js';
const {calendar} = require('../src/calendar.js');
var assert = require('assert');

describe('App', function(){
    it('Should return the type of string',function(){
        let thing = _setDateTitle();
        assert.typeOf(thing, 'string');

    })
})
