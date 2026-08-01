document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('scene');
    const bookEl = document.getElementById('book');
    
    // Initialize Book
    const book = new Book(bookEl);
    
    // Automatically open the book to the portfolio spread
    setTimeout(() => {
        book.openBook();
    }, 100);
    
    // UI Controls
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    btnPrev.addEventListener('click', () => {
        book.prevPage();
    });
    
    btnNext.addEventListener('click', () => {
        book.nextPage();
    });
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            book.prevPage();
        } else if (e.key === 'ArrowRight') {
            book.nextPage();
        }
    });
    
    // Table of Contents Links
    const tocLinks = document.querySelectorAll('.toc a');
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageStr = link.getAttribute('data-goto');
            if (targetPageStr) {
                // Parse page number (1-indexed based on content)
                // We need to convert it to sheet index
                // Page 1 is on Sheet 0 right side.
                // Page 2 is on Sheet 0 left side (back).
                // Page 3 is on Sheet 1 right side.
                // So sheetIndex = floor((pageNum - 1) / 2)
                // But in our HTML, data-page is the physical page div index (which corresponds directly to the sheet index + 1).
                // Wait, HTML: <div class="page" data-page="1">...</div>
                // So sheet index is data-page - 1.
                const pageNum = parseInt(targetPageStr, 10);
                const sheetIndex = pageNum - 1; // Since data-page starts at 1
                book.turnToSheet(sheetIndex);
            }
        });
    });
    
});
