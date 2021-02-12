const {_setDateTitle} = require('../src/calendar.js');
var assert = require('assert');

describe('_setDateTitle', function(){
    it('Should return the type of string',function(){
        let thing = _setDateTitle();
        assert.typeOf(thing, 'string');

    })
})
