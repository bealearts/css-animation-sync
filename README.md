# css-animation-sync [![Build Status](https://travis-ci.org/bealearts/css-animation-sync.png?branch=master)](https://travis-ci.org/bealearts/css-animation-sync) [![npm version](https://badge.fury.io/js/css-animation-sync.svg)](http://badge.fury.io/js/css-animation-sync) [![Dependency Status](https://david-dm.org/bealearts/css-animation-sync.png)](https://david-dm.org/bealearts/css-animation-sync)

Synchronise and control CSS Animations


# The Problem

When DOM elements styled with the same CCS Animation are added to the document at different times, the animations are out of synchronisation.

|Problem|Solution|
|-------|--------|
|Elements added at different times are out of sync|Adding `sync('spinner');`|
|![Before](./docs/before.gif)|![After](./docs/after.gif)|

Interactive [Example](https://raw.githack.com/bealearts/css-animation-sync/master/example/index.html)

# Usage
```js
import sync from 'css-animation-sync';

sync('spinner');
```

# Install
```shell
npm install css-animation-sync --save
```

# API

* `const animation = new sync(animationName || animationNames)` - Synchronises all DOM elements using a CSS animation or multiple CSS animations. The animations duration needs to be the same for syncing to make sense.

    * `animationName` Name of the CSS animation to sync
    * `animationNames` Array of CSS animations to sync (allows syncing multiple animations)


    Returns an animation instance (see below)

* `animation.free()` - Stops synchronisation of DOM elements using the animation

* `animation.pause()` - Pause the animation of DOM elements using the animation

* `animation.stop()` - Stop the animation of DOM elements using the animation

* `animation.start()` - Start/Resume the animation of DOM elements using the animation


# Test
```shell
npm install
npm test
```

# Dev
```shell
npm start
```
