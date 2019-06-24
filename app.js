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
      console.log('this is the product', product);
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
    console.log(buttons);

    buttons.forEach(button => {
      let id =  button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      if(inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      }
      button.addEventListener('click', event => {
        event.target.innerText = 'In Cart'
        event.target.disabled = true;
      })
    })
  }
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
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
