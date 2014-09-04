
'use strict';

var graft   = require('../');
var expect  = require('must');

describe('.where support', function() {
  var first;
  var second;

  beforeEach(function() {
    first = graft();
    second = graft();
  });

  it('must route matching messages to the second instance', function(done) {
    first
      .where({ hello: 'world' }, second)
      .on('data', function() {
        done(new Error('not expected'));
      });

    second.on('data', function(req) {
      expect(req.msg).to.eql({ hello: 'world', name: 'matteo' });
      done();
    });

    first.write({ hello: 'world', name: 'matteo' });
  });

  it('must keep not matching messages on the pipeline', function(done) {
    first
      .where({ hello: 'world' }, second)
      .on('data', function(req) {
        expect(req.msg).to.eql({ hello: 'matteo' });
        done();
      });

    first.write({ hello: 'matteo' });
  });

  it('must stay the same instance', function() {
    var b = first.where({ hello: 'world' }, second);

    expect(b).to.be(first);
  });
});
