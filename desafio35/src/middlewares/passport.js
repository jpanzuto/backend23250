import passport from "passport";
import { Strategy } from "passport-local";
import { buscarPersonaPorId, autenticar } from "../services/personasService.js";
import { registrarPersona } from "../services/personasService.js";

passport.use(
  "registro",
  new Strategy(
    {
      passReqToCallback: true,
      // usernameField: 'email',
      // passwordField: 'contrasenia',
    },
    (req, username, password, done) => {
      try {
        const usuario = registrarPersona(req.body);
        done(null, usuario);
      } catch (error) {
        done(error);
        // done(error, null, info) // donde info es un objeto, opcional
      }
    }
  )
);

passport.use(
  "login",
  new Strategy((username, password, done) => {
    try {
      const usuario = autenticar(username, password);
      console.log(usuario);
      done(null, usuario);
    } catch (error) {
      done(null, false);
    }
  })
);

export const passportMiddleware = passport.initialize();

// opcional =====================================================

passport.serializeUser((user, done) => {
  console.log(user);
  console.log(user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    const data = buscarPersonaPorId(id);
    done(null, {
      id: data.id,
      username: data.username,
      password: data.password,
    });
  } catch (error) {
    done(error);
  }
});

export const passportSessionHandler = passport.session();
