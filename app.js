// create variables cache the DOM
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// cart items
let cart = [];
// buttons
let buttonsDOM = [];

// stub out classes
// getting the products
class Products {
  // write method to get the product and wait untill we get json via fetch
  async getProducts() {

    try {
      let result = await fetch('products.json');
      let data =  await result.json();
      let products = data.items;
      products = products.map(item => {
        // console.log(item);
        const {title, price} = item.fields;
        // console.log('{title, price} ==>', {title, price});
        const {id} = item.sys;
        // console.log('this is the ID', id);
        const imageURL = item.fields.image.fields.file.url;
        // console.log(imageURL);
        // console.log({title,price,id,imageURL})
        // product of object deconstruction in my return
        return {title,price,id,imageURL}
      })
      // console.log(products);
      return products;
    } catch (error) {
      console.log(error)
    }
  }
}

// display the products
class UI {
  displayProducts(products) {
    // store the result HTML
    let result = '';

    // loop through each product
    products.forEach(product => {
      // console.log('this is the product', product);
      result += `
      <!-- single product -->
      <article class="product">
        <div class="img-container">
          <img
            src=${product.imageURL}
            alt="product"
            class="product-img"
          >
          <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart"></i>
            add to bag
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      <!-- end of single product -->
      `
    })

    productsDOM.innerHTML = result;
  }
  getBagButtons(){
    const buttons = [...document.querySelectorAll('.bag-btn')]
    buttonsDOM = buttons;
    console.log('this is the buttons DOM ==>', buttonsDOM);

    buttons.forEach(button => {
      let id =  button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      if(inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      }
      // add event listener to listen for the add to cart click
      button.addEventListener('click', event => {
        // change the text of the button to 'in cart'
        event.target.innerText = 'In Cart'
        // disable the event from triggering itself
        event.target.disabled = true;
        // get products from products
        // copy over the products and add a property with the amount 1
        const cartItem = {...Storage.getProducts(id), amount: 1};
        // console.log(cartItem);
        // add products to the cart
        // copy over the cart and add the cartitem
        cart = [...cart, cartItem];
        console.log('cart =>', cart);
        // save the cart in local storage
        let store = Storage.saveCart(cart);
        // method to set the cart value
        this.setCartValues(cart);
        // display cart item by calling the addCartItem
        // function and pass in cartItem as an argument
        this.addCartItem(cartItem);
        // now show the cart
        this.showCart();
      })
    })
  }
  setCartValues(cart) {
    console.log('this is the cart', cart)
    // store the temp and items total
    let tempTotal = 0;
    let itemsTotal = 0;
    // loop through the cart and add up the amount and price
    cart.map(item => {
      console.log('This is the ==>', item)
      // subscribe to the tempTotal and itemsTotal
      tempTotal += item.price * item.amount
      itemsTotal += item.amount
    })
    // console.log('tempTotal ==>', tempTotal)
    // console.log('itemsTotal', itemsTotal)

    // update the shopping cart icon to reflect tempTotal
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    // console.log(cartTotal, cartItems);
  }
  // function to the cart items to the DOM
  // shopping cart overlay
  addCartItem(item) {
    // console.log('this is the item object =>', item);
    // create a div
    const div = document.createElement('div')
    // add a class to the div called cart-item
    div.classList.add('cart-item')
    // set the div inner html to the shopping cart item
    // replace the item title, item price, item id, item amount
    div.innerHTML = `<img src=${item.imageURL} alt="product">
        <div>
          <h4>${item.title}</h4>
          <h5>${item.price}</h5>
          <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
          <i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`

    cartContent.appendChild(div);
    // console.log(cartContent);
  }
  showCart() {
    // add a class that triggers the tranparent background
    cartOverlay.classList.add('transparentBcg');
    // add a class to show the actual cart
    cartDOM.classList.add('showCart');
  }
  setupAPP() {
    // once the dom is loaded get the cart from the localStorage
    cart = Storage.getCart();
    // then set the cart values to be updated if we find items in local storage
    this.setCartValues(cart);
    // then populate the cart with the item to be reflected in the shopping cart
    this.populateCart(cart);
    // when you click on the cart button show the shopping cart
    cartBtn.addEventListener('click', this.showCart);
    // when you click on the close cart button then close the cart
    closeCartBtn.addEventListener('click', this.hideCart);
  }
  populateCart() {
    // for each of the cart items found add the CartItem to the shopping cart
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    // remove the transparent background
    cartOverlay.classList.remove('transparentBcg');
    // hide the cart
    cartDOM.classList.remove('showCart');
  }
  cartLogic() {
    // add an event listener that removes all items from the cart
    clearCartBtn.addEventListener('click', ()=> {
      this.clearCart();
    });
  }
  clearCart() {
    // get all id's of the items in the cart
    let cartItems = cart.map(item => item.id);
    // console.log(cartItems);
    // once I get the ID remove all the items
    cartItems.forEach(id => this.removeItem(id));
    // remove all of items from the DOM cart when I clear the cart
    console.log('cartContent.children', cartContent.children);
    while(cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0])
    }
    // hide the cart
    this.hideCart();
  }
  removeItem(id) {
    // console.log('this is the ==>', id)
    // filter the cart if the item.id does not equal to
    // the current id being removed return it
     cart = cart.filter(item => item.id !== id);
    // update/set the cartvalues
    this.setCartValues(cart);
    // update the Storage to save the cart
    Storage.saveCart(cart)
    // store the single button we are click on

    let button = this.getSingleButton(id);
    console.log('this is the button b=>',button);
    // add the addCart button back to the items
    button.disabled = false;
    // set the button inner html back to original button
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
  }
  getSingleButton(id){
    // find the button ID that was in the cart and match it to the button dataset id
    // and match it to the id that I am passing it.
    // console.log('this is the id', id);
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem('products'));

    return products.find(product => product.id === id);
  }

  static saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // get the cart if the item in the local storage exist if not show an empty cart
  static getCart() {
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  }
}

// event listener to run once DOM is loaded
document.addEventListener('DOMContentLoaded', (e) => {
  // create a new instance of UI
  const ui = new UI();
  // create a new instacne of products
  const products = new Products();
  // setup app
  ui.setupAPP();
  // get all products
  products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProducts(products)
  }).then(() => {
    ui.getBagButtons();
    ui.cartLogic();
  })
})
