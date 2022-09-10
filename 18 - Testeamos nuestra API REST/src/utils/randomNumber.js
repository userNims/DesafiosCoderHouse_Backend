process.on("message", function (data) {
    let randomNumbers = [];

    for(let i = 0; i < data; i++){
		let random = Math.floor(Math.random() * 1000);
        randomNumbers.push(`${random} \n`);
	}

    console.log(`Message from main.js: ${data}`);
    process.send(randomNumbers);
});