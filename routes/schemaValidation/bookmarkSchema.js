const createBookMarkSchema = {
  repoName: {
    isString: {
      errorMessage: 'repoName query must be a string',
    },
    trim: true,
    notEmpty: true
  },
  repoUrl: {
    isString: {
      errorMessage: 'repoUrl query must be a string',
    },
    trim: true,
    notEmpty: true
  }
};

const removeBookMarkSchema = {
  id: {
    in: ['params'],
    notEmpty: true,
    trim: true
  }
};

module.exports = { createBookMarkSchema, removeBookMarkSchema };