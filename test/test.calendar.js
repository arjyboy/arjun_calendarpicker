var assert = require('assert');
const customDate = require('../src/calendar.js')._setDateTitle;


describe('App', function(){
    it('Should return the type as of string',function(){
        let thing = _setDateTitle();
        assert.typeOf(thing, 'string');

    })
})