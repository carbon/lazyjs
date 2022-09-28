module Carbon {
  export class LazyLoader {
    elements: HTMLElement[];
    observer: IntersectionObserver;
  
    constructor(options: any = { }) {
      this.observer = new IntersectionObserver(this.callback.bind(this), {
          threshold: 0.01,
          rootMargin: options.margin || '200px 0px'
      });     
    }

    callback(entries: IntersectionObserverEntry[]) {
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

    add(el: HTMLVideoElement | HTMLImageElement) {
      this.elements.push(el);
      this.observer.observe(el);
    }

    remove(el: HTMLElement) {
      this.observer.unobserve(el);
    }

    load(el: HTMLVideoElement | HTMLImageElement) {
      if (!el.classList.contains('lazy')) {
        return;
      }

      let { src, srcset } = el.dataset;
      
      if (!src && !srcset) {
        throw new Error('[Lazy] Missing data-src or data-srcset');
      }

      if (el.tagName == 'IMG') {
        let img: HTMLImageElement;

        // Chrome does not loop gif's correctly when an onload event
        // is attached on a HTMLImageElement

        if (src && src.indexOf('.gif') > -1) {
          el.src = src;
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
          (<HTMLVideoElement>el).play();
        }

        // TODO: Pause once out of viewport
      }

      el.classList.remove('lazy');
    }
  }
}
