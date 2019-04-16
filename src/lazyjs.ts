module Carbon {
  export class LazyLoader {
    elements: NodeListOf<HTMLImageElement>;
    observer: IntersectionObserver;
  
    constructor(options: any = { }) {
      if (!('IntersectionObserver' in window)) {
        throw new Error('Missing IntersectionObserver API');
      }

      this.observer = new IntersectionObserver(entries => {
        for (var entry of entries) {

          if (entry.intersectionRatio > 0) { 
            this.load(<HTMLImageElement>entry.target);
          
            var index = this.indexOf(<HTMLImageElement>entry.target);

            // load ahead 1
            if (this.elements.length > index + 2) {
              this.load(this.elements[index + 1]);

            }              
          }
        }
      }, {
          threshold: 0.01,
          rootMargin: options.margin || '50px 0px'
      });     
    }

    indexOf(element: HTMLElement) {
      for (var i = 0; i < this.elements.length; i++) { 
        if (this.elements[i] === element) {
          return i;
        }
      }

      return -1;
    }

    setup() {
      this.elements = document.querySelectorAll('img.lazy');
    
      for (var i = 0; i < this.elements.length; i++) {
        this.observer.observe(this.elements[i]);
      }
    }

    load(el: HTMLImageElement) {      
      let { src, srcset } = el.dataset;
      
      if (!src) {
        throw new Error('[Lazy] Missing data-src');
      }

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
      
      if (srcset) { 
        el.srcset = srcset;
      }
      
      el.src = src;

      el.classList.remove('lazy');
    }
  }
}
