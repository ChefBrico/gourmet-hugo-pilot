/* APP.JS - GOURMET PRÁTICO (CÉREBRO v2026.2)
   Função: Gerenciar Gamificação (4+1), Persistência Local e Checkout CRM
*/

// --- 1. CONFIGURAÇÃO E ESTADO ---
let cart = JSON.parse(localStorage.getItem('chefbox_cart')) || [];
const MAX_ITEMS = 5;
const FIXED_PRICE = 132.00; // Garanta que este preço bate com o hugo.toml
// Dica: O número aqui é fallback. O ideal é o link vir do HTML, mas deixaremos aqui por segurança.
const WHATSAPP_NUMBER = "5561996659880"; 

// --- 2. INICIALIZAÇÃO (Ao carregar a página) ---
document.addEventListener('DOMContentLoaded', () => {
    updateUI(); // Restaura o estado visual se tiver itens salvos
});

// --- 3. LÓGICA DO JOGO (Gamificação) ---
function addToGame(title, price, image, sku) {
    
    // Trava de Segurança: Box Cheia
    if (cart.length >= MAX_ITEMS) {
        // Vibração longa para indicar erro/limite
        if (navigator.vibrate) navigator.vibrate([200]); 
        alert("🎉 Sua ChefBox está cheia! Clique na barra abaixo para finalizar.");
        openCheckoutModal();
        return;
    }

    // Adiciona ao Carrinho
    const item = { title, price, image, sku, id: Date.now() };
    cart.push(item);
    saveCart();
    
    // Feedback Tátil (Vibração curta - Sensação de 'Toque')
    if (navigator.vibrate) navigator.vibrate(50);
    
    // Atualiza a Barra imediatamente
    updateUI();

    // Se completou a box agora, avisa e abre modal
    if (cart.length === MAX_ITEMS) {
        setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Vibração de Sucesso
            openCheckoutModal();
        }, 600);
    }
}

// Remove item (caso queira implementar botões de remover no futuro)
function removeFromCart() {
    cart.pop(); // Remove o último
    saveCart();
    updateUI();
}

// Salva no navegador do cliente (Persistência)
function saveCart() {
    localStorage.setItem('chefbox_cart', JSON.stringify(cart));
}

// --- 4. ATUALIZAÇÃO VISUAL (A Mágica da Barra Sticky) ---
function updateUI() {
    const bar = document.getElementById('chefbox-bar');
    const statusText = document.getElementById('game-status-text');
    const btnFinish = document.getElementById('btn-finish-game');
    
    if (!bar) return; // Proteção contra páginas sem barra

    // Atualiza as Bolinhas (Slots 1 a 5)
    for (let i = 1; i <= MAX_ITEMS; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (slot) {
            if (i <= cart.length) {
                // Item Preenchido
                slot.style.background = '#25D366'; // Verde WhatsApp
                slot.style.color = 'white';
                slot.style.borderColor = '#25D366';
                slot.innerText = '✓';
            } else {
                // Item Vazio
                slot.style.background = i === 5 ? '#fff3e0' : '#eee'; 
                slot.style.color = i === 5 ? '#F2811D' : '#999';
                slot.style.borderColor = i === 5 ? '#F2811D' : '#fff';
                slot.innerText = i === 5 ? '🎁' : i;
            }
        }
    }

    // Texto de Status e Botão Finalizar
    if (cart.length === 0) {
        statusText.innerHTML = "Monte sua ChefBox <strong>(Escolha 5)</strong>:";
        btnFinish.style.display = 'none';
    } else if (cart.length < MAX_ITEMS) {
        const missing = MAX_ITEMS - cart.length;
        statusText.innerHTML = `Faltam <strong>${missing}</strong> para ganhar o presente!`;
        btnFinish.style.display = 'none';
    } else {
        statusText.innerHTML = "🎉 <strong>PARABÉNS!</strong> Box Completa!";
        btnFinish.style.display = 'block'; // Mostra botão pulsante
    }
}

// --- 5. CONTROLE DO MODAL (Abre/Fecha) ---
function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'flex';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.style.display = 'none';
}

// --- 6. CHECKOUT WHATSAPP (A2P + CRM) ---
function sendOrderToWhatsApp() {
    // Coleta TUDO do formulário (CRM Rico)
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value; // Novo
    const phone = document.getElementById('customer-phone').value; // Novo
    const cep = document.getElementById('customer-cep').value;
    const address = document.getElementById('customer-address').value;
    
    // Validação Básica
    if (!name || !address || !phone) {
        alert("Por favor, preencha pelo menos Nome, WhatsApp e Endereço.");
        return;
    }

    // Constrói a lista de pedidos (Com Emojis de Status)
    let itemsList = "";
    cart.forEach((item, index) => {
        // O item de índice 4 é o 5º item (Array começa em 0) -> PRESENTE
        const label = index === 4 ? " (🎁 PRESENTE GRÁTIS)" : ` (R$ ${item.price})`;
        itemsList += `✅ ${item.title}${label}\n`;
    });

    // Mensagem Formatada para o Atendente/Robô ler fácil
    // Usamos encodeURIComponent para garantir que acentos e espaços funcionem no link
    const message = `
*NOVO PEDIDO: CHEFBOX VIP (4+1)* 🛵
---------------------------
👤 *Cliente:* ${name}
📱 *Zap:* ${phone}
📧 *Email:* ${email}
---------------------------
📍 *ENTREGA:*
${address}
CEP: ${cep}
---------------------------
*🥘 SABORES ESCOLHIDOS:*
${itemsList}
---------------------------
💰 *VALOR TOTAL: R$ ${FIXED_PRICE.toFixed(2)}*
🚚 *Frete:* GRÁTIS (DF)
💳 *Pagamento:* PIX / Cartão na Entrega
---------------------------
_Aguardo link de pagamento!_
    `.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Finalização: Limpa carrinho e abre Zap
    localStorage.removeItem('chefbox_cart');
    cart = []; // Zera memória RAM também
    updateUI(); // Reseta barra visual
    closeCheckoutModal(); // Fecha modal
    
    // Abre em nova aba para não perder o site de vista
    window.open(url, '_blank');
}
