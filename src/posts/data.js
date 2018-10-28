'use strict';

const data = {
  fileType: /image\//,
  scaleMin: 0,
  scaleMax: 100,
  effects: [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`],
  hashtagsMaxLength: 5,
  hashtagsMinWord: 1,
  hashtagsMaxWord: 20,
  descriptionMax: 140
};

module.exports = data;
