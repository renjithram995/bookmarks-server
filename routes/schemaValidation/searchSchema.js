const searchQueryValidatorSchema = {
  search: {
    in: ['query'],
    isString: {
      errorMessage: 'Search query must be a string',
    },
    trim: true,
    escape: true,
    optional: true
  },
  type: {
    in: ['params'],
    notEmpty: true,
    custom: {
      options: (value) => {
        const allowedTypes = ['repositories', 'users'];
        if (!allowedTypes.includes(value)) {
          throw new Error(`Invalid type. Allowed values are: ${allowedTypes.toString()}`);
        }
        return true;
      },
    },
  },
  skip: {
    in: ['query'],
    isInt: {
      errorMessage: 'skip must be an integer',
      options: { min: 1 },
    },
    toInt: true,
    optional: true
  },
  top: {
    in: ['query'],
    isInt: {
      errorMessage: 'top must be an integer',
      options: { min: 1 },
    },
    toInt: true,
    optional: true
  }
};

const userRepoValidatorSchema = {
  username: {
    in: ['params'],
    notEmpty: true,
    trim: true,
    escape: true,
  },
  skip: {
    in: ['query'],
    isInt: {
      errorMessage: 'skip must be an integer',
      options: { min: 1 },
    },
    toInt: true,
    optional: true
  },
  top: {
    in: ['query'],
    isInt: {
      errorMessage: 'top must be an integer',
      options: { min: 1 },
    },
    toInt: true,
    optional: true
  }
};

module.exports = { searchQueryValidatorSchema, userRepoValidatorSchema };