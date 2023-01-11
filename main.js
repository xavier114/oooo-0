// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// extract from chromium source code by @liuwayong

let games_played = parseInt(localStorage.getItem('games_played'));
let collected_tshirt = localStorage.getItem('collected_tshirt');
let your_high_score = document.getElementById('your_high_score');

if (typeof games_played === 'undefined' || isNaN(games_played)) {
    games_played = 0;
}

let high_score = parseInt(localStorage.getItem('high_score') ?? 0);

if (typeof collected_tshirt === 'undefined' || collected_tshirt === null) {
    collected_tshirt = false;
} else {
    collected_tshirt = true;
}

let enableAltGameMode = false;
let altGameType = 1;
let altGameType_key = 'type_1';
let resourcename = "t-rex";
let max_flash_iterations = 80;
let flash_iterations = 0;


// if (games_played > -1 && !collected_tshirt) {
//     enableAltGameMode = true;
// }

window.addEventListener('load', () => {
    'use strict';
    /**
     * T-Rex runner.
     * @param {string} outerContainerId Outer containing element id.
     * @param {Object} opt_config
     * @constructor
     * @export
     */
    function Runner(outerContainerId, opt_config) {
        // Singleton
        if (Runner.instance_) {
            return Runner.instance_;
        }
        Runner.instance_ = this;

        this.outerContainerEl = document.querySelector(outerContainerId);
        this.containerEl = null;
        this.snackbarEl = null;
        this.detailsButton = this.outerContainerEl.querySelector('#details-button');

        this.config = opt_config || Runner.config;

        this.dimensions = Runner.defaultDimensions;

        this.gameType = null;
        Runner.spriteDefinition = Runner.spriteDefinitionByType['original'];

        // game mods
        this.altGameImageSprite = null;
        this.altGameModeActive = false;
        this.altGameModeFlashTimer = null;
        this.fadeInTimer = 0;


        this.canvas = null;
        this.canvasCtx = null;

        this.tRex = null;

        this.distanceMeter = null;
        this.distanceRan = 0;

        this.highestScore = 0;

        this.time = 0;
        this.runningTime = 0;
        this.msPerFrame = 1000 / FPS;
        this.currentSpeed = this.config.SPEED;
        // game mods
        Runner.slowDown = false;

        this.obstacles = [];

        this.activated = false; // Whether the easter egg has been activated.
        this.playing = false; // Whether the game is currently in play state.
        this.crashed = false;
        this.paused = false;
        this.inverted = false;
        this.invertTimer = 0;
        this.resizeTimerId_ = null;

        this.playCount = 0;

        // Sound FX.
        this.audioBuffer = null;
        this.soundFx = {};

        // Global web audio context for playing sounds.
        this.audioContext = null;

        // Images.
        this.images = {};
        this.imagesLoaded = 0;

        if (this.isDisabled()) {
            this.setupDisabledRunner();
        } else {
            if (Runner.isAltGameModeEnabled()) {
                this.initAltGameType();
                Runner.gameType = this.gameType;
            }
            this.loadImages();
        }
    }
    window['B948h498uureiuh459hf459h549fh4589hufh49hf94eh5'] = Runner;


    /**
     * Default game width.
     * @const
     */
    var DEFAULT_WIDTH = 800;

    /**
     * Frames per second.
     * @const
     */
    var FPS = 60;

    /** @const */
        // var IS_HIDPI = window.devicePixelRatio > 1;
    var IS_HIDPI = true;

    /** @const */
    var IS_IOS = /iPad|iPhone|iPod/.test(window.navigator.platform);

    /** @const */
    const RESOURCE_POSTFIX = 'offline-resources-';

    let is_mobile_f = function() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };
    /** @const */
        // var IS_MOBILE = /Android/.test(window.navigator.userAgent) || IS_IOS;
    var IS_MOBILE = is_mobile_f();


    // if (IS_MOBILE) {
    //     instructions_h1_inner.innerText = 'Tap to Start. ';
    //     rotate_wrap.classList.remove('hidden');
    // }

    /** @const */
    var IS_TOUCH_ENABLED = 'ontouchstart' in window;

    /**
     * Default game configuration.
     * @enum {number}
     */
    Runner.config = {
        ACCELERATION: 0.001,
        BG_CLOUD_SPEED: 0.2,
        BOTTOM_PAD: 20,
        CLEAR_TIME: 3000,
        CLOUD_FREQUENCY: 0.5,
        FADE_DURATION: 1,
        FLASH_DURATION: 1000,
        GAMEOVER_CLEAR_TIME: 750,
        GAP_COEFFICIENT: 0.6,
        GRAVITY: 0.2,
        INITIAL_JUMP_VELOCITY: 12,
        INVERT_FADE_DURATION: 12000,
        INVERT_DISTANCE: 700,
        MAX_BLINK_COUNT: 3,
        MAX_CLOUDS: 6,
        MAX_OBSTACLE_LENGTH: 2,
        MAX_OBSTACLE_DUPLICATION: 2,
        MAX_SPEED: 13,
        MIN_JUMP_HEIGHT: 35,
        MOBILE_SPEED_COEFFICIENT: 5.5,
        RESOURCE_TEMPLATE_ID: 'audio-resources',
        SPEED: 6,
        SPEED_DROP_COEFFICIENT: 3
    };


    /**
     * Default dimensions.
     * @enum {string}
     */
    Runner.defaultDimensions = {
        WIDTH: DEFAULT_WIDTH,
        HEIGHT: 180
    };


    /**
     * CSS class names.
     * @enum {string}
     */
    Runner.classes = {
        CANVAS: 'runner-canvas',
        CONTAINER: 'runner-container',
        CRASHED: 'crashed',
        ICON: 'icon-offline',
        INVERTED: 'inverted',
        SNACKBAR: 'snackbar',
        SNACKBAR_SHOW: 'snackbar-show',
        TOUCH_CONTROLLER: 'controller'
    };


    /**
     * Sprite definition layout of the spritesheet.
     * @enum {Object}
     */
    Runner.spriteDefinition = {
        LDPI: {
            CACTUS_LARGE: { x: 332, y: 2 },
            CACTUS_SMALL: { x: 228, y: 2 },
            CLOUD: { x: 86, y: 2 },
            HORIZON: { x: 2, y: 54 },
            MOON: { x: 484, y: 2 },
            PTERODACTYL: { x: 134, y: 2 },
            RESTART: { x: 2, y: 2 },
            TEXT_SPRITE: { x: 655, y: 2 },
            TREX: { x: 848, y: 2 },
            STAR: { x: 645, y: 2 }
        },
        HDPI: {
            CACTUS_LARGE: { x: 652, y: 2 },
            CACTUS_SMALL: { x: 446, y: 2 },
            CLOUD: { x: 166, y: 2 },
            HORIZON: { x: 2, y: 104 },
            MOON: { x: 954, y: 2 },
            PTERODACTYL: { x: 260, y: 2 },
            RESTART: { x: 2, y: 2 },
            TEXT_SPRITE: { x: 1294, y: 2 },
            TREX: { x: 1678, y: 2 },
            STAR: { x: 1276, y: 2 }
        }
    };

    Runner.spriteDefinitionByType = {
        original: {
            LDPI: {
                BACKGROUND_EL: {x: 86, y: 2},
                CACTUS_LARGE: {x: 332, y: 2},
                CACTUS_SMALL: {x: 228, y: 2},
                OBSTACLE_2: {x: 332, y: 2},
                OBSTACLE: {x: 228, y: 2},
                CLOUD: {x: 86, y: 2},
                HORIZON: {x: 2, y: 54},
                MOON: {x: 484, y: 2},
                PTERODACTYL: {x: 134, y: 2},
                RESTART: {x: 2, y: 68},
                TEXT_SPRITE: {x: 655, y: 2},
                TREX: {x: 848, y: 2},
                STAR: {x: 645, y: 2},
                COLLECTABLE: {x: 2, y: 5},
                ALT_GAME_END: {x: 121, y: 2}
            },
            HDPI: {
                BACKGROUND_EL: {x: 166, y: 2},
                CACTUS_LARGE: {x: 652, y: 2},
                CACTUS_SMALL: {x: 446, y: 2},
                OBSTACLE_2: {x: 652, y: 2},
                OBSTACLE: {x: 446, y: 2},
                CLOUD: {x: 166, y: 2},
                HORIZON: {x: 2, y: 104},
                MOON: {x: 954, y: 2},
                PTERODACTYL: {x: 260, y: 2},
                RESTART: {x: 2, y: 130},
                TEXT_SPRITE: {x: 1294, y: 2},
                TREX: {x: 1678, y: 2},
                STAR: {x: 1276, y: 2},
                COLLECTABLE: {x: 2, y: 2},
                ALT_GAME_END: {x: 242, y: 4}
            },
            MAX_GAP_COEFFICIENT: 1.5,
            MAX_OBSTACLE_LENGTH: 3,
            HAS_CLOUDS: 1,
            BOTTOM_PAD: 20,
            TREX: {
                WAITING_1: {x: 44, w: 44, h: 47, xOffset: 0},
                WAITING_2: {x: 0, w: 44, h: 47, xOffset: 0},
                RUNNING_1: {x: 88, w: 44, h: 47, xOffset: 0},
                RUNNING_2: {x: 132, w: 44, h: 47, xOffset: 0},
                JUMPING: {x: 0, w: 44, h: 47, xOffset: 0},
                CRASHED: {x: 220, w: 44, h: 47, xOffset: 0},
                COLLISION_BOXES: [
                    new CollisionBox(22, 0, 17, 16), new CollisionBox(1, 18, 30, 9),
                    new CollisionBox(10, 35, 14, 8), new CollisionBox(1, 24, 29, 5),
                    new CollisionBox(5, 30, 21, 4), new CollisionBox(9, 34, 15, 4)
                ]
            },
            /** @type {Array<ObstacleType>} */
            OBSTACLES: [
                {
                    type: 'CACTUS_SMALL',
                    width: 17,
                    height: 35,
                    yPos: 105,
                    multipleSpeed: 4,
                    minGap: 120,
                    minSpeed: 0,
                    collisionBoxes: [
                        new CollisionBox(0, 7, 5, 27), new CollisionBox(4, 0, 6, 34),
                        new CollisionBox(10, 4, 7, 14)
                    ]
                },
                {
                    type: 'CACTUS_LARGE',
                    width: 25,
                    height: 50,
                    yPos: 90,
                    multipleSpeed: 7,
                    minGap: 120,
                    minSpeed: 0,
                    collisionBoxes: [
                        new CollisionBox(0, 12, 7, 38), new CollisionBox(8, 0, 7, 49),
                        new CollisionBox(13, 10, 10, 38)
                    ]
                },
                {
                    type: 'PTERODACTYL',
                    width: 46,
                    height: 40,
                    yPos: [100, 75, 50],    // Variable height.
                    yPosMobile: [100, 50],  // Variable height mobile.
                    multipleSpeed: 999,
                    minSpeed: 8.5,
                    minGap: 150,
                    collisionBoxes: [
                        new CollisionBox(15, 15, 16, 5), new CollisionBox(18, 21, 24, 6),
                        new CollisionBox(2, 14, 4, 3), new CollisionBox(6, 10, 4, 7),
                        new CollisionBox(10, 8, 6, 9)
                    ],
                    numFrames: 2,
                    frameRate: 1000 / 6,
                    speedOffset: .8
                },
                {
                    type: 'COLLECTABLE',
                    width: 38,
                    height: 36,
                    yPos: 17,
                    multipleSpeed: 999,
                    minGap: 999,
                    minSpeed: 0,
                    collisionBoxes: [new CollisionBox(0, 0, 12, 38)]
                }
            ],
            BACKGROUND_EL: {
                'CLOUD': {
                    HEIGHT: 47,
                    MAX_CLOUD_GAP: 400,
                    MAX_SKY_LEVEL: 30,
                    MIN_CLOUD_GAP: 100,
                    MIN_SKY_LEVEL: 71,
                    OFFSET: 4,
                    WIDTH: 50,
                    X_POS: 1,
                    Y_POS: 120
                }
            },
            BACKGROUND_EL_CONFIG: {
                MAX_BG_ELS: 1,
                MAX_GAP: 400,
                MIN_GAP: 100,
                POS: 0,
                SPEED: 0.5,
                Y_POS: 125
            },
            LINES: [
                {SOURCE_X: 2, SOURCE_Y: 42, WIDTH: 600, HEIGHT: 12, YPOS: 127},
            ],
            ALT_GAME_END_CONFIG: {
                WIDTH: 15,
                HEIGHT: 17,
                X_OFFSET: 0,
                Y_OFFSET: 0,
            },
            ALT_GAME_OVER_TEXT_CONFIG: {
                TEXT_X: 14,
                TEXT_Y: 2,
                TEXT_WIDTH: 108,
                TEXT_HEIGHT: 15,
                FLASH_DURATION: 1500
            }
        },
        type_1: {
            LDPI: {
                BACKGROUND_EL: {x: 86, y: 2},
                CACTUS_LARGE: {x: 332, y: 2},
                CACTUS_SMALL: {x: 228, y: 2},
                OBSTACLE_2: {x: 332, y: 2},
                OBSTACLE: {x: 228, y: 2},
                CLOUD: {x: 86, y: 2},
                HORIZON: {x: 2, y: 54},
                MOON: {x: 484, y: 2},
                PTERODACTYL: {x: 134, y: 2},
                RESTART: {x: 2, y: 68},
                TEXT_SPRITE: {x: 655, y: 2},
                TREX: {x: 848, y: 2},
                STAR: {x: 645, y: 2},
                COLLECTABLE: {x: 2, y: 5},
                ALT_GAME_END: {x: 121, y: 2}
            },
            HDPI: {
                BACKGROUND_EL: {x: 166, y: 2},
                CACTUS_LARGE: {x: 652, y: 2},
                CACTUS_SMALL: {x: 446, y: 2},
                OBSTACLE_2: {x: 652, y: 2},
                OBSTACLE: {x: 446, y: 2},
                CLOUD: {x: 166, y: 2},
                HORIZON: {x: 2, y: 104},
                MOON: {x: 954, y: 2},
                PTERODACTYL: {x: 260, y: 2},
                RESTART: {x: 2, y: 130},
                TEXT_SPRITE: {x: 1294, y: 2},
                TREX: {x: 1678, y: 2},
                STAR: {x: 1276, y: 2},
                COLLECTABLE: {x: 2, y: 2},
                ALT_GAME_END: {x: 242, y: 4}
            },
            MAX_GAP_COEFFICIENT: 1.5,
            MAX_OBSTACLE_LENGTH: 3,
            HAS_CLOUDS: 1,
            BOTTOM_PAD: 20,
            TREX: {
                WAITING_1: {x: 44, w: 44, h: 47, xOffset: 0},
                WAITING_2: {x: 0, w: 44, h: 47, xOffset: 0},
                RUNNING_1: {x: 88, w: 44, h: 47, xOffset: 0},
                RUNNING_2: {x: 132, w: 44, h: 47, xOffset: 0},
                JUMPING: {x: 0, w: 44, h: 47, xOffset: 0},
                CRASHED: {x: 220, w: 44, h: 47, xOffset: 0},
                COLLISION_BOXES: [
                    new CollisionBox(22, 0, 17, 16), new CollisionBox(1, 18, 30, 9),
                    new CollisionBox(10, 35, 14, 8), new CollisionBox(1, 24, 29, 5),
                    new CollisionBox(5, 30, 21, 4), new CollisionBox(9, 34, 15, 4)
                ]
            },
            /** @type {Array<ObstacleType>} */
            OBSTACLES: [
                {
                    type: 'CACTUS_SMALL',
                    width: 17,
                    height: 35,
                    yPos: 105,
                    multipleSpeed: 4,
                    minGap: 120,
                    minSpeed: 0,
                    collisionBoxes: [
                        new CollisionBox(0, 7, 5, 27), new CollisionBox(4, 0, 6, 34),
                        new CollisionBox(10, 4, 7, 14)
                    ]
                },
                {
                    type: 'CACTUS_LARGE',
                    width: 25,
                    height: 50,
                    yPos: 90,
                    multipleSpeed: 7,
                    minGap: 120,
                    minSpeed: 0,
                    collisionBoxes: [
                        new CollisionBox(0, 12, 7, 38), new CollisionBox(8, 0, 7, 49),
                        new CollisionBox(13, 10, 10, 38)
                    ]
                },
                {
                    type: 'PTERODACTYL',
                    width: 46,
                    height: 40,
                    yPos: [100, 75, 50],    // Variable height.
                    yPosMobile: [100, 50],  // Variable height mobile.
                    multipleSpeed: 999,
                    minSpeed: 8.5,
                    minGap: 150,
                    collisionBoxes: [
                        new CollisionBox(15, 15, 16, 5), new CollisionBox(18, 21, 24, 6),
                        new CollisionBox(2, 14, 4, 3), new CollisionBox(6, 10, 4, 7),
                        new CollisionBox(10, 8, 6, 9)
                    ],
                    numFrames: 2,
                    frameRate: 1000 / 6,
                    speedOffset: .8
                }

            ],
            BACKGROUND_EL: {
                'CLOUD': {
                    HEIGHT: 47,
                    MAX_CLOUD_GAP: 400,
                    MAX_SKY_LEVEL: 30,
                    MIN_CLOUD_GAP: 100,
                    MIN_SKY_LEVEL: 71,
                    OFFSET: 4,
                    WIDTH: 50,
                    X_POS: 1,
                    Y_POS: 120
                }
            },
            BACKGROUND_EL_CONFIG: {
                MAX_BG_ELS: 1,
                MAX_GAP: 400,
                MIN_GAP: 100,
                POS: 0,
                SPEED: 0.5,
                Y_POS: 125
            },
            LINES: [
                {SOURCE_X: 2, SOURCE_Y: 52, WIDTH: 600, HEIGHT: 12, YPOS: 127},
            ],
            ALT_GAME_END_CONFIG: {
                WIDTH: 15,
                HEIGHT: 17,
                X_OFFSET: 0,
                Y_OFFSET: 0,
            },
            ALT_GAME_OVER_TEXT_CONFIG: {
                TEXT_X: 14,
                TEXT_Y: 2,
                TEXT_WIDTH: 108,
                TEXT_HEIGHT: 15,
                FLASH_DURATION: 1500
            }
        },
    };


    /**
     * Sound FX. Reference to the ID of the audio tag on interstitial page.
     * @enum {string}
     */
    Runner.sounds = {
        BUTTON_PRESS: 'offline-sound-press',
        HIT: 'offline-sound-hit',
        SCORE: 'offline-sound-reached'
    };


    /**
     * Key code mapping.
     * @enum {Object}
     */
    Runner.keycodes = {
        JUMP: { '38': 1, '32': 1 },  // Up, spacebar
        DUCK: { '40': 1 },  // Down
        RESTART: { '13': 1 }  // Enter
    };


    /**
     * Runner event names.
     * @enum {string}
     */
    Runner.events = {
        ANIM_END: 'webkitAnimationEnd',
        CLICK: 'click',
        KEYDOWN: 'keydown',
        KEYUP: 'keyup',
        MOUSEDOWN: 'mousedown',
        MOUSEUP: 'mouseup',
        RESIZE: 'resize',
        TOUCHEND: 'touchend',
        TOUCHSTART: 'touchstart',
        VISIBILITY: 'visibilitychange',
        BLUR: 'blur',
        FOCUS: 'focus',
        LOAD: 'load'
    };


    Runner.prototype = {
        /**
         * Assign a random game type.
         */
        initAltGameType() {
            this.gameType = altGameType;
        },

        /**
         * Whether the easter egg has been disabled. CrOS enterprise enrolled devices.
         * @return {boolean}
         */
        isDisabled: function () {
            // return loadTimeData && loadTimeData.valueExists('disabledEasterEgg');
            return false;
        },

        /**
         * For disabled instances, set up a snackbar with the disabled message.
         */
        setupDisabledRunner: function () {
            this.containerEl = document.createElement('div');
            this.containerEl.className = Runner.classes.SNACKBAR;
            this.containerEl.textContent = loadTimeData.getValue('disabledEasterEgg');
            this.outerContainerEl.appendChild(this.containerEl);

            // Show notification when the activation key is pressed.
            document.addEventListener(Runner.events.KEYDOWN, function (e) {
                if (Runner.keycodes.JUMP[e.keyCode] && !name_focused) {
                    this.containerEl.classList.add(Runner.classes.SNACKBAR_SHOW);
                    document.querySelector('.icon').classList.add('icon-disabled');
                }
            }.bind(this));
        },

        /**
         * Setting individual settings for debugging.
         * @param {string} setting
         * @param {*} value
         */
        updateConfigSetting: function (setting, value) {
            if (setting in this.config && value != undefined) {
                this.config[setting] = value;

                switch (setting) {
                    case 'GRAVITY':
                    case 'MIN_JUMP_HEIGHT':
                    case 'SPEED_DROP_COEFFICIENT':
                        this.tRex.config[setting] = value;
                        break;
                    case 'INITIAL_JUMP_VELOCITY':
                        this.tRex.setJumpVelocity(value);
                        break;
                    case 'SPEED':
                        this.setSpeed(value);
                        break;
                }
            }
        },

        /**
         * Creates an on page image element from the base 64 encoded string source.
         * @param {string} resourceName Name in data object,
         * @return {HTMLImageElement} The created element.
         */
        createImageElement(resourceName) {
            const imgSrc = resourceName;

            if (imgSrc) {
                const el =
                    /** @type {HTMLImageElement} */ (document.createElement('img'));
                el.id = resourceName;
                el.src = imgSrc;
                document.getElementById('offline-resources').appendChild(el);
                return el;
            }
            return null;
        },

        /**
         * Cache the appropriate image sprite from the page and get the sprite sheet
         * definition.
         */
        loadImages: function () {
            let scale = '1x';
            if (IS_HIDPI) {
                scale = '2x';
                Runner.imageSprite = document.getElementById('offline-resources-2x');
                this.spriteDef = Runner.spriteDefinition.HDPI;
            } else {
                Runner.imageSprite = document.getElementById('offline-resources-1x');
                this.spriteDef = Runner.spriteDefinition.LDPI;
            }

            Runner.imageSprite = /** @type {HTMLImageElement} */
                (document.getElementById(RESOURCE_POSTFIX + scale));

            // if (this.gameType) {
            Runner.altGameImageSprite = document.getElementById('tshirt-offline-resources-2x');
            Runner.altCommonImageSprite = document.getElementById('alt-common-sprite');
            // }
            Runner.origImageSprite = Runner.imageSprite;


            // Disable the alt game mode if the sprites can't be loaded.
            if (!Runner.altGameImageSprite || !Runner.altCommonImageSprite) {
                // console.log('Runner.altGameImageSprite', Runner.altGameImageSprite);
                // console.log('Runner.altCommonImageSprite', Runner.altCommonImageSprite);
                // console.log(document.getElementById('tshirt-offline-resources-2x'));
                Runner.isAltGameModeEnabled = () => false;
                this.altGameModeActive = false;
            }

            if (Runner.imageSprite.complete) {
                this.init();
            } else {
                // If the images are not yet loaded, add a listener.
                Runner.imageSprite.addEventListener(Runner.events.LOAD,
                    this.init.bind(this));
            }
        },

        /**
         * Sets the game speed. Adjust the speed accordingly if on a smaller screen.
         * @param {number} opt_speed
         */
        setSpeed: function (opt_speed) {
            var speed = opt_speed || this.currentSpeed;

            // Reduce the speed on smaller mobile screens.
            if (this.dimensions.WIDTH < DEFAULT_WIDTH) {
                var mobileSpeed = speed * this.dimensions.WIDTH / DEFAULT_WIDTH *
                    this.config.MOBILE_SPEED_COEFFICIENT;
                this.currentSpeed = mobileSpeed > speed ? speed : mobileSpeed;
            } else if (opt_speed) {
                this.currentSpeed = opt_speed;
            }
        },

        /**
         * Game initialiser.
         */
        init: function () {
            // Hide the static icon.
            document.querySelector('.' + Runner.classes.ICON).style.visibility =
                'hidden';

            this.adjustDimensions();
            this.setSpeed();

            this.containerEl = document.createElement('div');
            this.containerEl.className = Runner.classes.CONTAINER;

            // Player canvas container.
            this.canvas = createCanvas(this.containerEl, this.dimensions.WIDTH,
                this.dimensions.HEIGHT, Runner.classes.PLAYER);

            this.canvasCtx = this.canvas.getContext('2d');
            this.canvasCtx.fillStyle = '#f7f7f7';
            this.canvasCtx.fill();
            Runner.updateCanvasScaling(this.canvas);

            // Horizon contains clouds, obstacles and the ground.
            this.horizon = new Horizon(this.canvas, this.spriteDef, this.dimensions,
                this.config.GAP_COEFFICIENT);

            // Distance meter
            this.distanceMeter = new DistanceMeter(this.canvas,
                this.spriteDef.TEXT_SPRITE, this.dimensions.WIDTH);

            // Draw t-rex
            this.tRex = new Trex(this.canvas, this.spriteDef.TREX);

            this.outerContainerEl.appendChild(this.containerEl);

            if (IS_MOBILE) {
                this.createTouchController();
            }

            this.startListening();
            this.update();

            window.addEventListener(Runner.events.RESIZE,
                this.debounceResize.bind(this));
        },

        /**
         * Create the touch controller. A div that covers whole screen.
         */
        createTouchController: function () {
            this.touchController = document.createElement('div');
            this.touchController.className = Runner.classes.TOUCH_CONTROLLER;
            this.outerContainerEl.appendChild(this.touchController);
        },

        /**
         * Debounce the resize event.
         */
        debounceResize: function () {
            if (!this.resizeTimerId_) {
                this.resizeTimerId_ =
                    setInterval(this.adjustDimensions.bind(this), 250);
            }
        },

        /**
         * Adjust game space dimensions on resize.
         */
        adjustDimensions: function () {
            clearInterval(this.resizeTimerId_);
            this.resizeTimerId_ = null;

            var boxStyles = window.getComputedStyle(this.outerContainerEl);
            var padding = Number(boxStyles.paddingLeft.substr(0,
                boxStyles.paddingLeft.length - 2));

            this.dimensions.WIDTH = this.outerContainerEl.offsetWidth - padding * 2;

            // Redraw the elements back onto the canvas.
            if (this.canvas) {
                this.canvas.width = this.dimensions.WIDTH;
                this.canvas.height = this.dimensions.HEIGHT;

                Runner.updateCanvasScaling(this.canvas);

                this.distanceMeter.calcXPos(this.dimensions.WIDTH);
                this.clearCanvas();
                this.horizon.update(0, 0, true);
                this.tRex.update(0);

                // Outer container and distance meter.
                if (this.playing || this.crashed || this.paused) {
                    this.containerEl.style.width = this.dimensions.WIDTH + 'px';
                    this.containerEl.style.height = this.dimensions.HEIGHT + 'px';
                    this.distanceMeter.update(0, Math.ceil(this.distanceRan));
                    this.stop();
                } else {
                    this.tRex.draw(0, 0);
                }

                // Game over panel.
                if (this.crashed && this.gameOverPanel) {
                    this.gameOverPanel.updateDimensions(this.dimensions.WIDTH);
                    this.gameOverPanel.draw();
                }
            }
        },

        /**
         * Play the game intro.
         * Canvas container width expands out to the full width.
         */
        playIntro: function () {
            if (!this.activated && !this.crashed) {
                this.playingIntro = true;
                this.tRex.playingIntro = true;

                // CSS animation definition.
                var keyframes = '@-webkit-keyframes intro { ' +
                    'from { width:' + Trex.config.WIDTH + 'px }' +
                    'to { width: ' + this.dimensions.WIDTH + 'px }' +
                    '}';
                // create a style sheet to put the keyframe rule in
                // and then place the style sheet in the html head
                // var sheet = document.createElement('style');
                js_style.innerHTML = keyframes;
                // document.head.appendChild(sheet);


                this.containerEl.addEventListener(Runner.events.ANIM_END,
                    this.startGame.bind(this));

                this.containerEl.style.webkitAnimation = 'intro .4s ease-out 1 both';
                this.containerEl.style.width = this.dimensions.WIDTH + 'px';

                // if (this.touchController) {
                //     this.outerContainerEl.appendChild(this.touchController);
                // }
                this.playing = true;
                this.activated = true;
            } else if (this.crashed) {
                this.restart();
            }
        },


        /**
         * Update the game status to started.
         */
        startGame: function () {
            this.runningTime = 0;
            this.playingIntro = false;
            this.tRex.playingIntro = false;
            this.containerEl.style.webkitAnimation = '';
            this.playCount++;

            // Handle tabbing off the page. Pause the current game.
            document.addEventListener(Runner.events.VISIBILITY,
                this.onVisibilityChange.bind(this));

            window.addEventListener(Runner.events.BLUR,
                this.onVisibilityChange.bind(this));

            window.addEventListener(Runner.events.FOCUS,
                this.onVisibilityChange.bind(this));
        },

        clearCanvas: function () {
            this.canvasCtx.clearRect(0, 0, this.dimensions.WIDTH,
                this.dimensions.HEIGHT);
        },

        /**
         * Enable the alt game mode. Switching out the sprites.
         */
        enableAltGameMode() {
            Runner.imageSprite = Runner.altGameImageSprite;
            Runner.spriteDefinition = Runner.spriteDefinitionByType[altGameType_key];

            if (IS_HIDPI) {
                this.spriteDef = Runner.spriteDefinition.HDPI;
            } else {
                this.spriteDef = Runner.spriteDefinition.LDPI;
            }

            this.altGameModeActive = true;
            this.tRex.enableAltGameMode(this.spriteDef.TREX);
            this.horizon.enableAltGameMode(this.spriteDef);
            collected_tshirt = true;
            localStorage.setItem('collected_tshirt', 'true');
            bottom_link_clickable.classList.remove('hidden');
            // possibly enable special sound here
        },

        /**
         * Update the game frame and schedules the next one.
         */
        update: function () {
            this.updatePending = false;

            var now = getTimeStamp();
            var deltaTime = now - (this.time || now);
            this.time = now;

            // Flashing when switching game modes.
            if (this.altGameModeFlashTimer < 0 || this.altGameModeFlashTimer === 0) {
                this.altGameModeFlashTimer = null;
                this.tRex.setFlashing(false);
                this.enableAltGameMode();
            } else if (this.altGameModeFlashTimer > 0) {
                this.altGameModeFlashTimer -= deltaTime;
                this.tRex.update(deltaTime);
                deltaTime = 0;
            }

            if (this.playing) {
                this.clearCanvas();

                // Additional fade in - Prevents jump when switching sprites
                if (this.altGameModeActive &&
                    this.fadeInTimer <= this.config.FADE_DURATION) {
                    this.fadeInTimer += deltaTime / 1000;
                    this.canvasCtx.globalAlpha = this.fadeInTimer;
                } else {
                    this.canvasCtx.globalAlpha = 1;
                }

                if (this.tRex.jumping) {
                    this.tRex.updateJump(deltaTime);
                }

                this.runningTime += deltaTime;
                var hasObstacles = this.runningTime > this.config.CLEAR_TIME;

                // First jump triggers the intro.
                if (this.tRex.jumpCount == 1 && !this.playingIntro) {
                    this.playIntro();
                }

                // The horizon doesn't move until the intro is over.
                if (this.playingIntro) {
                    this.horizon.update(0, this.currentSpeed, hasObstacles);
                } else {
                    deltaTime = !this.activated ? 0 : deltaTime;
                    this.horizon.update(deltaTime, this.currentSpeed, hasObstacles,
                        this.inverted);
                }

                // Check for collisions.
                var collision = hasObstacles &&
                    checkForCollision(this.horizon.obstacles[0], this.tRex);

                // Activated alt game mode.
                if (Runner.isAltGameModeEnabled() && collision &&
                    this.horizon.obstacles[0].typeConfig.type == 'COLLECTABLE') {
                    this.horizon.removeFirstObstacle();
                    this.tRex.setFlashing(true);
                    collision = false;
                    this.altGameModeFlashTimer = this.config.FLASH_DURATION;
                    this.runningTime = 0;
                    // optional: play sound when collecting item
                }

                if (!collision) {
                    this.distanceRan += this.currentSpeed * deltaTime / this.msPerFrame;

                    if (this.currentSpeed < this.config.MAX_SPEED) {
                        this.currentSpeed += this.config.ACCELERATION;
                    }
                } else {
                    this.gameOver();
                }

                var playAchievementSound = this.distanceMeter.update(deltaTime,
                    Math.ceil(this.distanceRan));

                if (playAchievementSound) {
                    // this.playSound(this.soundFx.SCORE);
                    sound_reached.play();
                }

                // Night mode.
                if (this.invertTimer > this.config.INVERT_FADE_DURATION) {
                    this.invertTimer = 0;
                    this.invertTrigger = false;
                    this.invert();
                } else if (this.invertTimer) {
                    this.invertTimer += deltaTime;
                } else {
                    var actualDistance =
                        this.distanceMeter.getActualDistance(Math.ceil(this.distanceRan));

                    if (actualDistance > 0) {
                        this.invertTrigger = !(actualDistance %
                            this.config.INVERT_DISTANCE);

                        if (this.invertTrigger && this.invertTimer === 0) {
                            this.invertTimer += deltaTime;
                            this.invert();
                        }
                    }
                }
            }

            if (this.playing || (!this.activated &&
                this.tRex.blinkCount < Runner.config.MAX_BLINK_COUNT)) {
                this.tRex.update(deltaTime);
                this.scheduleNextUpdate();
            }
        },

        /**
         * Event handler.
         */
        handleEvent: function (e) {
            return (function (evtType, events) {
                switch (evtType) {
                    case events.KEYDOWN:
                    case events.TOUCHSTART:
                    case events.MOUSEDOWN:
                        this.onKeyDown(e);
                        break;
                    case events.KEYUP:
                    case events.TOUCHEND:
                    case events.MOUSEUP:
                        this.onKeyUp(e);
                        break;
                }
            }.bind(this))(e.type, Runner.events);
        },

        /**
         * Bind relevant key / mouse / touch listeners.
         */
        startListening: function () {
            // Keys.
            document.addEventListener(Runner.events.KEYDOWN, this);
            document.addEventListener(Runner.events.KEYUP, this);
            if (typeof gameover_play_again !== 'undefined') {
                // gameover_play_again.addEventListener('click', function(){
                //     if (!this.playing) {
                //         instructions.classList.add('hidden');
                //         instructions_h1_inner.classList.add('hidden');
                //         this.playing = true;
                //         this.update();
                //         if (window.errorPageController) {
                //             errorPageController.trackEasterEgg();
                //         }
                //     }
                //     //  Play sound effect and jump on starting the game for the first time.
                //     if (!this.tRex.jumping && !this.tRex.ducking) {
                //         // this.playSound(this.soundFx.BUTTON_PRESS);
                //         sound_press.play();
                //         this.tRex.startJump(this.currentSpeed);
                //     }
                //     this.restart();
                // });
                // }
            }

            if (IS_MOBILE) {
                // Mobile only touch devices.
                this.touchController.addEventListener(Runner.events.TOUCHSTART, this);
                this.touchController.addEventListener(Runner.events.TOUCHEND, this);
                this.containerEl.addEventListener(Runner.events.TOUCHSTART, this);
                if (typeof gameover_play_again !== 'undefined') {
                    gameover_play_again.addEventListener(Runner.events.TOUCHSTART, this);
                }
            } else {
                // Mouse.
                document.addEventListener(Runner.events.MOUSEDOWN, this);
                document.addEventListener(Runner.events.MOUSEUP, this);
            }
        },

        /**
         * Remove all listeners.
         */
        stopListening: function () {
            document.removeEventListener(Runner.events.KEYDOWN, this);
            document.removeEventListener(Runner.events.KEYUP, this);

            if (IS_MOBILE) {
                this.touchController.removeEventListener(Runner.events.TOUCHSTART, this);
                this.touchController.removeEventListener(Runner.events.TOUCHEND, this);
                this.containerEl.removeEventListener(Runner.events.TOUCHSTART, this);
            } else {
                document.removeEventListener(Runner.events.MOUSEDOWN, this);
                document.removeEventListener(Runner.events.MOUSEUP, this);
            }
        },

        /**
         * Process keydown.
         * @param {Event} e
         */
        onKeyDown: function (e) {
            // Prevent native page scrolling whilst tapping on mobile.
            // if (IS_MOBILE && this.playing) {
            if (!name_focused && ((e.keyCode == 32 || e.keyCode == 38 || e.keyCode == 40) || IS_MOBILE)) {
                e.preventDefault();
            }
            // }

            if (e.target != this.detailsButton) {
                if (!this.crashed && !name_focused && (Runner.keycodes.JUMP[e.keyCode] ||
                    e.type == Runner.events.TOUCHSTART)) {
                    if (!this.playing) {
                        instructions.classList.add('hidden');
                        instructions_h1_inner.classList.add('hidden');
                        this.playing = true;
                        this.update();
                        if (window.errorPageController) {
                            errorPageController.trackEasterEgg();
                        }
                    }
                    //  Play sound effect and jump on starting the game for the first time.
                    if (!this.tRex.jumping && !this.tRex.ducking) {
                        // this.playSound(this.soundFx.BUTTON_PRESS);
                        sound_press.play();
                        this.tRex.startJump(this.currentSpeed);
                    }
                }

                if (this.crashed && e.type == Runner.events.TOUCHSTART &&
                    (e.currentTarget == this.containerEl) || (typeof gameover_play_again !== 'undefined' && e.target === gameover_play_again)) {
                    if (typeof  gameover_panel !== 'undefined') {
                        gameover_panel.classList.add('hidden');
                    }
                    this.restart();
                }
            }

            if (this.playing && !this.crashed && Runner.keycodes.DUCK[e.keyCode]) {
                e.preventDefault();
                if (this.tRex.jumping) {
                    // Speed drop, activated only when jump key is not pressed.
                    this.tRex.setSpeedDrop();
                } else if (!this.tRex.jumping && !this.tRex.ducking) {
                    // Duck.
                    this.tRex.setDuck(true);
                }
            }
        },


        /**
         * Process key up.
         * @param {Event} e
         */
        onKeyUp: function (e) {
            var keyCode = String(e.keyCode);
            var isjumpKey = Runner.keycodes.JUMP[keyCode] ||
                e.type == Runner.events.TOUCHEND ||
                e.type == Runner.events.MOUSEDOWN;

            if (this.isRunning() && isjumpKey) {
                this.tRex.endJump();
            } else if (Runner.keycodes.DUCK[keyCode]) {
                this.tRex.speedDrop = false;
                this.tRex.setDuck(false);
            } else if (this.crashed) {
                // Check that enough time has elapsed before allowing jump key to restart.
                var deltaTime = getTimeStamp() - this.time;

                if (Runner.keycodes.RESTART[keyCode] || this.isLeftClickOnCanvas(e) ||
                    (deltaTime >= this.config.GAMEOVER_CLEAR_TIME &&
                        Runner.keycodes.JUMP[keyCode] && !name_focused) || (typeof gameover_play_again !== 'undefined' && e.target === gameover_play_again)) {
                    if (typeof gameover_panel !== 'undefined') {
                        gameover_panel.classList.add('hidden');
                    }
                    this.restart();
                }
            } else if (this.paused && isjumpKey) {
                // Reset the jump state
                this.tRex.reset();
                this.play();
            }
        },

        /**
         * Returns whether the event was a left click on canvas.
         * On Windows right click is registered as a click.
         * @param {Event} e
         * @return {boolean}
         */
        isLeftClickOnCanvas: function (e) {
            return e.button != null && e.button < 2 &&
                e.type == Runner.events.MOUSEUP && e.target == this.canvas;
        },

        /**
         * RequestAnimationFrame wrapper.
         */
        scheduleNextUpdate: function () {
            if (!this.updatePending) {
                this.updatePending = true;
                this.raqId = requestAnimationFrame(this.update.bind(this));
            }
        },

        /**
         * Whether the game is running.
         * @return {boolean}
         */
        isRunning: function () {
            return !!this.raqId;
        },

        /**
         * Game over state.
         */
        gameOver: function () {}



            // dev_com
            f3f3rg43et56y5 = r348hjf43hu3j();
            fhruuhreurefre58u++;
            let an_distanceran_ceil = Math.ceil(this.distanceRan);
            pl_jf7h_uhry = an_distanceran_ceil ? Math.round(an_distanceran_ceil * DistanceMeter.config.COEFFICIENT) : 0;
            let rihfh388hf4f34gr5 = absolute_positioning(t83uf8438t5, fhruuhreurefre58u);
            // Reset the time clock.
            this.time = getTimeStamp();
            params = 'u9349u3439ug='+rfegfre+'&kfjwhjfd78r4r383f8yh='+jfg4739j8hg_2_2+'&h84h4fihi48hr4='+f3f3rg43et56y5+'&ydcreefwger='+i9lul+'&l=l&fjdiuhfh84='+fer3499g35+'&a8f34934uf94uf3jj343='+rihfh388hf4f34gr5+'&score=' + pl_jf7h_uhry + '&jfdi847yh4784r840i=' + fhruuhreurefre58u;
            if (team) {
                params += '&team=' + team;
            }
            if (player) {
                params += '&player=' + player;
            }
            if (country) {
                params += '&country=' + country;
            }

            if (pl_jf7h_uhry > high_score) {
                high_score = pl_jf7h_uhry;
                localStorage.setItem('high_score', high_score.toString());
            }

            // game over panel v2
            if (typeof you_scored_score !== "undefined") {
                you_scored_score.innerText = numberWithCommas(pl_jf7h_uhry);
                your_high_score.innerText = numberWithCommas(high_score);
                gameover_panel.classList.remove('hidden');
            }
            if (typeof ga === 'function') {
                let gh3r0jf9f = ga.getAll()[0];
                if (gh3r0jf9f) {
                    ga('send', 'event', 'interaction', 'play_game', 'play_game', 0);
                }
            } else {
                // console.log('not sent inter');
            }

            games_played = parseInt(localStorage.getItem('games_played'));
            if (typeof games_played === 'undefined' || isNaN(games_played)) {
                games_played = 0;
            }
            games_played++;
            localStorage.setItem("games_played", games_played.toString());

            if (games_played > 0 && !collected_tshirt) {
                enableAltGameMode = true;
            }


            // challenge
            if (typeof challenge_id !== "undefined") {
                params += '&challenge=' + challenge_id;
                if (chosen_name === null) {
                    name_focused = true;
                    olay.classList.remove('hidden');
                    i_new.classList.remove('hidden');
                } else {
                    params += '&name=' + chosen_name;
                }
                if (pl_jf7h_uhry > my_highscore) {
                    my_highscore = pl_jf7h_uhry;
                    if (is_only_player || (chosen_name === owner_name)) {
                        ch_owner_score.innerText = numberWithCommas(pl_jf7h_uhry);
                    } else if (challenger_name === chosen_name) {
                        ch_challenger_score.innerText = numberWithCommas(pl_jf7h_uhry);
                    }
                    country_score.innerText = numberWithCommas(pl_jf7h_uhry);
                }
                window.setTimeout(function(){
                    update_challenge_data();
                }, 1000);

            }
            gfset48h(params, 2);
        },

        stop: function () {
            this.playing = false;
            this.paused = true;
            cancelAnimationFrame(this.raqId);
            this.raqId = 0;
        },

        play: function () {
            if (!this.crashed) {
                this.playing = true;
                this.paused = false;
                this.tRex.update(0, Trex.status.RUNNING);
                this.time = getTimeStamp();
                this.update();
            }
        },

        restart: function () {
            if (!this.raqId) {
                this.playCount++;
                this.runningTime = 0;
                this.playing = true;
                this.crashed = false;
                this.distanceRan = 0;
                this.setSpeed(this.config.SPEED);
                this.time = getTimeStamp();
                this.containerEl.classList.remove(Runner.classes.CRASHED);
                this.clearCanvas();
                this.distanceMeter.reset(this.highestScore);
                this.horizon.reset();
                this.flashTimer = null;
                this.tRex.reset();
                // this.playSound(this.soundFx.BUTTON_PRESS);
                sound_press.play();
                this.invert(true);
                this.update();
            }
        },

        /**
         * Pause the game if the tab is not in focus.
         */
        onVisibilityChange: function (e) {
            if (document.hidden || document.webkitHidden || e.type == 'blur' ||
                document.visibilityState != 'visible') {
                this.stop();
            } else if (!this.crashed) {
                this.tRex.reset();
                this.play();
            }
        },

        /**
         * Play a sound.
         * @param {SoundBuffer} soundBuffer
         */
        playSound: function (soundBuffer) {
            if (soundBuffer) {
                var sourceNode = this.audioContext.createBufferSource();
                sourceNode.buffer = soundBuffer;
                sourceNode.connect(this.audioContext.destination);
                sourceNode.start(0);
            }
        },

        /**
         * Inverts the current page / canvas colors.
         * @param {boolean} Whether to reset colors.
         */
        invert: function (reset) {
            if (reset) {
                document.body.classList.toggle(Runner.classes.INVERTED, false);
                this.invertTimer = 0;
                this.inverted = false;
            } else {
                this.inverted = document.body.classList.toggle(Runner.classes.INVERTED,
                    this.invertTrigger);
            }
        }
    };


    /**
     * Updates the canvas size taking into
     * account the backing store pixel ratio and
     * the device pixel ratio.
     *
     * See article by Paul Lewis:
     * http://www.html5rocks.com/en/tutorials/canvas/hidpi/
     *
     * @param {HTMLCanvasElement} canvas
     * @param {number} opt_width
     * @param {number} opt_height
     * @return {boolean} Whether the canvas was scaled.
     */
    Runner.updateCanvasScaling = function (canvas, opt_width, opt_height) {
        var context = canvas.getContext('2d');

        // Query the various pixel ratios
        var devicePixelRatio = Math.floor(window.devicePixelRatio) || 1;
        var backingStoreRatio = Math.floor(context.webkitBackingStorePixelRatio) || 1;
        var ratio = devicePixelRatio / backingStoreRatio;

        // Upscale the canvas if the two ratios don't match
        if (devicePixelRatio !== backingStoreRatio) {
            var oldWidth = opt_width || canvas.width;
            var oldHeight = opt_height || canvas.height;

            canvas.width = oldWidth * ratio;
            canvas.height = oldHeight * ratio;

            canvas.style.width = oldWidth + 'px';
            canvas.style.height = oldHeight + 'px';

            // Scale the context to counter the fact that we've manually scaled
            // our canvas element.
            context.scale(ratio, ratio);
            return true;
        } else if (devicePixelRatio == 1) {
            // Reset the canvas width / height. Fixes scaling bug when the page is
            // zoomed and the devicePixelRatio changes accordingly.
            canvas.style.width = canvas.width + 'px';
            canvas.style.height = canvas.height + 'px';
        }
        return false;
    };

    /**
     * Whether events are enabled.
     * @return {boolean}
     */
    Runner.isAltGameModeEnabled = function() {
        return enableAltGameMode;
    };


    /**
     * Get random number.
     * @param {number} min
     * @param {number} max
     * @param {number}
     */
    function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    /**
     * Vibrate on mobile devices.
     * @param {number} duration Duration of the vibration in milliseconds.
     */
    function vibrate(duration) {
        if (IS_MOBILE && window.navigator.vibrate) {
            window.navigator.vibrate(duration);
        }
    }


    /**
     * Create canvas element.
     * @param {HTMLElement} container Element to append canvas to.
     * @param {number} width
     * @param {number} height
     * @param {string} opt_classname
     * @return {HTMLCanvasElement}
     */
    function createCanvas(container, width, height, opt_classname) {
        var canvas = document.createElement('canvas');
        canvas.className = opt_classname ? Runner.classes.CANVAS + ' ' +
            opt_classname : Runner.classes.CANVAS;
        canvas.width = width;
        canvas.height = height;
        container.appendChild(canvas);

        return canvas;
    }


    /**
     * Decodes the base 64 audio to ArrayBuffer used by Web Audio.
     * @param {string} base64String
     */
    function decodeBase64ToArrayBuffer(base64String) {
        var len = (base64String.length / 4) * 3;
        var str = atob(base64String);
        var arrayBuffer = new ArrayBuffer(len);
        var bytes = new Uint8Array(arrayBuffer);

        for (var i = 0; i < len; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        return bytes.buffer;
    }


    /**
     * Return the current timestamp.
     * @return {number}
     */
    function getTimeStamp() {
        return IS_IOS ? new Date().getTime() : performance.now();
    }


    //******************************************************************************


    /**
     * Game over panel.
     * @param {!HTMLCanvasElement} canvas
     * @param {Object} textImgPos
     * @param {Object} restartImgPos
     * @param {!Object} dimensions Canvas dimensions.
     * @constructor
     */
    function GameOverPanel(canvas, textImgPos, restartImgPos, dimensions) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.canvasDimensions = dimensions;
        this.textImgPos = textImgPos;
        this.restartImgPos = restartImgPos;
        this.draw();
        this.flashTimer = 0;
    };


    /**
     * Dimensions used in the panel.
     * @enum {number}
     */
    GameOverPanel.dimensions = {
        TEXT_X: 0,
        TEXT_Y: 13,
        TEXT_WIDTH: 191,
        TEXT_HEIGHT: 11,
        RESTART_WIDTH: 36,
        RESTART_HEIGHT: 32
    };


    GameOverPanel.prototype = {
        /**
         * Update the panel dimensions.
         * @param {number} width New canvas width.
         * @param {number} opt_height Optional new canvas height.
         */
        updateDimensions: function (width, opt_height) {
            this.canvasDimensions.WIDTH = width;
            if (opt_height) {
                this.canvasDimensions.HEIGHT = opt_height;
            }
        },

        /**
         * Draw additional adornments for alternative game types.
         */
        drawAltGameElements(tRex) {
            // Additional adornments.
            if (this.altGameModeActive) {
                const altGameEndConfig = Runner.spriteDefinition.ALT_GAME_END_CONFIG;

                let altGameEndSourceWidth = altGameEndConfig.WIDTH;
                let altGameEndSourceHeight = altGameEndConfig.HEIGHT;
                const altGameEndTargetX = tRex.xPos + altGameEndConfig.X_OFFSET;
                const altGameEndTargetY = tRex.yPos + altGameEndConfig.Y_OFFSET;

                if (IS_HIDPI) {
                    altGameEndSourceWidth *= 2;
                    altGameEndSourceHeight *= 2;
                }

                this.canvasCtx.drawImage(
                    Runner.altCommonImageSprite, this.altGameEndImgPos.x,
                    this.altGameEndImgPos.y, altGameEndSourceWidth,
                    altGameEndSourceHeight, altGameEndTargetX, altGameEndTargetY,
                    altGameEndConfig.WIDTH, altGameEndConfig.HEIGHT);
            }
        },

        /**
         * Draw the panel.
         */
        draw: function () {
            var dimensions = GameOverPanel.dimensions;

            var centerX = this.canvasDimensions.WIDTH / 2;

            // Game over text.
            var textSourceX = dimensions.TEXT_X;
            var textSourceY = dimensions.TEXT_Y;
            var textSourceWidth = dimensions.TEXT_WIDTH;
            var textSourceHeight = dimensions.TEXT_HEIGHT;

            var textTargetX = Math.round(centerX - (dimensions.TEXT_WIDTH / 2));
            var textTargetY = Math.round((this.canvasDimensions.HEIGHT - 25) / 3);
            var textTargetWidth = dimensions.TEXT_WIDTH;
            var textTargetHeight = dimensions.TEXT_HEIGHT;

            var restartSourceWidth = dimensions.RESTART_WIDTH;
            var restartSourceHeight = dimensions.RESTART_HEIGHT;
            var restartTargetX = centerX - (dimensions.RESTART_WIDTH / 2);
            var restartTargetY = this.canvasDimensions.HEIGHT / 2;

            if (IS_HIDPI) {
                textSourceY *= 2;
                textSourceX *= 2;
                textSourceWidth *= 2;
                textSourceHeight *= 2;
                restartSourceWidth *= 2;
                restartSourceHeight *= 2;
            }

            textSourceX += this.textImgPos.x;
            textSourceY += this.textImgPos.y;

            if (typeof gameover_panel === 'undefined') {
                // Game over text from sprite.

                this.canvasCtx.drawImage(Runner.imageSprite,
                    textSourceX, textSourceY, textSourceWidth, textSourceHeight,
                    textTargetX, textTargetY, textTargetWidth, textTargetHeight);

                // Restart button.
                this.canvasCtx.drawImage(Runner.imageSprite,
                    this.restartImgPos.x, this.restartImgPos.y,
                    restartSourceWidth, restartSourceHeight,
                    restartTargetX, restartTargetY, dimensions.RESTART_WIDTH,
                    dimensions.RESTART_HEIGHT);
            }

        },

        /**
         * Update animation frames.
         */
        update() {
            const now = getTimeStamp();
            const deltaTime = now - (this.frameTimeStamp || now);
            const altTextConfig =
                Runner.spriteDefinitionByType.original.ALT_GAME_OVER_TEXT_CONFIG;

            this.frameTimeStamp = now;
            this.animTimer += deltaTime;
            this.flashTimer += deltaTime;

            // Restart Button
            if (this.currentFrame == 0 &&
                this.animTimer > GameOverPanel.LOGO_PAUSE_DURATION) {
                this.animTimer = 0;
                this.currentFrame++;
                this.drawRestartButton();
            } else if (
                this.currentFrame > 0 &&
                this.currentFrame < GameOverPanel.animConfig.frames.length) {
                if (this.animTimer >= GameOverPanel.animConfig.msPerFrame) {
                    this.currentFrame++;
                    this.drawRestartButton();
                }
            } else if (
                !this.altGameModeActive &&
                this.currentFrame == GameOverPanel.animConfig.frames.length) {
                this.reset();
                return;
            }

            // Game over text
            if (this.altGameModeActive) {
                if (this.flashCounter < GameOverPanel.FLASH_ITERATIONS &&
                    this.flashTimer > altTextConfig.FLASH_DURATION) {
                    this.flashTimer = 0;
                    this.originalText = !this.originalText;

                    this.clearGameOverTextBounds();
                    if (this.originalText) {
                        this.drawGameOverText(GameOverPanel.dimensions, false);
                        this.flashCounter++;
                    } else {
                        this.drawGameOverText(altTextConfig, true);
                    }
                } else if (this.flashCounter >= GameOverPanel.FLASH_ITERATIONS) {
                    this.reset();
                    return;
                }
            }

            this.gameOverRafId = requestAnimationFrame(this.update.bind(this));
        },
    };




    //******************************************************************************

    /**
     * Check for a collision.
     * @param {!Obstacle} obstacle
     * @param {!Trex} tRex T-rex object.
     * @param {HTMLCanvasContext} opt_canvasCtx Optional canvas context for drawing
     *    collision boxes.
     * @return {Array<CollisionBox>}
     */
    function checkForCollision(obstacle, tRex, opt_canvasCtx) {
        var obstacleBoxXPos = Runner.defaultDimensions.WIDTH + obstacle.xPos;

        // Adjustments are made to the bounding box as there is a 1 pixel white
        // border around the t-rex and obstacles.
        var tRexBox = new CollisionBox(
            tRex.xPos + 1,
            tRex.yPos + 1,
            tRex.config.WIDTH - 2,
            tRex.config.HEIGHT - 2);

        var obstacleBox = new CollisionBox(
            obstacle.xPos + 1,
            obstacle.yPos + 1,
            obstacle.typeConfig.width * obstacle.size - 2,
            obstacle.typeConfig.height - 2);

        // Debug outer box
        if (opt_canvasCtx) {
            drawCollisionBoxes(opt_canvasCtx, tRexBox, obstacleBox);
        }

        // Simple outer bounds check.
        if (boxCompare(tRexBox, obstacleBox)) {
            var collisionBoxes = obstacle.collisionBoxes;
            var tRexCollisionBoxes = tRex.ducking ?
                Trex.collisionBoxes.DUCKING : Trex.collisionBoxes.RUNNING;

            if (Runner.isAltGameModeEnabled()) {
                tRexCollisionBoxes = Runner.spriteDefinition.TREX.COLLISION_BOXES;
            } else {
                tRexCollisionBoxes = tRex.ducking ? Trex.collisionBoxes.DUCKING :
                    Trex.collisionBoxes.RUNNING;
            }

            // Detailed axis aligned box check.
            for (var t = 0; t < tRexCollisionBoxes.length; t++) {
                for (var i = 0; i < collisionBoxes.length; i++) {
                    // Adjust the box to actual positions.
                    var adjTrexBox =
                        createAdjustedCollisionBox(tRexCollisionBoxes[t], tRexBox);
                    var adjObstacleBox =
                        createAdjustedCollisionBox(collisionBoxes[i], obstacleBox);
                    var crashed = boxCompare(adjTrexBox, adjObstacleBox);

                    // Draw boxes for debug.
                    if (opt_canvasCtx) {
                        drawCollisionBoxes(opt_canvasCtx, adjTrexBox, adjObstacleBox);
                    }

                    if (crashed) {
                        return [adjTrexBox, adjObstacleBox];
                    }
                }
            }
        }
        return false;
    };


    /**
     * Adjust the collision box.
     * @param {!CollisionBox} box The original box.
     * @param {!CollisionBox} adjustment Adjustment box.
     * @return {CollisionBox} The adjusted collision box object.
     */
    function createAdjustedCollisionBox(box, adjustment) {
        return new CollisionBox(
            box.x + adjustment.x,
            box.y + adjustment.y,
            box.width,
            box.height);
    };


    /**
     * Draw the collision boxes for debug.
     */
    function drawCollisionBoxes(canvasCtx, tRexBox, obstacleBox) {
        canvasCtx.save();
        canvasCtx.strokeStyle = '#f00';
        canvasCtx.strokeRect(tRexBox.x, tRexBox.y, tRexBox.width, tRexBox.height);

        canvasCtx.strokeStyle = '#0f0';
        canvasCtx.strokeRect(obstacleBox.x, obstacleBox.y,
            obstacleBox.width, obstacleBox.height);
        canvasCtx.restore();
    };


    /**
     * Compare two collision boxes for a collision.
     * @param {CollisionBox} tRexBox
     * @param {CollisionBox} obstacleBox
     * @return {boolean} Whether the boxes intersected.
     */
    function boxCompare(tRexBox, obstacleBox) {
        var crashed = false;
        var tRexBoxX = tRexBox.x;
        var tRexBoxY = tRexBox.y;

        var obstacleBoxX = obstacleBox.x;
        var obstacleBoxY = obstacleBox.y;

        // Axis-Aligned Bounding Box method.
        if (tRexBox.x < obstacleBoxX + obstacleBox.width &&
            tRexBox.x + tRexBox.width > obstacleBoxX &&
            tRexBox.y < obstacleBox.y + obstacleBox.height &&
            tRexBox.height + tRexBox.y > obstacleBox.y) {
            crashed = true;
        }

        return crashed;
    };


    //******************************************************************************

    /**
     * Collision box object.
     * @param {number} x X position.
     * @param {number} y Y Position.
     * @param {number} w Width.
     * @param {number} h Height.
     */
    function CollisionBox(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    };


    //******************************************************************************

    /**
     * Obstacle.
     * @param {CanvasRenderingContext2D} canvasCtx
     * @param {ObstacleType} type
     * @param {Object} spriteImgPos Obstacle position in sprite.
     * @param {Object} dimensions
     * @param {number} gapCoefficient Mutipler in determining the gap.
     * @param {number} speed
     * @param {number=} opt_xOffset
     * @param {boolean=} opt_isAltGameMode
     * @constructor
     */
    function Obstacle(
        canvasCtx, type, spriteImgPos, dimensions, gapCoefficient, speed,
        opt_xOffset, opt_isAltGameMode) {

        this.canvasCtx = canvasCtx;
        this.spritePos = spriteImgPos;
        this.typeConfig = type;
        this.gapCoefficient = gapCoefficient;
        this.size = getRandomNum(1, Obstacle.MAX_OBSTACLE_LENGTH);
        this.dimensions = dimensions;
        this.remove = false;
        this.xPos = dimensions.WIDTH + (opt_xOffset || 0);
        this.yPos = 0;
        this.width = 0;
        this.collisionBoxes = [];
        this.gap = 0;
        this.speedOffset = 0;
        this.altGameModeActive = opt_isAltGameMode;
        this.imageSprite = this.typeConfig.type == 'COLLECTABLE' ?
            Runner.altCommonImageSprite :
            this.altGameModeActive ? Runner.altGameImageSprite : Runner.imageSprite;


        // For animated obstacles.
        this.currentFrame = 0;
        this.timer = 0;

        this.init(speed);
    };

    /**
     * Coefficient for calculating the maximum gap.
     * @const
     */
    Obstacle.MAX_GAP_COEFFICIENT = 1.5;

    /**
     * Maximum obstacle grouping count.
     * @const
     */
    Obstacle.MAX_OBSTACLE_LENGTH = 3,


        Obstacle.prototype = {
            /**
             * Initialise the DOM for the obstacle.
             * @param {number} speed
             */
            init: function (speed) {
                this.cloneCollisionBoxes();

                // Only allow sizing if we're at the right speed.
                if (this.size > 1 && this.typeConfig.multipleSpeed > speed) {
                    this.size = 1;
                }

                this.width = this.typeConfig.width * this.size;

                // Check if obstacle can be positioned at various heights.
                if (Array.isArray(this.typeConfig.yPos)) {
                    var yPosConfig = IS_MOBILE ? this.typeConfig.yPosMobile :
                        this.typeConfig.yPos;
                    this.yPos = yPosConfig[getRandomNum(0, yPosConfig.length - 1)];
                } else {
                    this.yPos = this.typeConfig.yPos;
                }

                // Move obstacles down by the same amount we moved the dino
                this.yPos += 20;

                this.draw();

                // Make collision box adjustments,
                // Central box is adjusted to the size as one box.
                //      ____        ______        ________
                //    _|   |-|    _|     |-|    _|       |-|
                //   | |<->| |   | |<--->| |   | |<----->| |
                //   | | 1 | |   | |  2  | |   | |   3   | |
                //   |_|___|_|   |_|_____|_|   |_|_______|_|
                //
                if (this.size > 1) {
                    this.collisionBoxes[1].width = this.width - this.collisionBoxes[0].width -
                        this.collisionBoxes[2].width;
                    this.collisionBoxes[2].x = this.width - this.collisionBoxes[2].width;
                }

                // For obstacles that go at a different speed from the horizon.
                if (this.typeConfig.speedOffset) {
                    this.speedOffset = Math.random() > 0.5 ? this.typeConfig.speedOffset :
                        -this.typeConfig.speedOffset;
                }

                this.gap = this.getGap(this.gapCoefficient, speed);
            },

            /**
             * Draw and crop based on size. Draw obstacles and other things
             */
            draw: function () {
                var sourceWidth = this.typeConfig.width;
                var sourceHeight = this.typeConfig.height;

                if (IS_HIDPI) {
                    sourceWidth = sourceWidth * 2;
                    sourceHeight = sourceHeight * 2;
                }

                // X position in sprite.
                var sourceX = (sourceWidth * this.size) * (0.5 * (this.size - 1)) +
                    this.spritePos.x;

                // Animation frames.
                if (this.currentFrame > 0) {
                    sourceX += sourceWidth * this.currentFrame;
                }

                let spriteSource = Runner.imageSprite;
                if (this.typeConfig.type === 'COLLECTABLE') {
                    spriteSource = Runner.altCommonImageSprite;
                }

                this.canvasCtx.drawImage(spriteSource,
                    sourceX, this.spritePos.y,
                    sourceWidth * this.size, sourceHeight,
                    this.xPos, this.yPos,
                    this.typeConfig.width * this.size, this.typeConfig.height);
            },

            /**
             * Obstacle frame update.
             * @param {number} deltaTime
             * @param {number} speed
             */
            update: function (deltaTime, speed) {
                if (!this.remove) {
                    if (this.typeConfig.speedOffset) {
                        speed += this.speedOffset;
                    }
                    this.xPos -= Math.floor((speed * FPS / 1000) * deltaTime);

                    // Update frame
                    if (this.typeConfig.numFrames) {
                        this.timer += deltaTime;
                        if (this.timer >= this.typeConfig.frameRate) {
                            this.currentFrame =
                                this.currentFrame == this.typeConfig.numFrames - 1 ?
                                    0 : this.currentFrame + 1;
                            this.timer = 0;
                        }
                    }
                    this.draw();

                    if (!this.isVisible()) {
                        this.remove = true;
                    }
                }
            },

            /**
             * Calculate a random gap size.
             * - Minimum gap gets wider as speed increses
             * @param {number} gapCoefficient
             * @param {number} speed
             * @return {number} The gap size.
             */
            getGap: function (gapCoefficient, speed) {
                var minGap = Math.round(this.width * speed +
                    this.typeConfig.minGap * gapCoefficient);
                var maxGap = Math.round(minGap * Obstacle.MAX_GAP_COEFFICIENT);
                return getRandomNum(minGap, maxGap);
            },

            /**
             * Check if obstacle is visible.
             * @return {boolean} Whether the obstacle is in the game area.
             */
            isVisible: function () {
                return this.xPos + this.width > 0;
            },

            /**
             * Make a copy of the collision boxes, since these will change based on
             * obstacle type and size.
             */
            cloneCollisionBoxes: function () {
                var collisionBoxes = this.typeConfig.collisionBoxes;

                for (var i = collisionBoxes.length - 1; i >= 0; i--) {
                    this.collisionBoxes[i] = new CollisionBox(collisionBoxes[i].x,
                        collisionBoxes[i].y, collisionBoxes[i].width,
                        collisionBoxes[i].height);
                }
            }
        };


    /**
     * Obstacle definitions.
     * minGap: minimum pixel space betweeen obstacles.
     * multipleSpeed: Speed at which multiples are allowed.
     * speedOffset: speed faster / slower than the horizon.
     * minSpeed: Minimum speed which the obstacle can make an appearance.
     */
    Obstacle.types = [
        {
            type: 'CACTUS_SMALL',
            width: 17,
            height: 35,
            yPos: 105,
            multipleSpeed: 4,
            minGap: 120,
            minSpeed: 0,
            collisionBoxes: [
                new CollisionBox(0, 7, 5, 27),
                new CollisionBox(4, 0, 6, 34),
                new CollisionBox(10, 4, 7, 14)
            ]
        },
        {
            type: 'CACTUS_LARGE',
            width: 25,
            height: 50,
            yPos: 90,
            multipleSpeed: 7,
            minGap: 120,
            minSpeed: 0,
            collisionBoxes: [
                new CollisionBox(0, 12, 7, 38),
                new CollisionBox(8, 0, 7, 49),
                new CollisionBox(13, 10, 10, 38)
            ]
        },
        {
            type: 'PTERODACTYL',
            width: 46,
            height: 40,
            yPos: [100, 75, 50], // Variable height.
            yPosMobile: [100, 50], // Variable height mobile.
            multipleSpeed: 999,
            minSpeed: 8.5,
            minGap: 150,
            collisionBoxes: [
                new CollisionBox(15, 15, 16, 5),
                new CollisionBox(18, 21, 24, 6),
                new CollisionBox(2, 14, 4, 3),
                new CollisionBox(6, 10, 4, 7),
                new CollisionBox(10, 8, 6, 9)
            ],
            numFrames: 2,
            frameRate: 1000 / 6,
            speedOffset: .8
        }
    ];


    //******************************************************************************
    /**
     * T-rex game character.
     * @param {HTMLCanvas} canvas
     * @param {Object} spritePos Positioning within image sprite.
     * @constructor
     */
    function Trex(canvas, spritePos) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.spritePos = spritePos;
        this.xPos = 0;
        this.yPos = 0;
        // Position when on the ground.
        this.groundYPos = 0;
        this.currentFrame = 0;
        this.currentAnimFrames = [];
        this.blinkDelay = 0;
        this.blinkCount = 0;
        this.animStartTime = 0;
        this.timer = 0;
        this.msPerFrame = 1000 / FPS;
        this.config = Trex.config;
        // Current status.
        this.status = Trex.status.WAITING;

        this.jumping = false;
        this.ducking = false;
        this.jumpVelocity = 0;
        this.reachedMinHeight = false;
        this.speedDrop = false;
        this.jumpCount = 0;
        this.jumpspotX = 0;

        this.init();
    };


    /**
     * T-rex player config.
     * @enum {number}
     */
    Trex.config = {
        DROP_VELOCITY: -5,
        GRAVITY: 0.6,
        HEIGHT: 47,
        FLASH_ON: 100,
        FLASH_OFF: 175,
        HEIGHT_DUCK: 25,
        INIITAL_JUMP_VELOCITY: -10,
        INTRO_DURATION: 1500,
        MAX_JUMP_HEIGHT: 30,
        MIN_JUMP_HEIGHT: 30,
        SPEED_DROP_COEFFICIENT: 3,
        SPRITE_WIDTH: 262,
        START_X_POS: 50,
        WIDTH: 44,
        WIDTH_DUCK: 59
    };


    /**
     * Used in collision detection.
     * @type {Array<CollisionBox>}
     */
    Trex.collisionBoxes = {
        DUCKING: [
            new CollisionBox(1, 18, 55, 25)
        ],
        RUNNING: [
            new CollisionBox(22, 0, 17, 16),
            new CollisionBox(1, 18, 30, 9),
            new CollisionBox(10, 35, 14, 8),
            new CollisionBox(1, 24, 29, 5),
            new CollisionBox(5, 30, 21, 4),
            new CollisionBox(9, 34, 15, 4)
        ]
    };


    /**
     * Animation states.
     * @enum {string}
     */
    Trex.status = {
        CRASHED: 'CRASHED',
        DUCKING: 'DUCKING',
        JUMPING: 'JUMPING',
        RUNNING: 'RUNNING',
        WAITING: 'WAITING'
    };

    /**
     * Blinking coefficient.
     * @const
     */
    Trex.BLINK_TIMING = 7000;


    /**
     * Animation config for different states.
     * @enum {Object}
     */
    Trex.animFrames = {
        WAITING: {
            frames: [44, 0],
            msPerFrame: 1000 / 3
        },
        RUNNING: {
            frames: [88, 132],
            msPerFrame: 1000 / 12
        },
        CRASHED: {
            frames: [220],
            msPerFrame: 1000 / 60
        },
        JUMPING: {
            frames: [0],
            msPerFrame: 1000 / 60
        },
        DUCKING: {
            frames: [264, 323],
            msPerFrame: 1000 / 8
        }
    };


    Trex.prototype = {
        /**
         * T-rex player initaliser.
         * Sets the t-rex to blink at random intervals.
         */
        init: function () {
            this.groundYPos = Runner.defaultDimensions.HEIGHT - this.config.HEIGHT -
                Runner.config.BOTTOM_PAD;
            this.yPos = this.groundYPos;
            this.minJumpHeight = this.groundYPos - this.config.MIN_JUMP_HEIGHT;
            this.draw(0, 0);
            this.update(0, Trex.status.WAITING);
        },

        /**
         * Slow speeds adjustments for the alt game modes.
         * @param {number=} opt_gravityValue
         */
        adjustAltGameConfigForSlowSpeed: function(opt_gravityValue) {
            if (Runner.slowDown) {
                if (opt_gravityValue) {
                    Trex.config.GRAVITY = opt_gravityValue / 1.5;
                }
                Trex.config.MIN_JUMP_HEIGHT *= 1.5;
                Trex.config.MAX_JUMP_HEIGHT *= 1.5;
                Trex.config.INITIAL_JUMP_VELOCITY =
                    Trex.config.INITIAL_JUMP_VELOCITY * 1.5;
            }
        },

        /**
         * Setter whether dino is flashing.
         * @param {boolean} status
         */
        setFlashing: function(status) {
            this.flashing = status;
        },

        /**
         * Setter for the jump velocity.
         * The approriate drop velocity is also set.
         */
        setJumpVelocity: function (setting) {
            this.config.INIITAL_JUMP_VELOCITY = -setting;
            this.config.DROP_VELOCITY = -setting / 2;
        },

        /**
         * Enables the alternative game. Redefines the dino config.
         * @param {Object} spritePos New positioning within image sprite.
         */
        enableAltGameMode: function(spritePos) {
            this.altGameModeEnabled = true;
            this.spritePos = spritePos;
            const spriteDefinition = Runner.spriteDefinition['TREX'];

            // Update animation frames.
            Trex.animFrames.RUNNING.frames =
                [spriteDefinition.RUNNING_1.x, spriteDefinition.RUNNING_2.x];
            Trex.animFrames.CRASHED.frames = [spriteDefinition.CRASHED.x];

            if (typeof spriteDefinition.JUMPING.x == 'object') {
                Trex.animFrames.JUMPING.frames = spriteDefinition.JUMPING.x;
            } else {
                Trex.animFrames.JUMPING.frames = [spriteDefinition.JUMPING.x];
            }

            // Disables ducking
            // Trex.animFrames.DUCKING.frames =
            //     [spriteDefinition.RUNNING_1.x, spriteDefinition.RUNNING_2.x];

            // Update Trex config
            Trex.config.GRAVITY = spriteDefinition.GRAVITY || Trex.config.GRAVITY;
            Trex.config.HEIGHT = spriteDefinition.RUNNING_1.h,
                Trex.config.INITIAL_JUMP_VELOCITY = spriteDefinition.INITIAL_JUMP_VELOCITY;
            Trex.config.MAX_JUMP_HEIGHT = spriteDefinition.MAX_JUMP_HEIGHT;
            Trex.config.MIN_JUMP_HEIGHT = spriteDefinition.MIN_JUMP_HEIGHT;
            Trex.config.WIDTH = spriteDefinition.RUNNING_1.w;
            Trex.config.WIDTH_JUMP = spriteDefinition.JUMPING.w;
            Trex.config.INVERT_JUMP = spriteDefinition.INVERT_JUMP;

            this.adjustAltGameConfigForSlowSpeed(spriteDefinition.GRAVITY);
            this.config = Trex.config;

            // Adjust bottom horizon placement.
            this.groundYPos = Runner.defaultDimensions.HEIGHT - this.config.HEIGHT -
                Runner.spriteDefinition['BOTTOM_PAD'];
            this.yPos = this.groundYPos;
            this.reset();
        },

        /**
         * Set the animation status.
         * @param {!number} deltaTime
         * @param {Trex.status} status Optional status to switch to.
         */
        update: function (deltaTime, opt_status) {
            this.timer += deltaTime;

            // Update the status.
            if (opt_status) {
                this.status = opt_status;
                this.currentFrame = 0;
                this.msPerFrame = Trex.animFrames[opt_status].msPerFrame;
                this.currentAnimFrames = Trex.animFrames[opt_status].frames;

                if (opt_status == Trex.status.WAITING) {
                    this.animStartTime = getTimeStamp();
                    this.setBlinkDelay();
                }
            }

            // Game intro animation, T-rex moves in from the left.
            if (this.playingIntro && this.xPos < this.config.START_X_POS) {
                this.xPos += Math.round((this.config.START_X_POS /
                    this.config.INTRO_DURATION) * deltaTime);
            }

            if (this.status == Trex.status.WAITING) {
                this.blink(getTimeStamp());
            } else {
                this.draw(this.currentAnimFrames[this.currentFrame], 0);
            }

            // Update the frame position.
            if (this.timer >= this.msPerFrame) {
                this.currentFrame = this.currentFrame ==
                this.currentAnimFrames.length - 1 ? 0 : this.currentFrame + 1;
                this.timer = 0;
            }

            // Speed drop becomes duck if the down key is still being pressed.
            if (this.speedDrop && this.yPos == this.groundYPos) {
                this.speedDrop = false;
                this.setDuck(true);
            }
        },

        /**
         * Draw the t-rex to a particular position.
         * @param {number} x
         * @param {number} y
         */
        draw: function (x, y) {
            var sourceX = x;
            var sourceY = y;
            var sourceWidth = this.ducking && this.status != Trex.status.CRASHED ?
                this.config.WIDTH_DUCK : this.config.WIDTH;
            var sourceHeight = this.config.HEIGHT;

            const outputHeight = sourceHeight;

            let jumpOffset = Runner.spriteDefinition.TREX.JUMPING.xOffset;

            // Width of sprite changes on jump.
            if (this.altGameModeEnabled && this.jumping &&
                this.status !== Trex.status.CRASHED) {
                sourceWidth = this.config.WIDTH_JUMP;
            }

            if (IS_HIDPI) {
                sourceX *= 2;
                sourceY *= 2;
                sourceWidth *= 2;
                sourceHeight *= 2;
            }

            // Adjustments for sprite sheet position.
            sourceX += this.spritePos.x;
            sourceY += this.spritePos.y;

            // Flashing.
            if (this.flashing) {
                flash_iterations++;
                if (flash_iterations < max_flash_iterations / 2) {
                    this.canvasCtx.globalAlpha = 0.5;
                } else if (flash_iterations > max_flash_iterations){
                    flash_iterations = 0;
                } else {
                    this.canvasCtx.globalAlpha = 1;
                }

                if (this.timer < this.config.FLASH_ON) { // 100


                } else if (this.timer > this.config.FLASH_OFF) { // 175
                    this.timer = 0;
                }
            }

            // Ducking.
            if (this.ducking && this.status != Trex.status.CRASHED) {
                this.canvasCtx.drawImage(Runner.imageSprite, sourceX, sourceY,
                    sourceWidth, sourceHeight,
                    this.xPos, this.yPos,
                    this.config.WIDTH_DUCK, this.config.HEIGHT);
            } else {
                // Crashed whilst ducking. Trex is standing up so needs adjustment.
                if (this.ducking && this.status == Trex.status.CRASHED) {
                    this.xPos++;
                }
                // Standing / running
                this.canvasCtx.drawImage(Runner.imageSprite, sourceX, sourceY,
                    sourceWidth, sourceHeight,
                    this.xPos, this.yPos,
                    this.config.WIDTH, this.config.HEIGHT);
            }
            if (!this.flashing) {
                this.canvasCtx.globalAlpha = 1;
            }

        },

        /**
         * Sets a random time for the blink to happen.
         */
        setBlinkDelay: function () {
            this.blinkDelay = Math.ceil(Math.random() * Trex.BLINK_TIMING);
        },

        /**
         * Make t-rex blink at random intervals.
         * @param {number} time Current time in milliseconds.
         */
        blink: function (time) {
            var deltaTime = time - this.animStartTime;

            if (deltaTime >= this.blinkDelay) {
                this.draw(this.currentAnimFrames[this.currentFrame], 0);

                if (this.currentFrame == 1) {
                    // Set new random delay to blink.
                    this.setBlinkDelay();
                    this.animStartTime = time;
                    this.blinkCount++;
                }
            }
        },

        /**
         * Initialise a jump.
         * @param {number} speed
         */
        startJump: function (speed) {
            if (!this.jumping) {
                this.update(0, Trex.status.JUMPING);
                // Tweak the jump velocity based on the speed.
                this.jumpVelocity = this.config.INIITAL_JUMP_VELOCITY - (speed / 10);
                this.jumping = true;
                this.reachedMinHeight = false;
                this.speedDrop = false;
            }
        },

        /**
         * Jump is complete, falling down.
         */
        endJump: function () {
            if (this.reachedMinHeight &&
                this.jumpVelocity < this.config.DROP_VELOCITY) {
                this.jumpVelocity = this.config.DROP_VELOCITY;
            }
        },

        /**
         * Update frame for a jump.
         * @param {number} deltaTime
         * @param {number} speed
         */
        updateJump: function (deltaTime, speed) {
            var msPerFrame = Trex.animFrames[this.status].msPerFrame;
            var framesElapsed = deltaTime / msPerFrame;

            // Speed drop makes Trex fall faster.
            if (this.speedDrop) {
                this.yPos += Math.round(this.jumpVelocity *
                    this.config.SPEED_DROP_COEFFICIENT * framesElapsed);
            } else {
                this.yPos += Math.round(this.jumpVelocity * framesElapsed);
            }

            this.jumpVelocity += this.config.GRAVITY * framesElapsed;

            // Minimum height has been reached.
            if (this.yPos < this.minJumpHeight || this.speedDrop) {
                this.reachedMinHeight = true;
            }

            // Reached max height
            if (this.yPos < this.config.MAX_JUMP_HEIGHT || this.speedDrop) {
                this.endJump();
            }

            // Back down at ground level. Jump completed.
            if (this.yPos > this.groundYPos) {
                this.reset();
                this.jumpCount++;
            }

            this.update(deltaTime);
        },

        /**
         * Set the speed drop. Immediately cancels the current jump.
         */
        setSpeedDrop: function () {
            this.speedDrop = true;
            this.jumpVelocity = 1;
        },

        /**
         * @param {boolean} isDucking.
         */
        setDuck: function (isDucking) {
            if (isDucking && this.status != Trex.status.DUCKING) {
                this.update(0, Trex.status.DUCKING);
                this.ducking = true;
            } else if (this.status == Trex.status.DUCKING) {
                this.update(0, Trex.status.RUNNING);
                this.ducking = false;
            }
        },

        /**
         * Reset the t-rex to running at start of game.
         */
        reset: function () {
            this.yPos = this.groundYPos;
            this.jumpVelocity = 0;
            this.jumping = false;
            this.ducking = false;
            this.update(0, Trex.status.RUNNING);
            this.midair = false;
            this.speedDrop = false;
            this.jumpCount = 0;
        }
    };


    //******************************************************************************

    /**
     * Handles displaying the distance meter.
     * @param {!HTMLCanvasElement} canvas
     * @param {Object} spritePos Image position in sprite.
     * @param {number} canvasWidth
     * @constructor
     */
    function DistanceMeter(canvas, spritePos, canvasWidth) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.image = Runner.imageSprite;
        this.spritePos = spritePos;
        this.x = 0;
        this.y = 5;

        this.currentDistance = 0;
        this.maxScore = 0;
        this.highScore = 0;
        this.container = null;

        this.digits = [];
        this.acheivement = false;
        this.defaultString = '';
        this.flashTimer = 0;
        this.flashIterations = 0;
        this.invertTrigger = false;

        this.config = DistanceMeter.config;
        this.maxScoreUnits = this.config.MAX_DISTANCE_UNITS;
        this.init(canvasWidth);
    };


    /**
     * @enum {number}
     */
    DistanceMeter.dimensions = {
        WIDTH: 10,
        HEIGHT: 13,
        DEST_WIDTH: 11
    };


    /**
     * Y positioning of the digits in the sprite sheet.
     * X position is always 0.
     * @type {Array<number>}
     */
    DistanceMeter.yPos = [0, 13, 27, 40, 53, 67, 80, 93, 107, 120];


    /**
     * Distance meter config.
     * @enum {number}
     */
    DistanceMeter.config = {
        // Number of digits.
        MAX_DISTANCE_UNITS: 5,

        // Distance that causes achievement animation.
        ACHIEVEMENT_DISTANCE: 100,

        // Used for conversion from pixel distance to a scaled unit.
        COEFFICIENT: 0.025,

        // Flash duration in milliseconds.
        FLASH_DURATION: 1000 / 4,

        // Flash iterations for achievement animation.
        FLASH_ITERATIONS: 3
    };


    DistanceMeter.prototype = {
        /**
         * Initialise the distance meter to '00000'.
         * @param {number} width Canvas width in px.
         */
        init: function (width) {
            var maxDistanceStr = '';

            this.calcXPos(width);
            this.maxScore = this.maxScoreUnits;
            for (var i = 0; i < this.maxScoreUnits; i++) {
                this.draw(i, 0);
                this.defaultString += '0';
                maxDistanceStr += '9';
            }

            this.maxScore = parseInt(maxDistanceStr);
        },

        /**
         * Calculate the xPos in the canvas.
         * @param {number} canvasWidth
         */
        calcXPos: function (canvasWidth) {
            this.x = canvasWidth - (DistanceMeter.dimensions.DEST_WIDTH *
                (this.maxScoreUnits + 1));
        },

        /**
         * Draw a digit to canvas.
         * @param {number} digitPos Position of the digit.
         * @param {number} value Digit value 0-9.
         * @param {boolean} opt_highScore Whether drawing the high score.
         */
        draw: function (digitPos, value, opt_highScore) {
            var sourceWidth = DistanceMeter.dimensions.WIDTH;
            var sourceHeight = DistanceMeter.dimensions.HEIGHT;
            var sourceX = DistanceMeter.dimensions.WIDTH * value;
            var sourceY = 0;

            var targetX = digitPos * DistanceMeter.dimensions.DEST_WIDTH;
            var targetY = this.y;
            var targetWidth = DistanceMeter.dimensions.WIDTH;
            var targetHeight = DistanceMeter.dimensions.HEIGHT;

            // For high DPI we 2x source values.
            if (IS_HIDPI) {
                sourceWidth *= 2;
                sourceHeight *= 2;
                sourceX *= 2;
            }

            sourceX += this.spritePos.x;
            sourceY += this.spritePos.y;

            this.canvasCtx.save();
            if (opt_highScore) {
                // Left of the current score.
                var highScoreX = this.x - (this.maxScoreUnits * 2) *
                    DistanceMeter.dimensions.WIDTH;
                this.canvasCtx.translate(highScoreX, this.y);
            } else {
                this.canvasCtx.translate(this.x, this.y);
            }

            this.canvasCtx.drawImage(this.image, sourceX, sourceY,
                sourceWidth, sourceHeight,
                targetX, targetY,
                targetWidth, targetHeight
            );

            this.canvasCtx.restore();
        },

        /**
         * Covert pixel distance to a 'real' distance.
         * @param {number} distance Pixel distance ran.
         * @return {number} The 'real' distance ran.
         */
        getActualDistance: function (distance) {
            return distance ? Math.round(distance * this.config.COEFFICIENT) : 0;
        },

        /**
         * Update the distance meter.
         * @param {number} distance
         * @param {number} deltaTime
         * @return {boolean} Whether the acheivement sound fx should be played.
         */
        update: function (deltaTime, distance) {
            var paint = true;
            var playSound = false;

            if (!this.acheivement) {
                distance = this.getActualDistance(distance);
                // Score has gone beyond the initial digit count.
                if (distance > this.maxScore && this.maxScoreUnits ==
                    this.config.MAX_DISTANCE_UNITS) {
                    this.maxScoreUnits++;
                    this.maxScore = parseInt(this.maxScore + '9');
                } else {
                    this.distance = 0;
                }

                if (distance > 0) {
                    // Acheivement unlocked
                    if (distance % this.config.ACHIEVEMENT_DISTANCE == 0) {
                        // Flash score and play sound.
                        this.acheivement = true;
                        this.flashTimer = 0;
                        playSound = true;
                    }

                    // Create a string representation of the distance with leading 0.
                    var distanceStr = (this.defaultString +
                        distance).substr(-this.maxScoreUnits);
                    this.digits = distanceStr.split('');
                } else {
                    this.digits = this.defaultString.split('');
                }
            } else {
                // Control flashing of the score on reaching acheivement.
                if (this.flashIterations <= this.config.FLASH_ITERATIONS) {
                    this.flashTimer += deltaTime;

                    if (this.flashTimer < this.config.FLASH_DURATION) {
                        paint = false;
                    } else if (this.flashTimer >
                        this.config.FLASH_DURATION * 2) {
                        this.flashTimer = 0;
                        this.flashIterations++;
                    }
                } else {
                    this.acheivement = false;
                    this.flashIterations = 0;
                    this.flashTimer = 0;
                }
            }

            // Draw the digits if not flashing.
            if (paint) {
                let digits_rep = '';
                for (var i = this.digits.length - 1; i >= 0; i--) {
                    this.draw(i, parseInt(this.digits[i]));
                    digits_rep = this.digits[i] + digits_rep;
                }
                // update the player/team/country scores only when the score changes
                // dev_com

                let digits_rep_int = parseInt(digits_rep);
                if (digits_rep_int !== latest_score && digits_rep_int > 0 && typeof ch_owner_score === 'undefined') {
                    add_score_unit(digits_rep, digits_rep_int - latest_score);
                    latest_score = digits_rep_int;
                }
            }

            this.drawHighScore();
            return playSound;
        },

        /**
         * Draw the high score.
         */
        drawHighScore: function () {
            this.canvasCtx.save();
            this.canvasCtx.globalAlpha = .8;
            for (var i = this.highScore.length - 1; i >= 0; i--) {
                this.draw(i, parseInt(this.highScore[i], 10), true);
            }
            this.canvasCtx.restore();
        },

        /**
         * Set the highscore as a array string.
         * Position of char in the sprite: H - 10, I - 11.
         * @param {number} distance Distance ran in pixels.
         */
        setHighScore: function (distance) {
            distance = this.getActualDistance(distance);
            var highScoreStr = (this.defaultString +
                distance).substr(-this.maxScoreUnits);

            this.highScore = ['10', '11', ''].concat(highScoreStr.split(''));
        },

        /**
         * Reset the distance meter back to '00000'.
         */
        reset: function () {
            this.update(0);
            this.acheivement = false;
        }
    };


    //******************************************************************************

    /**
     * Cloud background item.
     * Similar to an obstacle object but without collision boxes.
     * @param {HTMLCanvasElement} canvas Canvas element.
     * @param {Object} spritePos Position of image in sprite.
     * @param {number} containerWidth
     */
    function Cloud(canvas, spritePos, containerWidth) {
        this.canvas = canvas;
        this.canvasCtx = this.canvas.getContext('2d');
        this.spritePos = spritePos;
        this.containerWidth = containerWidth;
        this.xPos = containerWidth;
        this.yPos = 0;
        this.remove = false;
        this.cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP,
            Cloud.config.MAX_CLOUD_GAP);

        this.init();
    };


    /**
     * Cloud object config.
     * @enum {number}
     */
    Cloud.config = {
        HEIGHT: 14,
        MAX_CLOUD_GAP: 400,
        MAX_SKY_LEVEL: 30,
        MIN_CLOUD_GAP: 100,
        MIN_SKY_LEVEL: 71,
        WIDTH: 46
    };


    Cloud.prototype = {
        /**
         * Initialise the cloud. Sets the Cloud height.
         */
        init: function () {
            this.yPos = getRandomNum(Cloud.config.MAX_SKY_LEVEL,
                Cloud.config.MIN_SKY_LEVEL);
            this.draw();
        },

        /**
         * Draw the cloud.
         */
        draw: function () {
            this.canvasCtx.save();
            var sourceWidth = Cloud.config.WIDTH;
            var sourceHeight = Cloud.config.HEIGHT;

            if (IS_HIDPI) {
                sourceWidth = sourceWidth * 2;
                sourceHeight = sourceHeight * 2;
            }

            this.canvasCtx.drawImage(Runner.imageSprite, this.spritePos.x,
                this.spritePos.y,
                sourceWidth, sourceHeight,
                this.xPos, this.yPos,
                Cloud.config.WIDTH, Cloud.config.HEIGHT);

            this.canvasCtx.restore();
        },

        /**
         * Update the cloud position.
         * @param {number} speed
         */
        update: function (speed) {
            if (!this.remove) {
                this.xPos -= Math.ceil(speed);
                this.draw();

                // Mark as removeable if no longer in the canvas.
                if (!this.isVisible()) {
                    this.remove = true;
                }
            }
        },

        /**
         * Check if the cloud is visible on the stage.
         * @return {boolean}
         */
        isVisible: function () {
            return this.xPos + Cloud.config.WIDTH > 0;
        }
    };

    /**
     * Background item.
     * Similar to cloud, without random y position.
     * @param {HTMLCanvasElement} canvas Canvas element.
     * @param {Object} spritePos Position of image in sprite.
     * @param {number} containerWidth
     * @param {string} type Element type.
     * @constructor
     */
    function BackgroundEl(canvas, spritePos, containerWidth, type) {
        this.canvas = canvas;
        this.canvasCtx =
            /** @type {CanvasRenderingContext2D} */ (this.canvas.getContext('2d'));
        this.spritePos = spritePos;
        this.containerWidth = containerWidth;
        this.xPos = containerWidth;
        this.yPos = 0;
        this.remove = false;
        this.type = type;
        this.gap =
            getRandomNum(BackgroundEl.config.MIN_GAP, BackgroundEl.config.MAX_GAP);
        this.animTimer = 0;
        this.switchFrames = false;

        this.spriteConfig = {};
        this.init();
    }

    /**
     * Background element object config.
     * Real values assigned when game type changes.
     * @enum {number}
     */
    BackgroundEl.config = {
        MAX_BG_ELS: 0,
        MAX_GAP: 0,
        MIN_GAP: 0,
        POS: 0,
        SPEED: 0,
        Y_POS: 0,
        MS_PER_FRAME: 0  // only needed when BACKGROUND_EL.FIXED is true
    };


    BackgroundEl.prototype = {
        /**
         * Initialise the element setting the y position.
         */
        init() {
            this.spriteConfig = Runner.spriteDefinition.BACKGROUND_EL[this.type];
            if (this.spriteConfig.FIXED) {
                this.xPos = this.spriteConfig.FIXED_X_POS;
            }
            this.yPos = BackgroundEl.config.Y_POS - this.spriteConfig.HEIGHT +
                this.spriteConfig.OFFSET;
            this.draw();
        },

        /**
         * Draw the element.
         */
        draw() {
            this.canvasCtx.save();
            let sourceWidth = this.spriteConfig.WIDTH;
            let sourceHeight = this.spriteConfig.HEIGHT;
            let sourceX = this.spriteConfig.X_POS;
            const outputWidth = sourceWidth;
            const outputHeight = sourceHeight;

            if (IS_HIDPI) {
                sourceWidth *= 2;
                sourceHeight *= 2;
                sourceX *= 2;
            }

            this.canvasCtx.drawImage(
                Runner.imageSprite, sourceX, this.spritePos.y, sourceWidth,
                sourceHeight, this.xPos, this.yPos, outputWidth, outputHeight);

            this.canvasCtx.restore();
        },

        /**
         * Update the background element position.
         * @param {number} speed
         */
        update(speed) {
            if (!this.remove) {
                if (!this.spriteConfig.FIXED) {
                    // Fixed speed, regardless of actual game speed.
                    this.xPos -= BackgroundEl.config.SPEED;
                } else {
                    this.animTimer += speed;
                    if (this.animTimer > BackgroundEl.config.MS_PER_FRAME) {
                        this.animTimer = 0;
                        this.switchFrames = !this.switchFrames;
                    }

                    this.yPos = this.switchFrames ? this.spriteConfig.FIXED_Y_POS_1 :
                        this.spriteConfig.FIXED_Y_POS_2;
                }
                this.draw();

                // Mark as removable if no longer in the canvas.
                if (!this.isVisible()) {
                    this.remove = true;
                }
            }
        },

        /**
         * Check if the element is visible on the stage.
         * @return {boolean}
         */
        isVisible() {
            return this.xPos + this.spriteConfig.WIDTH > 0;
        }
    };


    //******************************************************************************

    /**
     * Nightmode shows a moon and stars on the horizon.
     */
    function NightMode(canvas, spritePos, containerWidth) {
        this.spritePos = spritePos;
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.xPos = containerWidth - 50;
        this.yPos = 30;
        this.currentPhase = 0;
        this.opacity = 0;
        this.containerWidth = containerWidth;
        this.stars = [];
        this.drawStars = false;
        this.placeStars();
    };

    /**
     * @enum {number}
     */
    NightMode.config = {
        FADE_SPEED: 0.035,
        HEIGHT: 40,
        MOON_SPEED: 0.25,
        NUM_STARS: 2,
        STAR_SIZE: 9,
        STAR_SPEED: 0.3,
        STAR_MAX_Y: 70,
        WIDTH: 20
    };

    NightMode.phases = [140, 120, 100, 60, 40, 20, 0];

    NightMode.prototype = {
        /**
         * Update moving moon, changing phases.
         * @param {boolean} activated Whether night mode is activated.
         * @param {number} delta
         */
        update: function (activated, delta) {
            // Moon phase.
            if (activated && this.opacity == 0) {
                this.currentPhase++;

                if (this.currentPhase >= NightMode.phases.length) {
                    this.currentPhase = 0;
                }
            }

            // Fade in / out.
            if (activated && (this.opacity < 1 || this.opacity == 0)) {
                this.opacity += NightMode.config.FADE_SPEED;
            } else if (this.opacity > 0) {
                this.opacity -= NightMode.config.FADE_SPEED;
            }

            // Set moon positioning.
            if (this.opacity > 0) {
                this.xPos = this.updateXPos(this.xPos, NightMode.config.MOON_SPEED);

                // Update stars.
                if (this.drawStars) {
                    for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
                        this.stars[i].x = this.updateXPos(this.stars[i].x,
                            NightMode.config.STAR_SPEED);
                    }
                }
                this.draw();
            } else {
                this.opacity = 0;
                this.placeStars();
            }
            this.drawStars = true;
        },

        updateXPos: function (currentPos, speed) {
            if (currentPos < -NightMode.config.WIDTH) {
                currentPos = this.containerWidth;
            } else {
                currentPos -= speed;
            }
            return currentPos;
        },

        draw: function () {
            var moonSourceWidth = this.currentPhase == 3 ? NightMode.config.WIDTH * 2 :
                NightMode.config.WIDTH;
            var moonSourceHeight = NightMode.config.HEIGHT;
            var moonSourceX = this.spritePos.x + NightMode.phases[this.currentPhase];
            var moonOutputWidth = moonSourceWidth;
            var starSize = NightMode.config.STAR_SIZE;
            var starSourceX = Runner.spriteDefinition.LDPI.STAR.x;

            if (IS_HIDPI) {
                moonSourceWidth *= 2;
                moonSourceHeight *= 2;
                moonSourceX = this.spritePos.x +
                    (NightMode.phases[this.currentPhase] * 2);
                starSize *= 2;
                starSourceX = Runner.spriteDefinition.HDPI.STAR.x;
            }

            this.canvasCtx.save();
            this.canvasCtx.globalAlpha = this.opacity;

            // Stars.
            if (this.drawStars) {
                for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
                    this.canvasCtx.drawImage(Runner.imageSprite,
                        starSourceX, this.stars[i].sourceY, starSize, starSize,
                        Math.round(this.stars[i].x), this.stars[i].y,
                        NightMode.config.STAR_SIZE, NightMode.config.STAR_SIZE);
                }
            }

            // Moon.
            this.canvasCtx.drawImage(Runner.imageSprite, moonSourceX,
                this.spritePos.y, moonSourceWidth, moonSourceHeight,
                Math.round(this.xPos), this.yPos,
                moonOutputWidth, NightMode.config.HEIGHT);

            this.canvasCtx.globalAlpha = 1;
            this.canvasCtx.restore();
        },

        // Do star placement.
        placeStars: function () {
            var segmentSize = Math.round(this.containerWidth /
                NightMode.config.NUM_STARS);

            for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
                this.stars[i] = {};
                this.stars[i].x = getRandomNum(segmentSize * i, segmentSize * (i + 1));
                this.stars[i].y = getRandomNum(0, NightMode.config.STAR_MAX_Y);

                if (IS_HIDPI) {
                    this.stars[i].sourceY = Runner.spriteDefinition.HDPI.STAR.y +
                        NightMode.config.STAR_SIZE * 2 * i;
                } else {
                    this.stars[i].sourceY = Runner.spriteDefinition.LDPI.STAR.y +
                        NightMode.config.STAR_SIZE * i;
                }
            }
        },

        reset: function () {
            this.currentPhase = 0;
            this.opacity = 0;
            this.update(false);
        }

    };


    //******************************************************************************

    /**
     * Horizon Line.
     * Consists of two connecting lines. Randomly assigns a flat / bumpy horizon.
     * @param {HTMLCanvasElement} canvas
     * @param {Object} spritePos Horizon position in sprite.
     * @constructor
     */
    function HorizonLine(canvas, spritePos) {
        this.spritePos = spritePos;
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
        this.sourceDimensions = {};
        this.dimensions = HorizonLine.dimensions;
        this.sourceXPos = [this.spritePos.x, this.spritePos.x +
        this.dimensions.WIDTH];
        this.xPos = [];
        this.yPos = 0;
        this.bumpThreshold = 0.5;
        this.altGameModeActive = false;

        this.setSourceDimensions();
        this.draw();
    };


    /**
     * Horizon line dimensions.
     * @enum {number}
     */
    HorizonLine.dimensions = {
        WIDTH: 800,
        HEIGHT: 12,
        YPOS: 147
    };


    HorizonLine.prototype = {
        /**
         * Set the source dimensions of the horizon line.
         */
        setSourceDimensions: function () {

            for (var dimension in HorizonLine.dimensions) {
                if (IS_HIDPI) {
                    if (dimension != 'YPOS') {
                        this.sourceDimensions[dimension] =
                            HorizonLine.dimensions[dimension] * 2;
                    }
                } else {
                    this.sourceDimensions[dimension] =
                        HorizonLine.dimensions[dimension];
                }
                this.dimensions[dimension] = HorizonLine.dimensions[dimension];
            }

            this.xPos = [0, HorizonLine.dimensions.WIDTH];
            this.yPos = HorizonLine.dimensions.YPOS;
        },

        /**
         * Return the crop x position of a type.
         */
        getRandomType: function () {
            return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0;
        },

        /**
         * Draw the horizon line.
         */
        draw: function () {
            this.canvasCtx.drawImage(Runner.imageSprite, this.sourceXPos[0],
                this.spritePos.y,
                this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT,
                this.xPos[0], this.yPos,
                this.dimensions.WIDTH, this.dimensions.HEIGHT);

            this.canvasCtx.drawImage(Runner.imageSprite, this.sourceXPos[1],
                this.spritePos.y,
                this.sourceDimensions.WIDTH, this.sourceDimensions.HEIGHT,
                this.xPos[1], this.yPos,
                this.dimensions.WIDTH, this.dimensions.HEIGHT);
        },

        /**
         * Update the x position of an indivdual piece of the line.
         * @param {number} pos Line position.
         * @param {number} increment
         */
        updateXPos: function (pos, increment) {
            var line1 = pos;
            var line2 = pos == 0 ? 1 : 0;

            this.xPos[line1] -= increment;
            this.xPos[line2] = this.xPos[line1] + this.dimensions.WIDTH;

            if (this.xPos[line1] <= -this.dimensions.WIDTH) {
                this.xPos[line1] += this.dimensions.WIDTH * 2;
                this.xPos[line2] = this.xPos[line1] - this.dimensions.WIDTH;
                this.sourceXPos[line1] = this.getRandomType() + this.spritePos.x;
            }
        },

        /**
         * Update the horizon line.
         * @param {number} deltaTime
         * @param {number} speed
         */
        update: function (deltaTime, speed) {
            var increment = Math.floor(speed * (FPS / 1000) * deltaTime);

            if (this.xPos[0] <= 0) {
                this.updateXPos(0, increment);
            } else {
                this.updateXPos(1, increment);
            }
            this.draw();
        },

        /**
         * Reset horizon to the starting position.
         */
        reset: function () {
            this.xPos[0] = 0;
            this.xPos[1] = HorizonLine.dimensions.WIDTH;
        }
    };


    //******************************************************************************

    /**
     * Horizon background class.
     * @param {HTMLCanvasElement} canvas
     * @param {Object} spritePos Sprite positioning.
     * @param {Object} dimensions Canvas dimensions.
     * @param {number} gapCoefficient
     * @constructor
     */
    function Horizon(canvas, spritePos, dimensions, gapCoefficient) {
        this.canvas = canvas;
        this.canvasCtx = this.canvas.getContext('2d');
        this.config = Horizon.config;
        this.dimensions = dimensions;
        this.gapCoefficient = gapCoefficient;
        this.obstacles = [];
        this.obstacleHistory = [];
        this.horizonOffsets = [0, 0];
        this.cloudFrequency = this.config.CLOUD_FREQUENCY;
        this.spritePos = spritePos;
        this.nightMode = null;

        // Cloud
        this.clouds = [];
        this.cloudSpeed = this.config.BG_CLOUD_SPEED;

        // Horizon
        this.horizonLine = null;
        this.init();
    };


    /**
     * Horizon config.
     * @enum {number}
     */
    Horizon.config = {
        BG_CLOUD_SPEED: 0.2,
        BUMPY_THRESHOLD: .3,
        CLOUD_FREQUENCY: .5,
        HORIZON_HEIGHT: 16,
        MAX_CLOUDS: 6
    };


    Horizon.prototype = {
        /**
         * Initialise the horizon. Just add the line and a cloud. No obstacles.
         */
        init: function () {
            Obstacle.types = Runner.spriteDefinitionByType.original.OBSTACLES;
            this.addCloud();
            this.horizonLine = new HorizonLine(this.canvas, this.spritePos.HORIZON);
            this.nightMode = new NightMode(this.canvas, this.spritePos.MOON,
                this.dimensions.WIDTH);
        },

        /**
         * @param {number} deltaTime
         * @param {number} currentSpeed
         * @param {boolean} updateObstacles Used as an override to prevent
         *     the obstacles from being updated / added. This happens in the
         *     ease in section.
         * @param {boolean} showNightMode Night mode activated.
         */
        update: function (deltaTime, currentSpeed, updateObstacles, showNightMode) {
            this.runningTime += deltaTime;
            if (this.altGameModeActive) {
                this.updateBackgroundEls(deltaTime, currentSpeed);
            }

            this.horizonLine.update(deltaTime, currentSpeed);
            this.nightMode.update(showNightMode);
            this.updateClouds(deltaTime, currentSpeed);

            if (!this.altGameModeActive || Runner.spriteDefinition.HAS_CLOUDS) {
                this.nightMode.update(showNightMode);
                this.updateClouds(deltaTime, currentSpeed);
            }

            if (updateObstacles) {
                this.updateObstacles(deltaTime, currentSpeed);
            }
        },

        /**
         * Update obstacle definitions based on the speed of the game.
         */
        adjustObstacleSpeed: function() {
            for (let i = 0; i < Obstacle.types.length; i++) {
                if (Runner.slowDown) {
                    Obstacle.types[i].multipleSpeed = Obstacle.types[i].multipleSpeed / 2;
                    Obstacle.types[i].minGap *= 1.5;
                    Obstacle.types[i].minSpeed = Obstacle.types[i].minSpeed / 2;

                    // Convert variable y position obstacles to fixed.
                    if (typeof (Obstacle.types[i].yPos) == 'object') {
                        Obstacle.types[i].yPos = Obstacle.types[i].yPos[0];
                        Obstacle.types[i].yPosMobile = Obstacle.types[i].yPos[0];
                    }
                }
            }
        },

        /**
         * Update sprites to correspond to change in sprite sheet.
         * @param {number} spritePos
         */
        enableAltGameMode: function(spritePos) {
            // Clear existing horizon objects.
            this.clouds = [];
            this.backgroundEls = [];

            this.altGameModeActive = true;
            this.spritePos = spritePos;

            Obstacle.types = Runner.spriteDefinition.OBSTACLES;
            this.adjustObstacleSpeed();

            Obstacle.MAX_GAP_COEFFICIENT = Runner.spriteDefinition.MAX_GAP_COEFFICIENT;
            Obstacle.MAX_OBSTACLE_LENGTH = Runner.spriteDefinition.MAX_OBSTACLE_LENGTH;

            BackgroundEl.config = Runner.spriteDefinition.BACKGROUND_EL_CONFIG;

            this.horizonLines = [];
            for (let i = 0; i < Runner.spriteDefinition.LINES.length; i++) {
                this.horizonLines.push(
                    new HorizonLine(this.canvas, Runner.spriteDefinition.LINES[i]));
            }
            this.reset();
        },

        /**
         * Update background element positions. Also handles creating new elements.
         * @param {number} elSpeed
         * @param {Array<Object>} bgElArray
         * @param {number} maxBgEl
         * @param {Function} bgElAddFunction
         * @param {number} frequency
         */
        updateBackgroundEl(elSpeed, bgElArray, maxBgEl, bgElAddFunction, frequency) {
            const numElements = bgElArray.length;

            if (numElements) {
                for (let i = numElements - 1; i >= 0; i--) {
                    bgElArray[i].update(elSpeed);
                }

                const lastEl = bgElArray[numElements - 1];

                // Check for adding a new element.
                if (numElements < maxBgEl &&
                    (this.dimensions.WIDTH - lastEl.xPos) > lastEl.gap &&
                    frequency > Math.random()) {
                    bgElAddFunction();
                }
            } else {
                bgElAddFunction();
            }
        },

        /**
         * Update the cloud positions.
         * @param {number} deltaTime
         * @param {number} currentSpeed
         */
        updateClouds: function (deltaTime, speed) {
            var cloudSpeed = this.cloudSpeed / 1000 * deltaTime * speed;
            var numClouds = this.clouds.length;

            if (numClouds) {
                for (var i = numClouds - 1; i >= 0; i--) {
                    this.clouds[i].update(cloudSpeed);
                }

                var lastCloud = this.clouds[numClouds - 1];

                // Check for adding a new cloud.
                if (numClouds < this.config.MAX_CLOUDS &&
                    (this.dimensions.WIDTH - lastCloud.xPos) > lastCloud.cloudGap &&
                    this.cloudFrequency > Math.random()) {
                    this.addCloud();
                }

                // Remove expired clouds.
                this.clouds = this.clouds.filter(function (obj) {
                    return !obj.remove;
                });
            } else {
                this.addCloud();
            }
        },

        /**
         * Update the background element positions.
         * @param {number} deltaTime
         * @param {number} speed
         */
        updateBackgroundEls(deltaTime, speed) {
            this.updateBackgroundEl(
                deltaTime, this.backgroundEls, BackgroundEl.config.MAX_BG_ELS,
                this.addBackgroundEl.bind(this), this.cloudFrequency);

            // Remove expired elements.
            this.backgroundEls = this.backgroundEls.filter((obj) => !obj.remove);
        },

        /**
         * Update the obstacle positions.
         * @param {number} deltaTime
         * @param {number} currentSpeed
         */
        updateObstacles: function (deltaTime, currentSpeed) {
            // Obstacles, move to Horizon layer.
            var updatedObstacles = this.obstacles.slice(0);

            for (var i = 0; i < this.obstacles.length; i++) {
                var obstacle = this.obstacles[i];
                obstacle.update(deltaTime, currentSpeed);

                // Clean up existing obstacles.
                if (obstacle.remove) {
                    updatedObstacles.shift();
                }
            }
            this.obstacles = updatedObstacles;

            if (this.obstacles.length > 0) {
                var lastObstacle = this.obstacles[this.obstacles.length - 1];

                if (lastObstacle && !lastObstacle.followingObstacleCreated &&
                    lastObstacle.isVisible() &&
                    (lastObstacle.xPos + lastObstacle.width + lastObstacle.gap) <
                    this.dimensions.WIDTH) {
                    this.addNewObstacle(currentSpeed);
                    lastObstacle.followingObstacleCreated = true;
                }
            } else {

                // Create new obstacles.
                this.addNewObstacle(currentSpeed);
            }
        },

        removeFirstObstacle: function () {
            this.obstacles.shift();
        },

        /**
         * Add a new obstacle.
         * @param {number} currentSpeed
         */
        addNewObstacle: function (currentSpeed) {
            const obstacleCount =
                Runner.isAltGameModeEnabled() && !this.altGameModeActive ||
                this.altGameModeActive ?
                    Obstacle.types.length - 1 :
                    Obstacle.types.length - 2;

            const obstacleTypeIndex =
                obstacleCount > 0 ? getRandomNum(0, obstacleCount) : 0;
            var obstacleType = Obstacle.types[obstacleTypeIndex];


            // Check for multiples of the same type of obstacle.
            // Also check obstacle is available at current speed.
            if (this.duplicateObstacleCheck(obstacleType.type) ||
                currentSpeed < obstacleType.minSpeed) {
                this.addNewObstacle(currentSpeed);
            } else {
                var obstacleSpritePos = this.spritePos[obstacleType.type];


                this.obstacles.push(new Obstacle(
                    this.canvasCtx, obstacleType, obstacleSpritePos, this.dimensions,
                    this.gapCoefficient, currentSpeed, obstacleType.width,
                    this.altGameModeActive));

                this.obstacleHistory.unshift(obstacleType.type);

                if (this.obstacleHistory.length > 1) {
                    this.obstacleHistory.splice(Runner.config.MAX_OBSTACLE_DUPLICATION);
                }
            }
        },

        /**
         * Returns whether the previous two obstacles are the same as the next one.
         * Maximum duplication is set in config value MAX_OBSTACLE_DUPLICATION.
         * @return {boolean}
         */
        duplicateObstacleCheck: function (nextObstacleType) {
            var duplicateCount = 0;

            for (var i = 0; i < this.obstacleHistory.length; i++) {
                duplicateCount = this.obstacleHistory[i] == nextObstacleType ?
                    duplicateCount + 1 : 0;
            }
            return duplicateCount >= Runner.config.MAX_OBSTACLE_DUPLICATION;
        },

        /**
         * Reset the horizon layer.
         * Remove existing obstacles and reposition the horizon line.
         */
        reset: function () {
            this.obstacles = [];
            this.horizonLine.reset();
            this.nightMode.reset();
        },

        /**
         * Update the canvas width and scaling.
         * @param {number} width Canvas width.
         * @param {number} height Canvas height.
         */
        resize: function (width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
        },

        /**
         * Add a new cloud to the horizon.
         */
        addCloud: function () {
            this.clouds.push(new Cloud(this.canvas, this.spritePos.CLOUD,
                this.dimensions.WIDTH));
        },

        /**
         * Add a random background element to the horizon.
         */
        addBackgroundEl() {
            const backgroundElTypes =
                Object.keys(Runner.spriteDefinition.BACKGROUND_EL);

            if (backgroundElTypes.length > 0) {
                let index = getRandomNum(0, backgroundElTypes.length - 1);
                let type = backgroundElTypes[index];

                // Add variation if available.
                while (type == this.lastEl && backgroundElTypes.length > 1) {
                    index = getRandomNum(0, backgroundElTypes.length - 1);
                    type = backgroundElTypes[index];
                }

                this.lastEl = type;
                // uncomment to enable background elements
                // this.backgroundEls.push(new BackgroundEl(
                //     this.canvas, this.spritePos.BACKGROUND_EL, this.dimensions.WIDTH,
                //     type));
            }
        }
    };
    new B948h498uureiuh459hf459h549fh4589hufh49hf94eh5('.interstitial-wrapper');
});


let bottom_link_clickable = document.getElementById('bottom_link_clickable');
let gameover_panel_tshirt = document.getElementById('gameover_panel_tshirt');
let gameover_panel_normal = document.getElementById('gameover_panel_normal');
let gameover_tshirt_back = document.getElementById('gameover_tshirt_back');
let seen_tshirt = localStorage.getItem('seen_tshirt') ?? 'false';

if (collected_tshirt) {
    bottom_link_clickable.classList.remove('hidden');
}

bottom_link_clickable.onclick = function(){
    gameover_panel_normal.classList.add('hidden');
    gameover_panel.classList.add('secret');
    gameover_panel_tshirt.classList.remove('hidden');
    if (seen_tshirt === 'false') {
        localStorage.setItem('seen_tshirt', 'true');
        seen_tshirt = 'true';
        if (typeof ga === 'function') {
            ga('send', 'event', 'interaction', 'see_tshirt', 'see_tshirt', 0);
        }
    }
}

gameover_tshirt_back.onclick = function(){
    gameover_panel_tshirt.classList.add('hidden');
    gameover_panel.classList.remove('secret');
    gameover_panel_normal.classList.remove('hidden');
}

document.body.addEventListener('click', function(e){
    switch(e.target.id){
        case 'gameover_tshirt_back':
            gameover_panel_tshirt.classList.add('hidden');
            gameover_panel.classList.remove('secret');
            gameover_panel_normal.classList.remove('hidden');
    }
});

if(seen_tshirt === 'true'){
    bottom_link_clickable.classList.add('seen');
}

// let xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function(){
//     if (this.status = 200 && this.readyState === 4) {
//         if (this.responseText && this.responseText.length > 0) {
//             lazy_data = JSON.parse(this.responseText);
//             gameover_panel_tshirt.innerHTML += lazy_data.tshirt.html;
//         } else {
//
//         }
//     }
// };
// xhr.open("GET", "/l/lazydata/", true);
// xhr.send();
