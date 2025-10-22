(function () {
  //ELEMENTOS HTML
  const menu_list = document.getElementById("menu_list");
  const confirmOrder = document.getElementById("confirmOrder");
  const orderSection = document.getElementById("orderSection");

  //CARREGAMENTO MENU (Interação com JSON)
  fetch("../data.json")
    .then((response) => response.json())
    .then((data) => {
      renderizarMenu(data);
    })
    .catch((error) => {
      console.error("Erro ao carregar o JSON:", error);
    });

  // RENDERIZAÇÃO DO MENU
  function renderizarMenu(itens) {
    itens.forEach((item) => {
      const menuItem = document.createElement("article");
      menuItem.classList = "menu_item";
      menuItem.innerHTML = `
            <div class="menu_item-image-wrapper">
              <picture>
              <source class = "menu_item-img" media="(min-width: 65rem)" srcset="${
                item.image.desktop
              }">
              
              <source class = "menu_item-img" media="(min-width: 47rem)" srcset="${
                item.image.tablet
              }">

                <img class = "menu_item-img" src="${
                  item.image.mobile
                }" alt="Waffle com Frutas">
              </picture>
              <button class="btn_add-cart menu_item-image-wrapper btn_item-position btn-wrapper" id = "btn_add_cart">
                <img
                  src="assets/images/icon-add-to-cart.svg"
                  alt="cart icon"
                  class="icon_cart"
                />Add to Cart
              </button>
              <div class="quantity-selector btn_item-position" id="btn_increase_quantity">
                <button class="quantity-selector__decrement">-</button>
                <span class="quantity-selector__value">1</span>
                <button class="quantity-selector__increment">+</button>
              </div>
            </div>
            <ul class="menu_item-info">
              <li class="menu-item-type">${item.category}</li>
              <li class="menu-item-name">${item.name}</li>
              <li class="menu-item-price">$${item.price.toFixed(2)}</li>
            </ul>`;
      // store item data on the element so event handlers can access it later
      menuItem.dataset.name = item.name;
      menuItem.dataset.price = item.price;
      menuItem.dataset.priceFormatted = `$${item.price.toFixed(2)}`;
      menu_list.appendChild(menuItem);
    });
  }

  //ADICIONAR PEDIDO NO CARRINHO USANDO EVENT DELEGATION
  menu_list.addEventListener("click", (event) => {
    if (event.target.closest(".btn_add-cart")) {
      const menuItem = event.target.closest(".menu_item");
      const btnAddCart = menuItem.querySelector(".btn_add-cart");
      const quantitySelector = menuItem.querySelector(".quantity-selector");
      //DESATIVANDO O btnAddCart E A TIVANDO quantitySelector
      btnAddCart.style.opacity = 0;
      btnAddCart.disabled = true;
      quantitySelector.style.opacity = 1;
      quantitySelector.style.pointerEvents = "auto";
      // create and append cart item using data attached to the menu item
      const cartList = document.getElementById("cartList");
      const cartItem = document.createElement("li");
      cartItem.classList = "cart_item";

      const itemName =
        menuItem.dataset.name ||
        menuItem.querySelector(".menu-item-name")?.innerText?.trim() ||
        "Item";
      const itemPriceRaw =
        menuItem.dataset.price ||
        menuItem.querySelector(".menu-item-price")?.innerText?.replace(/[^0-9.-]+/g, "") || "0";
      const itemPrice = Number(itemPriceRaw);

      cartItem.innerHTML = `<div class="cart_item-description">
              <span class="cart_item-name">${itemName}</span>
              <div class="cart_item-info">
                <span class="cart_item-quantity">1x</span>
                <span class="cart_item-price">@$${itemPrice.toFixed(2)}</span>
                <span class="cart_item-total">$${itemPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              class="btn_removeItem"
              aria-label="Remove ${itemName} from cart"
            >
              <img
                src="assets/images/icon-remove-item.svg"
                alt="Remove item"
                class="icon_removeItem"
              />
            </button>`;
      cartList.appendChild(cartItem);
    }

    //INCREASE QUANTITY
    if (event.target.closest(".quantity-selector__increment")) {
      const menuItem = event.target.closest(".menu_item");
      const _orderQuantity = menuItem.querySelector(".quantity-selector__value");
      const raw = _orderQuantity?.innerText?.trim() ?? "";
      const parsed = Number(raw);

      let orderQuantity = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
      orderQuantity += 1;
      _orderQuantity.innerText = orderQuantity;
      console.log(orderQuantity);

      //INCREASE QUANTITY CART
    
    // 1. Obtém o nome do item do menu
    const itemName = menuItem.dataset.name || menuItem.querySelector(".menu-item-name")?.innerText?.trim();
    
    // 2. Encontra o elemento 'cartList' principal
    const cartListContainer = document.getElementById("cartList"); 
    
    // 3. Busca o item do carrinho correspondente usando o nome
    // Itera sobre todos os itens do carrinho para encontrar o que corresponde ao nome.
    // **Nota:** Assumindo que você só tem um item com esse nome no carrinho.
    const cartItem = Array.from(cartListContainer.querySelectorAll(".cart_item")).find(item => {
        return item.querySelector(".cart_item-name")?.innerText?.trim() === itemName;
    });

    if (cartItem) {
        // 4. Se o item do carrinho for encontrado, atualiza a quantidade e o total
        const cartItemQuantityElement = cartItem.querySelector(".cart_item-quantity");
        const cartItemTotalElement = cartItem.querySelector(".cart_item-total");
        const cartItemPriceElement = cartItem.querySelector(".cart_item-price");

        // Atualiza a quantidade (ex: de "1x" para "2x")
        cartItemQuantityElement.innerText = `${orderQuantity}x`;

        // Lógica para recalcular o total (você precisará extrair o preço unitário)
        // **Isto é uma simplificação:** Você precisa garantir que o preço seja um número.
        const priceText = cartItemPriceElement.innerText.replace(/[^0-9.-]+/g, "");
        const price = Number(priceText) || 0;
        
        const newTotal = price * orderQuantity;
        cartItemTotalElement.innerText = `$${newTotal.toFixed(2)}`;
        
        console.log(cartItemQuantityElement.innerText);
    } else {
        console.error("Item do carrinho não encontrado para atualização.");
    }
    }

    //DECREMENT QUANTITY
    if (event.target.closest(".quantity-selector__decrement")) {
      const menuItem = event.target.closest(".menu_item");
      const _orderQuantity = menuItem.querySelector(".quantity-selector__value");
      const raw = _orderQuantity?.innerText?.trim() ?? "";
      const parsed = Number(raw);

      let orderQuantity = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
      orderQuantity -= 1;
      _orderQuantity.innerText = orderQuantity;
      console.log(orderQuantity);

      //DESATIVANDO O quantitySelector E A TIVANDO btnAddCart 
      if (_orderQuantity.innerText < 1) {
        const menuItem = event.target.closest(".menu_item");
        const btnAddCart = menuItem.querySelector(".btn_add-cart");
        const quantitySelector = menuItem.querySelector(".quantity-selector");

        btnAddCart.style.opacity = 1;
        btnAddCart.disabled = false;
        quantitySelector.style.opacity = 0;
        quantitySelector.style.pointerEvents = "none";
      }
    }
  });

  if (confirmOrder) {
    confirmOrder.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (orderSection) {
        orderSection.style.display = "block";
      }
      document.body.classList.add("no-scroll");
    });
  }

  // Corrige valores alterados manualmente pelo DevTools
// setInterval(() => {
//   document.querySelectorAll(".quantity-selector__value").forEach((el) => {
//     const parsed = Number(el.innerText.trim());
//     if (!Number.isFinite(parsed) || parsed < 0) {
//       el.innerText = 1;
//     }
//   });
// }, 500);
})();
