import { expect } from 'chai';
const spies = require('chai-spies');
const Window = require('window');
chai.use(spies);
import '../src/scripts.js';
const window = new Window();
// global.document = {};
const { document } = new Window();

describe.only('DOM functionality', function() {
    before(function() {
        chai.spy.on(document, ['querySelector'], () => {})
    })

    it('should be called once', function() {
        expect(document.querySelector).to.have.been.called(1);
    })
})