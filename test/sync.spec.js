
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

  it('should sync animations with the same name', () => {
    const animation = sync('test1');
    const testDiv1 = document.getElementById('test-1');
    const testDiv2 = document.getElementById('test-2');

    const animationEvent1 = Object.assign(new window.Event('animationstart', { bubbles: true }), { animationName: 'test1' });
    const animationEvent2 = Object.assign(new window.Event('animationstart', { bubbles: true }), { animationName: 'test1' });

    testDiv1.dispatchEvent(animationEvent1);
    expect(animation.getElements().size).to.equal(1);

    testDiv2.dispatchEvent(animationEvent2);
    expect(animation.getElements().size).to.equal(2);
  });

  it('should sync animations with differnt names', () => {
    const animation = sync(['test1', 'test2']);
    const testDiv1 = document.getElementById('test-1');
    const testDiv2 = document.getElementById('test-2');

    const animationEvent1 = Object.assign(new window.Event('animationstart', { bubbles: true }), { animationName: 'test1' });
    const animationEvent2 = Object.assign(new window.Event('animationstart', { bubbles: true }), { animationName: 'test2' });

    testDiv1.dispatchEvent(animationEvent1);
    expect(animation.getElements().size).to.equal(1);

    testDiv2.dispatchEvent(animationEvent2);
    expect(animation.getElements().size).to.equal(2);
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
