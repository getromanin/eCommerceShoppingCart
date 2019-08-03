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

export {Products};
