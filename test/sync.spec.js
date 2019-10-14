
import chai from 'chai';
import sinon from 'sinon';

import sync from '..';

const { expect } = chai;


describe('sync', () => {
  it('should return an animation obj', () => {
    const animation = sync('test');

    expect(animation).to.have.property('free');
    expect(animation).to.have.property('pause');
    expect(animation).to.have.property('stop');
    expect(animation).to.have.property('start');
  });


  it('should setup event listeners', () => {
    sinon.spy(window, 'addEventListener');

    sync('test');

    expect(window.addEventListener.getCall(0).args[0]).to.equal('animationstart');
    expect(window.addEventListener.getCall(1).args[0]).to.equal('animationiteration');
  });


  it('should free event listeners', () => {
    sinon.spy(window, 'removeEventListener');

    const animation = sync('test');
    animation.free();

    expect(window.removeEventListener.getCall(0).args[0]).to.equal('animationstart');
    expect(window.removeEventListener.getCall(1).args[0]).to.equal('animationiteration');
  });
});
