# css-animation-sync [![Build Status](https://travis-ci.org/bealearts/css-animation-sync.png?branch=master)](https://travis-ci.org/bealearts/css-animation-sync) [![npm version](https://badge.fury.io/js/css-animation-sync.svg)](http://badge.fury.io/js/css-animation-sync) [![Dependency Status](https://david-dm.org/bealearts/css-animation-sync.png)](https://david-dm.org/bealearts/css-animation-sync)

Synchronise and control CSS Animations


# Usage
```js
import sync from 'css-animation-sync';

sync('loader');
```

# Install
```shell
npm install css-animation-sync --save
```

# API

* `const animation = new sync(animationName [, options])` - Synchronises all DOM elements using a CSS animation

    * `animationName` Name of the CSS animation to sync

    Options


    Returns an animation instance (see below)

* `animation.free()` - Stops synchronisation of DOM elements using the animation

* `animation.pause()` - Pause the animation of DOM elements using the animation



# Test
```shell
npm install
npm test
```
