'use strict';
const express = require('express');
const getModel = require('../middleware/params.js');
// const logger = require('../middleware/logger.js');
// const timestamp = require('../middleware/timestamp.js');
const bearerAuth = require('../src/auth/middleware/bearer');
const permissions = require('../src/auth/middleware/authorize');

const UserModelIns = require('../src/auth/models/users-model');
const basicAuth = require('../src/auth/middleware/basic');

const router = express.Router();

router.post('/signup', signUpHandler);
router.post('/signin', basicAuth, signInHandler);
router.get('/users', usersHandler);

router.param('model', getModel);
router.get('/:model', bearerAuth, permissions('read'), getAllhandler);
router.get('/:model/:id', bearerAuth, permissions('read'), getOneHandler);
router.post('/:model', bearerAuth, permissions('create'), postHandler);
router.put('/:model/:id', bearerAuth, permissions('update'), editHandler);
router.patch('/:model/:id', bearerAuth, permissions('update'), editHandler);
router.delete('/:model/:id', bearerAuth, permissions('delete'), deleteHandler);

/**
 * Router module which gets the models from the params and use the express router to get/post/put/patch/delete
 * @module router
 */

/**
 * Get all function
 * @param   req
 * @param   res
 * @param   next
 * @function getAllhandler
 */

/** 
 *  * Get one function
 * @param   req
 * @param   res
 * @param   next
 * @function getOneHandler

 */

/** 
 *  * Get one function
 * @param   req
 * @param   res
 * @param   next
 * @function postHandler

 */

/** 
 *  * Get one function
 * @param   req
 * @param   res
 * @param   next
 * @function editHandler

 */

/** 
 *  * Get one function
 * @param   req
 * @param   res
 * @param   next
 * @function deleteHandler

 */

 
/** 
 *  * Get one function
 * @param   req
 * @param   res
 * @param   next
 * @function signUpHandler

 */
 
/** 
 *  * Get one function
 * @param   req
 * @param   res
 * @param   next
 * @function signInHandler

 */
 
/** 
 *  * Get one function
 * @param   req
 * @param   res
 * @param   next
 * @function usersHandler

 */

 
function getAllhandler(req, res, next) {
  req.model.get().then((data)=> res.json(data))
    .catch(next);   
}
function getOneHandler(req, res, next) {
  req.model.get(req.params.id).then((data)=> res.json(data))
    .catch(next); 
}
function postHandler(req, res, next) {
  req.model.create(req.body).then(data=> res.json(data))
    .catch(next);
}
function editHandler(req, res, next) {
  req.model.update(req.params.id, req.body).then(data=> res.json(data))
    .catch(next); 
}
function deleteHandler(req, res, next) {
  req.model.delete(req.params.id).then(data=> res.json(data))
    .catch(next);  
}

function signUpHandler(req, res){
  UserModelIns.save(req.body).then((data) => { //save or create?
    req.token = UserModelIns.generateToken(data);
    req.user = {
      username: data.username,
      acl: data.acl,
    };
    res.cookie('auth', req.token);
    res.set('auth', req.token);
    console.log(req.user);
    res.json({user: req.user, token: req.token});        
  }).catch((err) => res.status(403).send('Error in sign up!!'));
}

function signInHandler(req, res){
  res.cookie('auth', req.token);
  res.set('auth', req.token);
  return res.json({user: req.username, token:req.token});  
}

function usersHandler(req, res){
  return UserModelIns.get().then((list)=> {
    return res.json(list);
  });
}

module.exports = router;