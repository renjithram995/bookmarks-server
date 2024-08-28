const registerSchema = {
  username: {
    isLength: {
      options: { min: 5 },
      errorMessage: 'Username must be at least 5 characters long',
    },
    trim: true,
    escape: true,
  },
  email: {
    isEmail: {
      errorMessage: 'Must be a valid e-mail address',
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long'
    }
  },
};

const loginSchema = {
  email: {
    isEmail: {
      errorMessage: 'Must be a valid e-mail address',
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long'
    }
  },
};

module.exports = { registerSchema, loginSchema };