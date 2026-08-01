class Book {
    constructor(element) {
        this.bookElement = element;
        this.pages = Array.from(element.querySelectorAll('.page'));
        this.frontCover = element.querySelector('#front-cover');
        this.pagesContainer = element.querySelector('#pages-container');
        
        this.isOpen = false;
        this.currentSheet = 0; // 0 means closed. 1 means first sheet is turned.
        
        // Physics Springs
        this.coverSpring = new Spring(0, 100, 15);
        this.pageSprings = this.pages.map(() => new Spring(0, 120, 14));
        
        this.lastTime = performance.now();
        
        this.init();
    }
    
    init() {
        // Set initial Z-indices
        this.updateZIndices();
        
        // Bind events
        this.bindEvents();
        
        // Start animation loop
        requestAnimationFrame(this.render.bind(this));
    }
    
    bindEvents() {
        // Click on cover to open
        this.frontCover.addEventListener('click', () => {
            if (!this.isOpen) {
                this.openBook();
            } else {
                this.closeBook();
            }
        });
        
        // Click on pages to turn
        this.pages.forEach((page, index) => {
            page.addEventListener('click', (e) => {
                // Determine if clicked on the right or left side
                const rect = page.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                
                // If page is on the right (rotation >= -90)
                const rot = this.pageSprings[index].value;
                if (rot > -90) {
                    // Turn left
                    this.turnToSheet(index + 1);
                } else {
                    // Turn right
                    this.turnToSheet(index);
                }
            });
        });
    }
    
    openBook() {
        this.isOpen = true;
        this.bookElement.classList.add('is-open');
        this.coverSpring.setTarget(-170); // Don't open to completely flat, leaves some depth
    }
    
    closeBook() {
        this.isOpen = false;
        this.bookElement.classList.remove('is-open');
        this.coverSpring.setTarget(0);
        // Turn all pages back
        this.turnToSheet(0);
    }
    
    turnToSheet(sheetIndex) {
        if (!this.isOpen) return;
        
        // Clamp index
        this.currentSheet = Math.max(0, Math.min(sheetIndex, this.pages.length));
        
        // Update targets
        this.pages.forEach((page, index) => {
            if (index < this.currentSheet) {
                // Page should be on the left
                this.pageSprings[index].setTarget(-178); // Slight angle for depth
            } else {
                // Page should be on the right
                this.pageSprings[index].setTarget(0);
            }
        });
    }
    
    nextPage() {
        if (!this.isOpen) {
            this.openBook();
        } else if (this.currentSheet < this.pages.length) {
            this.turnToSheet(this.currentSheet + 1);
        }
    }
    
    prevPage() {
        if (this.currentSheet > 0) {
            this.turnToSheet(this.currentSheet - 1);
        } else if (this.isOpen) {
            this.closeBook();
        }
    }
    
    updateZIndices() {
        const total = this.pages.length;
        
        // Cover z-index
        if (this.coverSpring.value > -90) {
            this.frontCover.style.zIndex = 1000;
        } else {
            this.frontCover.style.zIndex = 0;
        }
        
        // Pages z-index
        this.pages.forEach((page, index) => {
            const rot = this.pageSprings[index].value;
            if (rot > -90) {
                // Right side: stack goes downwards
                page.style.zIndex = total - index + 10;
            } else {
                // Left side: stack goes upwards
                page.style.zIndex = index + 10;
            }
            
            // Dynamic shadow for bending effect
            // Max shadow at -90 degrees
            const progress = Math.abs(rot + 90) / 90; // 0 at -90, 1 at 0 and -180
            const shadowOpacity = 1 - progress;
            
            const frontFace = page.querySelector('.page-face.front');
            const backFace = page.querySelector('.page-face.back');
            
            // Apply slight bend transform during the turn to simulate paper curl
            // We use scaleX and a translation to curve the page
            if (rot < 0 && rot > -180) {
                const bend = Math.sin((rot / -180) * Math.PI) * 15; // Max bend at 90deg
                page.style.transform = `rotateY(${rot}deg) translateZ(${bend}px) scaleX(${1 - bend/400})`;
            } else {
                page.style.transform = `rotateY(${rot}deg)`;
            }
            
            // Update shadow opacities
            if (frontFace && frontFace.querySelector('.page-shadow')) {
                frontFace.querySelector('.page-shadow').style.opacity = shadowOpacity * 0.5;
            }
            if (backFace && backFace.querySelector('.page-shadow')) {
                backFace.querySelector('.page-shadow').style.opacity = shadowOpacity * 0.5;
            }
        });
    }
    
    render(time) {
        const dt = time - this.lastTime;
        this.lastTime = time;
        
        // Update physics
        this.coverSpring.update(dt);
        this.frontCover.style.setProperty('--rot-y', `${this.coverSpring.value}deg`);
        
        this.pageSprings.forEach(spring => spring.update(dt));
        
        this.updateZIndices();
        
        requestAnimationFrame(this.render.bind(this));
    }
}
