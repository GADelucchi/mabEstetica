// Imports
const { Router } = require('express')
const jwt = require('jsonwebtoken');
const { jwtPrivateKey } = require("../../process/config");

// Code
class RouterClass {
  constructor() {
    this.router = Router()
    this.init()
  }

  getRouter() {
    return this.router
  }

  init() { }

  applyCallbacks(callbacks) {
    return callbacks.map(callback => async (...params) => {
      try {
        await callback.apply(this, params)
      } catch (error) {
        params[1].status(500).send(error)
        console.log(error)
      }
    })
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = payload => res.status(200).send({ status: 'Success', payload })
    res.sendServerError = error => res.status(500).send({ status: 'Error', error })
    res.sendUserError = error => res.send({ status: 'Error', error })
    next()
  }

  handlePolicies = policies => (req, res, next) => {
    if (policies[0] === 'PUBLIC') return next()

    const token = req.cookies?.accessToken
    if (!token) {
      return res.status(401).send({ status: 'Error', error: "No se encuentra el token de autorización" });
    }

    try {
      const credential = jwt.verify(token, jwtPrivateKey)

      console.log(credential);

      req.user = credential.user;

      if (!policies.includes(credential.user.role.toUpperCase())) {
        return res.status(403).send({ status: 'Error', error: "No tiene permiso necesario" });
      }
      next()
    } catch (error) {
      return res.status(401).send({ status: 'Error', error: 'Token inválido o expirado' });
    }
  }


  get(path, policies, ...callbacks) {
    this.router.get(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks))
  }

  post(path, policies, ...callbacks) {
    this.router.post(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks))
  }

  put(path, policies, ...callbacks) {
    this.router.put(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks))
  }

  patch(path, policies, ...callbacks) {
    this.router.patch(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks))
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks))
  }
}

// Exports
module.exports = { RouterClass }