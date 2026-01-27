// =================================================================
// GOURMET PRÁTICO | JS V9.2 - MOTOR AGÊNTICO
// =================================================================

let chefboxCart = [];
const MAX_SLOTS = 5;

function addToGame(name, price, imageSrc, sku) {
    if (chefboxCart.length >= MAX_SLOTS) {
        alert("ChefBox completa!");
        return;
    }
    chefboxCart.push({ name, price, image: imageSrc, sku });
    renderRuler();
}

function renderRuler() {
    const slots = document.querySelectorAll('.slot-circle');
    const btnFinish = document.getElementById('btn-finish-game');
    
    chefboxCart.forEach((item, index) => {
        if (slots[index]) {
            slots[index].classList.add('filled');
            slots[index].style.backgroundImage = `url('${item.image}')`;
            slots[index].innerHTML = '';
        }
    });

    if (chefboxCart.length === 5 && btnFinish) {
        btnFinish.style.display = 'block';
    }
}

function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const orderID = 'GP-' + Math.floor(Math.random() * 9000);
    
    let msg = `*PEDIDO ${orderID}*\nCliente: ${name}\nItens:\n`;
    chefboxCart.forEach((item, i) => {
        msg += `${i+1}. ${item.name}\n`;
    });
    msg += `\n*TOTAL: R$ 132,00*`;

    window.open(`https://wa.me/5561996659880?text=${encodeURIComponent(msg)}`, '_blank');
}
