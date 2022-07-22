import session from "express-session";

export const sessionHandler = session({
  secret: "otro secreto",
  resave: false,
  saveUninitialized: false,
});
