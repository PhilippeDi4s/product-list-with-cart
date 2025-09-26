(function () {
  //CARREGAMENTO E RENDERIZAÇÃO DO MENU (Interação com JSON)
  fetch("../data.json")
    .then((response) => response.json())
    .then((data) => {
      renderizarMenu(data);
    })
    .catch((error) => {
      console.error("Erro ao carregar o JSON:", error);
    });

  function renderizarMenu(itens) {
    const menu_list = document.getElementById("menu_list");
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
              <button class="btn_add-cart">
                <img
                  src="assets/images/icon-add-to-cart.svg"
                  alt="cart icon"
                  class="icon_cart"
                />Add to Cart
              </button>
            </div>
            <ul class="menu_item-info">
              <li class="menu-item-type">${item.category}</li>
              <li class="menu-item-name">${item.name}</li>
              <li class="menu-item-price">$${item.price.toFixed(2)}</li>
            </ul>`;
      menu_list.appendChild(menuItem);
      console.log("Caminho Desktop:", item.image.desktop);
      console.log("Caminho Tablet:", item.image.tablet);
    });
  }

  const confirmOrder = document.getElementById("confirmOrder");
  const orderSection = document.getElementById("orderSection");

  if (confirmOrder) {
    confirmOrder.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (orderSection) {
        orderSection.style.display = "block";
      }
      document.body.classList.add("no-scroll");
    });
  }
})();
