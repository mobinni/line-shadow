'use strict';
angular.module('yourApp')
    .directive('lineShadow', ['$window', function ($window) {
        return {
            restrict: 'A',
            scope: {
                radius: '@',
                spread: '@',
                opacity: '@',
                color: '@',
                condition: '=?'
            },
            link: function postLink(scope, element, attrs) {
                var previousWidth = 0;

                function createShade() {
                    // remove shades
                    removeShade();
                    // get element width
                    var width = element.width();
                    // get radius that each line should be turned towards
                    var radius = scope.radius;
                    // get opacity
                    var opacity = scope.opacity;
                    // get the spread or distance between the lines
                    var spread = parseInt(scope.spread);
                    // define y coordinate
                    var y = 0;
                    // define x coordinate
                    var x = 0;
                    // set a counter
                    var counter = 0;
                    // set color
                    var color = scope.color;

                    // create a wrapper for spans
                    var SPANS = document.createElement("SPAN");
                    $(SPANS).addClass("wrapper-shade-" + element.context.$$hashKey.replace(':', '-'));

                    // only draw if width
                    if (spread > 2) {
                        while (x < width / (spread - 2)) {
                            x += spread;
                            y += spread;
                            counter++;
                            // magic happens here
                            var lineLength = spread * spread;
                            // create a span element
                            var SPAN = document.createElement("SPAN");
                            SPAN.style.borderBottom = "2px solid " + color;
                            SPAN.style.position = "absolute";
                            SPAN.style.display = "inline-block";
                            // make lin extra long (+ 5)
                            SPAN.style.width = (lineLength * counter) + 5 + "px";
                            SPAN.style.transform = "rotate(" + radius + "deg)"
                            SPAN.style.top = x + "px";
                            SPAN.style.left = -spread + "px";
                            SPAN.style.opacity = opacity;
                            $(SPANS).append(SPAN);
                            element.append(SPANS);
                            if (x === width) break;
                        }
                    }
                }

                function removeShade() {
                    if (element.context.$$hashKey) {
                        var shades = $('.wrapper-shade-' + element.context.$$hashKey.replace(':', '-'));
                        if (shades) {
                            shades.remove();
                        }
                    }
                }

                // register listener
                scope.$watch('condition', function (newVal, oldVal) {
                    if (!newVal)  removeShade();
                    else {
                        createShade();
                    }
                });

                // bind a window listener to dynamically recalculate
                angular.element($window).bind('resize', function () {
                    var width = element.width();
                    // set a width offset so you don't have to keep recalculating
                    var widthOffset = 20;
                    if (scope.condition) {
                        if (width > (previousWidth + widthOffset)) {
                            createShade();
                        }
                        previousWidth = width;
                    }
                });

                // initial check
                if (scope.condition) createShade();

            }
        };
    }]);
