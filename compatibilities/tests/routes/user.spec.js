const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../../index');
const sinon = require('sinon')

const User = require('./../../models/all-models').userModel;

const userService = require('./../../service/users');

const logger = require('./../../utils/logger')

//users
const userRoutes = require('./../../routes/user');

let userId1;
let userId2;

describe('Unit testing the / route', async function() {

    before((done) => {
        const user1 = new User({
            name: "Paul",
            age: 24
        });

        const user2 = new User({
            name: "Jimmy",
            age: 45
        });

        userService.createUser(user1)
            .then((result) => {
                logger.info(`user saved ok: ${result._id}`)
                userId1 = result._id;

            })
            .catch(() => {
                logger.error(`user not saved`);
                throw (new Error('user not saved'))
                done();
            })

        userService.createUser(user2)
            .then((result) => {
                logger.info(`user saved ok: ${result._id}`)
                userId2 = result._id;

            })
            .catch(() => {
                logger.error(`user not saved`);
                throw (new Error('user not saved'))
                done();
            })

        done();
    })

    after((done) => {
        userService.deleteUser(userId1)
            .then(() => {
                logger.info(`deleted user: ${userId1}`)

            })
            .catch(() => {
                logger.error('error')
                done()
            })

        userService.deleteUser(userId2)
            .then(() => {
                logger.info(`deleted user: ${userId2}`)
            })
            .catch(() => {
                logger.error('error')
                done()
            })
        done()

    })

    it('should return OK status', function(done) {
        request(app)
            .get('/')
            .then(function(response) {
                assert.equal(response.status, 200)
                done();
            })
            .catch((err) => {
                logger.error(`error: ${err}`)
                done();
            })
    });

    it('should return a single user', function(done) {
        request(app)
            .get('/v1/user/getUser/' + userId1)
            .then(function(response) {
                assert.equal(response.status, 200)
                done()
            })
    });



});