let timeToExpire;
timeToExpire = Date.now() + 5000;

setInterval(() => {
    let dateActual = Date.now();
    console.log(dateActual, timeToExpire)
},1000)

if(dateActual >= timeToExpire){
    console.log('**************************')
}