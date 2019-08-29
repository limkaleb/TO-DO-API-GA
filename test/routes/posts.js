const Item = require("../../models/Item");
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);


describe('Item', () => {
    beforeEach((done) => {
        Item.deleteMany({}, (err) => {
            done(err);
        });
    });

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
                    expect(res).to.have.status(201);
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

    describe('GET/:wrong id', function () {
        it('should show error because id not found when get single content', function (done) {
            chai.request(app)
                .get('/posts/' + 'randomid123')
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('msg').eql('Something is error when getting data');

                    done();
                });
        })
    });

    describe('render index page', function () {
        it('should show ok', function (done) {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    expect(res).to.have.status(200);

                    done();
                })
        })
    });

    describe('GET/:wrong end point', function () {
        it('should show error because end point is wrong', function (done) {
            chai.request(app)
                .get('/post/')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.be.a('object');

                    done();
                });
        })
    });

    describe('DELETE /:wrong id', function () {
        it('should show error because id not found when deleting', function (done) {
            chai.request(app)
                .delete('/posts/' + 'randomid123')
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('msg').eql('Something is error when deleting an item');

                    done();
                });
        })
    });

    describe('UPDATE /:wrong id', function () {
        it('should show error because id not found when updating', function (done) {
            chai.request(app)
                .put('/posts/' + 'randomid123')
                .send({ content: 'updated post' })
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('success', false);
                    expect(res.body).to.have.property('msg').eql('Something is error when updating an item');

                    done();
                });
        })
    });

    describe('/POST function', () => {
        it('it should show error because inputted field is wrong', (done) => {
            let itemSample = {
                contentZ: "Buy groceries"
            }
            chai.request(app)
                .post('/posts')
                .send(itemSample)
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('success').eql(false);
                    expect(res.body).to.have.property('msg').eql('Something is error when creating an item');

                    done();
                });
        });
    });

    describe('/DELETE all items', () => {
        it('should destroy all post', function (done) {
            chai.request(app)
                .delete('/posts/')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('msg').eql('Delete all items is success');
                    expect(res.body.result).to.have.property('n');

                    done();
                });
        })
    });
});