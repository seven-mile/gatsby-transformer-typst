"use strict"

const { setOptionValue } = require('./option-store');

exports.onClientEntry = (_, pluginOptions) => {
  setOptionValue('domScale', pluginOptions.domScale ?? 1.0);
}
