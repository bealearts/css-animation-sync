
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import sync from '../';

chai.use(chaiAsPromised);
const expect = chai.expect;


describe('sync', () => {
    it('should return an animation obj', () => {
        const animation = sync('test');

        expect(animation).to.have.property('free');
        expect(animation).to.have.property('pause');
        expect(animation).to.have.property('stop');
        expect(animation).to.have.property('start');
    });
});
