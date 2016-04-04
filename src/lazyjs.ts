module Carbon {
  export class LazyLoader {
    lazyEls: NodeListOf<HTMLImageElement>;
    fold: number;
    
    constructor() {
      window.addEventListener('scroll', this.check.bind(this), false);
    }

    setup() {
      this.lazyEls = <NodeListOf<HTMLImageElement>>document.querySelectorAll('.lazy');
      
      this.check();
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
      if (el instanceof HTMLImageElement) {
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
        
        img.onload = () => { 
          el.classList.add('loaded');
        }
        
        img.src = src;
        
        if (el.dataset['srcset']) { 
          el.srcset = srcset;
        }
        
        el.src = src;
      }
      else {
        console.log('unexpected element type', el);
      }
      
      el.classList.remove('lazy');
    }
  }
}
