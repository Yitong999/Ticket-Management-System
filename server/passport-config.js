// https://www.youtube.com/watch?v=-RCnNyD0L-s
// https://github.com/WebDevSimplified/Nodejs-Passport-Login/tree/master/views

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await getUserByEmail(email) // Await the user from the database
      if (user == null) {
        return done(null, false, { message: 'No user with that email' })
      }

      // Check if the user's status is false
      console.log('login status: ', user.status)
      console.log('login user: ', user)
      if (user.status == false) {
        return done(null, false, { message: 'Account is disabled.' });
      }

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id) // Await the user from the database
      return done(null, user)
    } catch (e) {
      return done(e)
    }
  })
}

module.exports = initialize
