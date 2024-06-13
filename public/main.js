// ---------- Menu ---------- //
let menu_buttons = [document.getElementById('home'),
                    document.getElementById('info'),
                    document.getElementById('comu'),
                    document.getElementById('cont'),];

menu_buttons[0].addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('logo').scrollIntoView({behavior: 'smooth'});
});
menu_buttons[1].addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('intro').scrollIntoView({behavior: 'smooth'});
});
menu_buttons[2].addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('communities').scrollIntoView({behavior: 'smooth'});
});
menu_buttons[3].addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
});

// ---------- Introduction ---------- //

document.addEventListener('DOMContentLoaded', function() {
    let cards = document.getElementById('cards');
    let intro = document.getElementById('intro');
    
    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cards.classList.add('slide_right');
                observer.unobserve(intro);
            } else {
            }
        });
    }, {threshold: 0.5});
    observer.observe(intro);
});

// ---------- Communities ---------- //
