import passport from "passport";
import PassportLocal from "passport-local";
import { Strategy } from "passport-local";

import {
  buscarPersonaPorId,
  buscarPersonaPorUsuername,
} from "../services/personasService.js";
import { registrarPersona } from "../services/personasService.js";
import logger from "../logger.js";

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const data = await buscarPersonaPorId(id);
  done(null, { id: data.id, username: data.username, password: data.password });
});

passport.use(
  new PassportLocal(async function (username, password, done) {
    const data = await buscarPersonaPorUsuername(username);
    if (data && data.password === password)
      return done(null, { id: data.id, name: data.username });
    logger.warn(username + " " + password);
    done(null, false);
  })
);

export async function getSignup(req, res, next) {
  try {
    res.status(200).render("signup");
  } catch (error) {
    next(error);
  }
}

export async function postSignup(req, res, next) {
  try {
    const registrada = await registrarPersona(req.body);
    res.status(201).json(registrada);
  } catch (error) {
    req(error);
  }
}

export async function getLogin(req, res, next) {
  try {
    res.status(200).render("login");
  } catch (error) {
    next(error);
  }
}

export const postLogin = passport.authenticate("local", {
  successRedirect: "profile",
  failureRedirect: "login",
});

export async function getLogout(req, res, next) {
  try {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    res.status(200).render("profile", {
      datos: req.user,
    });
  } catch (error) {
    next(error);
  }
}
