'use strict';

const ValidateError = require(`../error/validate`);
const data = require(`./data`);

const HASHTAGS = {
  length(list) {
    return list.length > data.hashtagsMaxLength;
  },

  begins(list) {
    return list.some((hash) => !hash.startsWith(`#`));
  },

  lengthWord(list) {
    return list.some((hash) => hash.length < data.hashtagsMinWord + 1 || hash.length > data.hashtagsMaxWord);
  },

  unique(list) {
    return list
      .map((hash) => hash.toLowerCase())
      .some((hash) => list.indexOf(hash) !== list.lastIndexOf(hash));
  }
};

const validate = (body) => {
  const errors = [];
  const {
    filename,
    scale,
    effect,
    description,
    hashtags
  } = body;

  const setError = (field, message) => errors.push({
    error: `Validation Error`,
    fieldName: field,
    errorMessage: message
  });

  if (filename) {
    if (!data.fileType.test(filename.mimetype)) {
      setError(`fileName`, `Field 'filename' must be a image type!`);
    }
  } else {
    setError(`fileName`, `Field 'filename' is required!`);
  }

  if (scale !== undefined) {
    if (scale < data.scaleMin || scale > data.scaleMax) {
      setError(`scale`, `Field 'scale' must be in range from ${data.scaleMin} to ${data.scaleMax}!`);
    }
  } else {
    setError(`scale`, `Field 'scale' is required!`);
  }

  if (effect) {
    if (!data.effects.includes(effect)) {
      setError(`effect`, `Field 'effect' must be one of the following: ${data.effects.join(`, `)}!`);
    }
  } else {
    setError(`effect`, `Field 'effect' is required!`);
  }

  if (description && description > data.descriptionMax) {
    setError(`description`, `Field 'descriptoin' must be less then ${data.descriptionMax} charsets!`);
  }

  if (hashtags) {
    const list = hashtags.trim().split(/\s+/);

    if (HASHTAGS.length(list)) {
      setError(`hashtags`, `Field 'hashtags' must be less then ${data.hashtagsMaxLength} hashtags!`);
    }

    if (HASHTAGS.begins(list)) {
      setError(`hashtags`, `All hashtags must begins with '#' symbol!`);
    }

    if (HASHTAGS.lengthWord(list)) {
      setError(`hashtags`, `All hashtags length must be in range from ${data.hashtagsMinWord} to ${data.hashtagsMaxWord}!`);
    }

    if (HASHTAGS.unique(list)) {
      setError(`hashtags`, `All hashtags must be unique!`);
    }
  }

  if (errors.length > 0) {
    throw new ValidateError(errors);
  }

  return body;
};

module.exports = validate;
