"use strict";

const effects = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];
const hashtags = [
  `followback`,
  `instagramers`,
  `socialsteeze`,
  `tweegram`,
  `photooftheday`,
  `20likes`,
  `amazing`,
  `smile`,
  `follow4follow`,
  `like4like`,
  `look`,
  `instalike`,
  `igers`,
  `picoftheday`,
  `food`,
  `instadaily`,
  `instafollow`,
  `followme`,
  `girl`,
  `instagood`,
  `bestoftheday`,
  `instacool`,
  `carryme`,
  `follow`,
  `colorful`,
  `style`,
  `swag`
];
const description = `arriage quitting securing be appetite it declared. High eyes kept so busy feel call in.`;

const convertDaysToMilliseconds = (days) => days * 24 * 60 * 60 * 1000;
const randomSort = () => Math.random() - 0.5;

const getRandomNumberInRange = (from, to) =>
  Math.floor(from + Math.random() * (to - from + 1));

const getRandomArrayEl = (array) =>
  array[getRandomNumberInRange(0, array.length - 1)];

const getRandomArray = (array, max) =>
  array
    .sort(randomSort)
    .slice(0, getRandomNumberInRange(1, max))
    .map((item) => `#${item}`);

const getRandomString = (desc) =>
  desc
    .split(` `)
    .sort(randomSort)
    .join(` `);

const getRandomArrayOfString = (desc, max) =>
  new Array(getRandomNumberInRange(1, max))
    .fill(``)
    .map(() => getRandomString(desc));

const getRandomDate = (now, max) =>
  getRandomNumberInRange(now - convertDaysToMilliseconds(max), now);

const generateEntity = () => ({
  url: `https://picsum.photos/600/?random`,
  scale: getRandomNumberInRange(0, 100),
  effect: getRandomArrayEl(effects),
  hashtags: getRandomArray(hashtags, 5),
  description: getRandomString(description),
  likes: getRandomNumberInRange(0, 1000),
  comments: getRandomArrayOfString(description, 10),
  date: getRandomDate(Date.now(), 7)
});

const generateData = (count) => {
  const arr = new Array(count);
  for (let i = 0; i < count; i++) {
    arr[i] = generateEntity();
  }
  return arr;
};

module.exports = {
  data: generateEntity(),
  generateEntity,
  generateData,
  effects,
  convertDaysToMilliseconds
};
