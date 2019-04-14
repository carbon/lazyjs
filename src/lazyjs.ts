module Carbon {
  export class LazyLoader {
    lazyEls: HTMLImageElement[];
    fold: number;
    observer: IntersectionObserver;
  
    constructor(options: any = { }) {
  
      if ('IntersectionObserver' in window) {
  

        this.observer = new IntersectionObserver(entries => {
          for (var entry of entries) {

            if (entry.intersectionRatio > 0) { 
              this.load(entry.target);
            
              var index = this.lazyEls.indexOf(<HTMLImageElement>entry.target);

              // load the next one
              if (this.lazyEls.length > index + 2) {
                this.load(this.lazyEls[index + 1]);

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

    setup() {
      this.lazyEls = Array.from(<NodeListOf<HTMLImageElement>>document.querySelectorAll('img.lazy'));
    
      if (this.observer) {
        for (var el of this.lazyEls) {
          this.observer.observe(el);
        }
      }
      else {
        this.check();
      }
    }

    check() {
      if (!this.lazyEls) return;

      this.fold = window.innerHeight;

      for (var i = 0; i < this.lazyEls.length; i++) {
        var el = this.lazyEls[i];

        if (!el.classList.contains('lazy')) continue;

        let box = el.getBoundingClientRect();
 
        if (box.top <= this.fold + 500) {
          this.load(el);

          if ((i + 2) < this.lazyEls.length) {
            var nextEl = this.lazyEls[i + 1];

            this.load(<any>nextEl);
          }
        }
      }
    }

    load(el: HTMLImageElement) {      
      let { src, srcset } = el.dataset;
      
      if (!src) throw new Error('[Lazy] Missing data-src');
      
      let img: HTMLImageElement;
      
      // Chrome does not loop gif's correctly when an onload event
      // is attached on a HTMLImageElement

      if (src.indexOf('.gif') > -1) {         
        img = new Image(); 
      }
      else {
        img = el;
      }
      
      el.classList.add('loading');
      
      img.onload = () => { 
        el.classList.add('loaded');
      }
      
      img.src = src;
      
      if (el.dataset['srcset']) { 
        el.srcset = srcset;
      }
      
      el.src = src;

      el.classList.remove('lazy');
    }
  }
}
