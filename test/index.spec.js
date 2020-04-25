const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');

/**********************************
 *        back-end testing        *
 **********************************/
describe('Back-end testing', () => {

  before(() => {
    this.log = sinon.stub(console, 'log');
  });

  afterEach(() => {
    this.log.restore();
  });

  it('should log something', () => {
    console.log('hey there');
    expect(console.log.calledWith('hey there')).to.be.true;
  })

  it('should launch the server', (done) => {
    const server = require('../index');

    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('This is the front page');
        done();
      });
  });

});
