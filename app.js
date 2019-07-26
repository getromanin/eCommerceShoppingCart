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
