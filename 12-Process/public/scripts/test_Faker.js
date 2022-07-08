let faker = require('faker');
faker.locale = 'es';
const { commerce, image } = faker;

let datosArray = [];


for (let i = 0; i < 5; i++) {
    let randomName = commerce.productName();
    let randomPrice = commerce.price();
    let randomImage = image.imageUrl(640, 640, 'cat', true);

    let objectAux = {
        id: i + 1,
        title: randomName,
        price: randomPrice,
        thumbnail: randomImage
    };
    
    datosArray.push(objectAux);
}

// console.log(datosArray);

module.exports = { datosArray };

