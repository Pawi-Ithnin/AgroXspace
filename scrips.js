document.addEventListener('DOMContentLoaded', () => {
    console.log("Agro X SPACE Online.");
    
    // Animasi muncul (fade-in) untuk card
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transition = 'opacity 1s ease-out ' + (index * 0.2) + 's';
        setTimeout(() => card.style.opacity = '1', 100);
    });
});
