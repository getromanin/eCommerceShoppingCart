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
