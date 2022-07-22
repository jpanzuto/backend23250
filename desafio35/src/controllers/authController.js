import passport from "passport";

export const postSignup = passport.authenticate("registro", {
  successRedirect: "/auth/successRegister",
  failureRedirect: "/auth/failRegister",
});

export async function getSignup(req, res, next) {
  try {
    res.status(200).render("signup");
  } catch (error) {
    next(error);
  }
}

export const postLogin = passport.authenticate("login", {
  successRedirect: "profile",
  failureRedirect: "login",
});

export function getLogin(req, res, next) {
  try {
    res.status(200).render("login");
  } catch (error) {
    next(error);
  }
}
/*
export function successRegisterController(req, res) {
  res.json(req.user);
  // res.sendFile('registroOk.html', { root: './views' })
}

export function failRegisterController(req, res) {
  res.status(400).json({ err: "fallo el registro" });
}

export function successLoginController(req, res) {
  res.json({ msg: "ok" });
}

export function failLoginController(req, res) {
  res.status(401).json({ err: "fallo el login" });
}
*/
export function getLogout(req, res) {
  if (req.isAuthenticated()) {
    req.logout();
  }
  res.sendStatus(200);
}

export function getProfile(req, res, next) {
  try {
    res.status(200).render("profile", {
      datos: req.user,
    });
  } catch (error) {
    next(error);
  }
}
