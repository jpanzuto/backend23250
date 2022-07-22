export default function userAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/api/auth/login");
}
