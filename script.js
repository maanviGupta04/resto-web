
const menu = document.querySelector('.menu');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            menu.classList.add('animate');
        }
    });
}, { threshold: 0.3 });

observer.observe(menu);

