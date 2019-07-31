module Carbon {
  export class LazyLoader {
    elements: HTMLElement[];
    observer: IntersectionObserver;
  
    constructor(options: any = { }) {
      if (!('IntersectionObserver' in window)) {
        throw new Error('Missing IntersectionObserver API');
      }

      this.observer = new IntersectionObserver(entries => {
        for (var entry of entries) {

          if (entry.intersectionRatio > 0) { 
            this.load(entry.target);
          
            var index = this.indexOf(entry.target);

            // load ahead 2
            if (this.elements.length > index + 2) {
              this.load(this.elements[index + 1]);
            }

            if (this.elements.length > index + 3) {
              this.load(this.elements[index + 2]);
            }           
          }
        }
      }, {
          threshold: 0.01,
          rootMargin: options.margin || '200px 0px'
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
      this.elements = Array.from(document.querySelectorAll('img.lazy, video.lazy'));
    
      for (var i = 0; i < this.elements.length; i++) {
        this.observer.observe(this.elements[i]);
      }
    }

    load(el: HTMLVideoElement | HTMLImageElement) {      
      let { src, srcset } = el.dataset;
      
      if (!src) {
        throw new Error('[Lazy] Missing data-src');
      }

      if (!el.classList.contains('lazy')) {
        return;
      }


      if (el.tagName == 'IMG') {
        let img: HTMLImageElement;

        // Chrome does not loop gif's correctly when an onload event
        // is attached on a HTMLImageElement

        if (src.indexOf('.gif') > -1) {         
          img = new Image(); 
        }
        else {
          img = <HTMLImageElement>el;
        }
        
        el.classList.add('loading');
        
        img.onload = () => { 
          el.classList.remove('loading');
          el.classList.add('loaded');
        }

        img.src = src;
      }
      
      if (srcset && el.tagName == 'IMG') { 
        (<HTMLImageElement>el).srcset = srcset;
      }
      
      el.src = src;

      if (el.tagName == 'video' && el.hasAttribute('autoplay')) {
        (<HTMLVideoElement>el).play();

        // TODO: Pause once out of viewport
      }

      el.classList.remove('lazy');
    }
  }
}
