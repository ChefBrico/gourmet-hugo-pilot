/* 
   APP.JS - GOURMET PRÁTICO (HUGO V2026)
   Função: Gerenciar o carrinho "ChefBox" (4+1) e Checkout WhatsApp
*/

// --- 1. ESTADO DO JOGO ---
let cart = JSON.parse(localStorage.getItem('chefbox_cart')) || [];
const MAX_ITEMS = 5;
const FIXED_PRICE = 132.00;
const WHATSAPP_NUMBER = "5561996659880"; // Número da Maria

// --- 2. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});

// --- 3. LÓGICA DO JOGO ---
function addToGame(title, price, image, sku) {
    if (cart.length >= MAX_ITEMS) {
        alert("🎉 Sua ChefBox está cheia! Clique em 'Finalizar Pedido' para garantir seu presente.");
        openCheckoutModal();
        return;
    }

    const item = { title, price, image, sku, id: Date.now() };
    cart.push(item);
    saveCart();
    updateUI();
    
    // Feedback visual simples
    alert(`😋 ${title} adicionado! Falta(m) ${MAX_ITEMS - cart.length} para fechar o box.`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateUI();
}

function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(cart));
}

// --- 4. ATUALIZAÇÃO VISUAL (UI) ---
function updateUI() {
    const bar = document.getElementById('chefbox-bar');
    const statusText = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish-game');
    
    if (!bar) return; // Se não estiver na página certa, sai.

    // Atualiza as bolinhas (Slots)
    for (let i = 1; i <= MAX_ITEMS; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (slot) {
            if (i <= cart.length) {
                slot.style.background = '#25D366'; // Verde (Preenchido)
                slot.style.color = 'white';
                slot.innerText = '✓';
            } else {
                slot.style.background = '#eee'; // Cinza (Vazio)
                slot.style.color = '#999';
                slot.innerText = i === 5 ? '🎁' : i;
            }
        }
    }

    // Lógica de Mensagem e Botão
    if (cart.length === 0) {
        statusText.innerText = "Monte sua ChefBox (Escolha 5):";
        btnFinish.style.display = 'none';
    } else if (cart.length < MAX_ITEMS) {
        statusText.innerText = `Faltam ${MAX_ITEMS - cart.length} sabores para o presente!`;
        btnFinish.style.display = 'none';
    } else {
        statusText.innerText = "🎉 PARABÉNS! Box Completa!";
        btnFinish.style.display = 'block'; // Mostra o botão de finalizar
        // Efeito visual na barra
        bar.style.background = "linear-gradient(to right, #fff, #e8f5e9)";
    }
}

// --- 5. CHECKOUT WHATSAPP (A2P) ---
function sendOrderToWhatsApp() {
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const cep = document.getElementById('customer-cep').value;
    
    if (!name || !address) {
        alert("Por favor, preencha seu nome e endereço.");
        return;
    }

    // Constrói a lista de pedidos
    let itemsList = "";
    cart.forEach((item, index) => {
        const label = index === 4 ? "(🎁 PRESENTE)" : "";
        itemsList += `✅ ${item.title} ${label}\n`;
    });

    // Mensagem Formatada
    const message = `
*NOVO PEDIDO CHEFBOX (4+1)* 🎁
---------------------------
👤 *Cliente:* ${name}
📍 *Local:* ${address} (CEP: ${cep})
---------------------------
*SABORES ESCOLHIDOS:*
${itemsList}
---------------------------
💰 *Total:* R$ ${FIXED_PRICE.toFixed(2)} (Frete Grátis)
💳 *Pagamento:* PIX
---------------------------
_Aguardo confirmação!_
    `.trim();

    // Deep Link
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Limpa carrinho e redireciona
    localStorage.removeItem('chefbox_cart');
    window.location.href = url;
}
