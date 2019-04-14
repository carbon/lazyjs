var Carbon;
(function (Carbon) {
    var LazyLoader = (function () {
        function LazyLoader(options) {
            if (options === void 0) { options = {}; }
            var _this = this;
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver(function (entries) {
                    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        var entry = entries_1[_i];
                        if (entry.intersectionRatio > 0) {
                            _this.load(entry.target);
                            var index = _this.lazyEls.indexOf(entry.target);
                            if (_this.lazyEls.length > index + 2) {
                                _this.load(_this.lazyEls[index + 1]);
                            }
                        }
                    }
                }, {
                    threshold: 0.1,
                    rootMargin: options.margin || '50px 0px'
                });
            }
            else {
                window.addEventListener('scroll', this.check.bind(this), {
                    capture: false,
                    passive: true
                });
            }
        }
        LazyLoader.prototype.setup = function () {
            this.lazyEls = Array.from(document.querySelectorAll('img.lazy'));
            if (this.observer) {
                for (var _i = 0, _a = this.lazyEls; _i < _a.length; _i++) {
                    var el = _a[_i];
                    this.observer.observe(el);
                }
            }
            else {
                this.check();
            }
        };
        LazyLoader.prototype.check = function () {
            if (!this.lazyEls)
                return;
            this.fold = window.innerHeight;
            for (var i = 0; i < this.lazyEls.length; i++) {
                var el = this.lazyEls[i];
                if (!el.classList.contains('lazy'))
                    continue;
                var box = el.getBoundingClientRect();
                if (box.top <= this.fold + 500) {
                    this.load(el);
                    if ((i + 2) < this.lazyEls.length) {
                        var nextEl = this.lazyEls[i + 1];
                        this.load(nextEl);
                    }
                }
            }
        };
        LazyLoader.prototype.load = function (el) {
            var _a = el.dataset, src = _a.src, srcset = _a.srcset;
            if (!src)
                throw new Error('[Lazy] Missing data-src');
            var img;
            if (src.indexOf('.gif') > -1) {
                img = new Image();
            }
            else {
                img = el;
            }
            el.classList.add('loading');
            img.onload = function () {
                el.classList.add('loaded');
            };
            img.src = src;
            if (el.dataset['srcset']) {
                el.srcset = srcset;
            }
            el.src = src;
            el.classList.remove('lazy');
        };
        return LazyLoader;
    }());
    Carbon.LazyLoader = LazyLoader;
})(Carbon || (Carbon = {}));
