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
let buttons = [];

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
    let buttonsDOM = buttons;

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
    console.log('tempTotal ==>', tempTotal)
    console.log('itemsTotal', itemsTotal)

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
}

// event listener to run once DOM is loaded
document.addEventListener('DOMContentLoaded', (e) => {
  // create a new instance of UI
  const ui = new UI();
  // create a new instacne of products
  const products = new Products();
  // get all products
  products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProducts(products)
  }).then(() => {
    ui.getBagButtons();
  })
})
