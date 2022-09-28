var Carbon;
(function (Carbon) {
    var LazyLoader = (function () {
        function LazyLoader(options) {
            if (options === void 0) { options = {}; }
            this.observer = new IntersectionObserver(this.callback.bind(this), {
                threshold: 0.01,
                rootMargin: options.margin || '200px 0px'
            });
        }
        LazyLoader.prototype.callback = function (entries) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                if (entry.intersectionRatio > 0) {
                    this.load(entry.target);
                    var index = this.indexOf(entry.target);
                    if (this.elements.length > index + 2) {
                        this.load(this.elements[index + 1]);
                    }
                    if (this.elements.length > index + 3) {
                        this.load(this.elements[index + 2]);
                    }
                }
            }
        };
        LazyLoader.prototype.indexOf = function (element) {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i] === element) {
                    return i;
                }
            }
            return -1;
        };
        LazyLoader.prototype.setup = function () {
            this.elements = Array.from(document.querySelectorAll('img.lazy, video.lazy'));
            for (var i = 0; i < this.elements.length; i++) {
                this.observer.observe(this.elements[i]);
            }
        };
        LazyLoader.prototype.add = function (el) {
            this.elements.push(el);
            this.observer.observe(el);
        };
        LazyLoader.prototype.remove = function (el) {
            this.observer.unobserve(el);
        };
        LazyLoader.prototype.load = function (el) {
            if (!el.classList.contains('lazy')) {
                return;
            }
            var _a = el.dataset, src = _a.src, srcset = _a.srcset;
            if (!src && !srcset) {
                throw new Error('[Lazy] Missing data-src or data-srcset');
            }
            if (el.tagName == 'IMG') {
                var img = void 0;
                if (src && src.indexOf('.gif') > -1) {
                    el.src = src;
                    img = new Image();
                }
                else {
                    img = el;
                }
                el.classList.add('loading');
                img.onload = function () {
                    el.classList.remove('loading');
                    el.classList.add('loaded');
                };
                if (src) {
                    img.src = src;
                }
                if (srcset) {
                    img.srcset = srcset;
                }
            }
            if (el.tagName == 'VIDEO') {
                el.src = src;
                if (el.hasAttribute('autoplay')) {
                    el.play();
                }
            }
            el.classList.remove('lazy');
        };
        return LazyLoader;
    }());
    Carbon.LazyLoader = LazyLoader;
})(Carbon || (Carbon = {}));
