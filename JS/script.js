(function () {
  //ELEMENTOS HTML
  const menu_list = document.getElementById("menu_list");
  const cartList = document.getElementById("cartList");
  const confirmOrderBtn = document.getElementById("confirmOrder");
  const orderSection = document.getElementById("orderSection");
  const modalContainer = document.querySelector(".confirm_order");

  // ==========================================================
  // FUNÇÕES AUXILIARES (Definição da Função)
  // ==========================================================

  function atualizarTotalDoCarrinho() {
    const cartTotalElement = document.querySelector(".total");

    const nodeListTotalPrices = cartList.querySelectorAll(".cart_item-total");

    const numericPrices = Array.from(nodeListTotalPrices).map((price) => {
      const _numericPrices = price.innerText.replace(/[^0-9.]/g, "");
      return Number(_numericPrices);
    });

    const totalPrices = numericPrices.reduce((total, price) => {
      return total + price;
    }, 0);

    return (cartTotalElement.innerText = `$${totalPrices.toFixed(2)}`);
  }

  function cartEmpty() {
    const cartContainer = document.querySelector(".section_cart");
    const emptyCart = cartContainer.querySelector(".cart_empty");
    const cartTotalContainer = cartContainer.querySelector(
      ".cart_total-container"
    );
    const cartEcoMessageContainer = cartContainer.querySelector(
      ".eco_message-container"
    );
    const btnConfirmOrder = cartContainer.querySelector("#confirmOrder");

    const cartItem = cartList.querySelectorAll(".cart_item");

    if (cartItem.length > 0) {
      emptyCart.style.display = "none";
      cartTotalContainer.style.display = "flex";
      cartEcoMessageContainer.style.display = "flex";
      cartList.style.display = "block";
      btnConfirmOrder.style.display = "block";
    } else {
      cartTotalContainer.style.display = "none";
      cartEcoMessageContainer.style.display = "none";
      cartList.style.display = "none";
      btnConfirmOrder.style.display = "none";
      emptyCart.style.display = "flex";
    }
  }

  function cartQuantityCounter() {
    const cartSection = document.querySelector(".section_cart");
    const quantityCounterElement = cartSection.querySelector("#cart_quantity");
    const _cartItemQuantity = document.querySelectorAll(".cart_item-quantity");
    const x = Array.from(_cartItemQuantity).map((quantity) => {
      const rawText = quantity.innerText.replace("x", "").trim();
      return Number(rawText) || 0;
    });
    const cartItemQuantity = x.reduce((unit, total) => {
      return unit + total;
    }, 0);
    quantityCounterElement.innerText = cartItemQuantity;
  }

  function closeModal() {
    orderSection.classList.add("hidden");
    document.body.classList.remove("no-scroll");

  }

  function populateOrderModal(){
    const modalList = modalContainer.querySelector(".order_list");
    const orderTotal = modalContainer.querySelector(".order_total");
    const cartTotal = document.getElementById("total").innerText;
    const _cartItems = cartList.querySelectorAll(".cart_item");
    const orderList = Array.from(_cartItems).map(item => {
    return {
      element: item, 
      thumbImg: item.dataset.thumbImg,
    };
  });
     console.log(orderList);
     
     orderList.forEach(item => {
        const orderItem = document.createElement("li");
        orderItem.classList.add("order_item");
        orderItem.innerHTML += `
            <div class="order_item-left">
              <img src="${item.thumbImg}" alt="" class="order_item-image">
              <div class="order_content-center">
                <p class="order_item-name">${item.element.querySelector(".cart_item-name").innerText}</p>
                <div class="order_item-info">
                  <span class="order_item-quantity">${item.element.querySelector(".cart_item-quantity").innerText}</span>
                  <span class="order_item-individual-price">${item.element.querySelector(".cart_item-price").innerText}</span>
                </div>
              </div>
            </div>
            <span class="order_item-total">${item.element.querySelector(".cart_item-total").innerText}</span>`
            modalList.appendChild(orderItem)
      })

      orderTotal.innerText = cartTotal;

  }

  function deleteItemsModal(){
    const orderListContainer = modalContainer.querySelector(".order_list");
    orderListContainer.innerHTML = '';
  }

  function openModal() {
    orderSection.classList.remove("hidden");
  }

  function newOrder(){
    const _menuItem = menu_list.querySelectorAll(".menu_item")
    Array.from(_menuItem).forEach(item => {
      item.querySelector(".btn_add-cart").style.opacity = 1;
      item.querySelector(".btn_add-cart").disabled = false;
      item.querySelector(".quantity-selector").style.opacity = 0;
      item.querySelector(".quantity-selector").style.pointerEvents = "none";
      item.querySelector(".quantity-selector").querySelector(".quantity-selector__value").innerText = 0;
    })
    cartList.innerHTML = '';
    document.getElementById("cart_quantity").innerText = "0";
    cartEmpty();
    deleteItemsModal()
  }

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

                <img class = "menu_item-img" src="${item.image.mobile}">
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
      menuItem.dataset.thumbImg = item.image.thumbnail;
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
      quantitySelector.querySelector(".quantity-selector__value").innerText = 1;
      // create and append cart item using data attached to the menu item
      const cartItem = document.createElement("li");
      cartItem.classList = "cart_item";

      const itemName =
        menuItem.dataset.name ||
        menuItem.querySelector(".menu-item-name")?.innerText?.trim() ||
        "Item";
      const itemPriceRaw =
        menuItem.dataset.price ||
        menuItem
          .querySelector(".menu-item-price")
          ?.innerText?.replace(/[^0-9.-]+/g, "") ||
        "0";
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
      cartItem.dataset.thumbImg = menuItem.dataset.thumbImg;
      cartList.appendChild(cartItem);
      atualizarTotalDoCarrinho();
      cartEmpty();
      cartQuantityCounter();
    }

    //INCREASE QUANTITY
    if (event.target.closest(".quantity-selector__increment")) {
      const menuItem = event.target.closest(".menu_item");
      const _orderQuantity = menuItem.querySelector(
        ".quantity-selector__value"
      );

      let orderQuantity = Number(_orderQuantity?.innerText?.trim() ?? "0");
      orderQuantity += 1;
      _orderQuantity.innerText = orderQuantity;
      //INCREASE QUANTITY CART
      const itemName =
        menuItem.dataset.name ||
        menuItem.querySelector(".menu-item-name")?.innerText?.trim();

      const cartItem = Array.from(cartList.querySelectorAll(".cart_item")).find(
        (item) => {
          return (
            item.querySelector(".cart_item-name")?.innerText?.trim() ===
            itemName
          );
        }
      );

      if (cartItem) {
        const cartItemQuantityElement = cartItem.querySelector(
          ".cart_item-quantity"
        );
        const cartItemTotalElement = cartItem.querySelector(".cart_item-total");
        const cartItemPriceElement = cartItem.querySelector(".cart_item-price");

        cartItemQuantityElement.innerText = `${orderQuantity}x`;

        const priceText = cartItemPriceElement.innerText.replace(
          /[^0-9.-]+/g,
          ""
        );
        const price = Number(priceText) || 0;

        const newTotal = price * orderQuantity;
        cartItemTotalElement.innerText = `$${newTotal.toFixed(2)}`;
      } else {
        console.error("Item do carrinho não encontrado para atualização.");
      }
      atualizarTotalDoCarrinho();
      cartQuantityCounter();
    }

    //DECREMENT QUANTITY
    if (event.target.closest(".quantity-selector__decrement")) {
      const menuItem = event.target.closest(".menu_item");
      const _orderQuantity = menuItem.querySelector(
        ".quantity-selector__value"
      );

      let orderQuantity = Number(_orderQuantity?.innerText?.trim() ?? "0");
      orderQuantity -= 1;
      _orderQuantity.innerText = orderQuantity;

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

      const itemName =
        menuItem.dataset.name || menuItem.querySelector(".menu-item-name");

      const cartItem = Array.from(cartList.querySelectorAll(".cart_item")).find(
        (item) => {
          return (
            item.querySelector(".cart_item-name")?.innerText?.trim() ===
            itemName
          );
        }
      );

      if (cartItem) {
        const cartItemQuantityElement = cartItem.querySelector(
          ".cart_item-quantity"
        );
        const cartItemPriceElement = cartItem.querySelector(".cart_item-price");
        const cartItemTotalElement = cartItem.querySelector(".cart_item-total");

        cartItemQuantityElement.innerText = `${orderQuantity}x`;

        const priceText = cartItemPriceElement.innerText.replace(
          /[^0-9.-]+/g,
          ""
        );
        const price = Number(priceText) || 0;

        const priceTotalText = cartItemTotalElement.innerText.replace(
          /[^0-9.-]+/g,
          ""
        );
        const priceTotal = Number(priceTotalText) || 0;

        const newTotal = priceTotal - price;

        cartItemTotalElement.innerText = `$${newTotal.toFixed(2)}`;

        if (orderQuantity < 1) {
          cartItem.remove();
        }
      } else {
        console.error("Item do carrinho não encontrado para atualização.");
      }
      atualizarTotalDoCarrinho();
      cartEmpty();
      cartQuantityCounter();
    }
  });

  //DELETE ORDER BTN
  cartList.addEventListener("click", (event) => {
    if (event.target.closest(".icon_removeItem")) {
      const cartItem = event.target.closest(".cart_item");
      const cartItemName = cartItem
        .querySelector(".cart_item-name")
        .innerText.trim();
      cartItem.remove();
      atualizarTotalDoCarrinho();

      if (cartItemName && menu_list) {
        const menuItem = Array.from(
          menu_list.querySelectorAll(".menu_item")
        ).find((item) => {
          const menuItemName = item
            .querySelector(".menu-item-name")
            ?.innerText?.trim();
          return menuItemName === cartItemName;
        });

        if (menuItem) {
          const btnAddCart = menuItem.querySelector(".btn_add-cart");
          const quantitySelector = menuItem.querySelector(".quantity-selector");
          //DESATIVANDO O btnAddCart E A TIVANDO quantitySelector
          btnAddCart.style.opacity = 1;
          btnAddCart.disabled = false;
          quantitySelector.style.opacity = 0;
          quantitySelector.style.pointerEvents = "none";
          quantitySelector.querySelector(
            ".quantity-selector__value"
          ).innerText = 1;
        }
      }
    }
    cartEmpty();
    cartQuantityCounter();
  });

  if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (orderSection) {
        openModal();
        populateOrderModal();
      }
      document.body.classList.add("no-scroll");
    });
  }



  modalContainer.addEventListener("click", (event) => {
    if (event.target.closest(".icon_close-modal")) {
      closeModal();
      deleteItemsModal();
    }

    orderSection.addEventListener("click", event => {
        if(event.target === orderSection){
          closeModal();
          deleteItemsModal();
      }
    });

    modalContainer.addEventListener("click", (event) => {
      const startNewOrder = modalContainer.querySelector(".btn_startNewOrder");
      if(event.target === startNewOrder){
        newOrder();
        closeModal();
      }
    })
  });

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
