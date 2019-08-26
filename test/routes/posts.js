const mongoose = require("mongoose");
const Item = require("../../models/Item");
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('/GET all function', function () {
    it('should show OK', function (done) {
        this.timeout(5000);
        chai.request(app)
            .get('/posts')
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success', true);
                expect(res).to.be.a('object');

                done();
            });
    });
});

describe('/POST function', () => {
    it('it should POST an item', (done) => {
        let itemSample = {
            content: "Buy groceries"
        }
        chai.request(app)
            .post('/posts')
            .send(itemSample)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.result).to.have.property('content');
                expect(res.body).to.have.property('success').eql(true);

                done();
            });
    });
});

describe('GET/:id item', function () {
    it('should get a post by given id', function (done) {
        let itemSample = new Item({
            content: 'Sample only'
        });
        itemSample.save((err, item) => {
            chai.request(app)
                .get('/posts/' + item.id)
                .send(item)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.result).to.have.property('content');
                    expect(res.body.result).to.have.property('_id').eql(item.id);

                    done();
                });
        })
    });
});

describe('/PUT/:id item', () => {
    it('should update a post by given id', function (done) {
        let itemSample = new Item({
            content: 'Sample only'
        });
        itemSample.save((err, item) => {
            chai.request(app)
                .put('/posts/' + item.id)
                .send({ content: 'updated post' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('msg').eql('Update an item is success');
                    expect(res.body.result).to.have.property('content').eql('updated post');

                    done();
                });
        })
    });
});

describe('/DELETE/:id item', () => {
    it('should destroy a post by given id', function (done) {
        let itemSample = new Item({
            content: 'Sample only'
        });
        itemSample.save((err, item) => {
            chai.request(app)
                .delete('/posts/' + item.id)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('msg').eql('Delete an item is success');
                    expect(res.body.result).to.have.property('n').eql(1);

                    done();
                });
        })
    });
});