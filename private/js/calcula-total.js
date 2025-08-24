const precoUnitario = 499.00;
const desconto = 0.10; 

document.addEventListener('DOMContentLoaded', function () {
    const inputQuantidade = document.getElementById('quantity');
    const spanTotal = document.getElementById('total-value');

    function atualizarTotal() {
        let quantidade = parseInt(inputQuantidade.value, 10) || 1;
        let total = precoUnitario * quantidade;
        if (quantidade >= 3) {
            total = total * (1 - desconto);
        }
        spanTotal.textContent = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    inputQuantidade.addEventListener('input', atualizarTotal);
    atualizarTotal();
});