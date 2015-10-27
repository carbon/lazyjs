var Carbon;
(function (Carbon) {
    var LazyLoader = (function () {
        function LazyLoader() {
            window.addEventListener('scroll', this.check.bind(this));
        }
        LazyLoader.prototype.setup = function () {
            this.lazyEls = document.querySelectorAll('.lazy');
            this.check();
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
            var src = el.getAttribute('data-src');
            var srcset = el.getAttribute('data-srcset');
            if (!src) {
                throw new Error('[Carbon.LazyLoader] No source found for element');
            }
            var img = new Image();
            img.onload = function () {
                if (el.tagName == 'DIV') {
                    el.style.backgroundImage = "url('" + src + "')";
                    el.classList.add('loaded');
                }
                else if (el.tagName == 'IMG') {
                    el.src = src;
                    if (srcset)
                        el.srcset = srcset;
                }
            };
            img.src = src;
            el.classList.remove('lazy');
        };
        return LazyLoader;
    })();
    Carbon.LazyLoader = LazyLoader;
})(Carbon || (Carbon = {}));
