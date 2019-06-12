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

// stub out classes
// getting the products
class Products {
  // write method to get the product and wait untill we get json via fetch
  async getProducts() {

    try {
      let result = await fetch('products.json');
      let data =  await result.json();

      return data;
    } catch (error) {
      console.log(error)
    }
  }
}

// display the products
class UI {

}

// local storage
class Storage {

}

// event listener to run once DOM is loaded
document.addEventListener('DOMContentLoaded', (e) => {
  // create a new instance of UI
  const ui = new UI();

  // create a new instacne of products
  const products = new Products();
  // get all products
  products.getProducts().then(data => console.log(data));
})
