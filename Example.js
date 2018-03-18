///代码样例
var caltor = new Caltor();
caltor.defineInput('price');
caltor.defineInput('count');
caltor.defineInput('amount');

caltor.defineRule('amountRule', function () {
    this
        .markInput('price')
        .markInput('count')
        .markOutput('amount')
        .setHandler(function (inputFetcher, outputFetcher) {
            var price = inputFetcher('price');
            var count = inputFetcher('count');

            var amount = outputFetcher('amount');
            amount.setOutputValue(price * count);
        });
});

caltor.defineRule('priceRule', function () {
    this
        .markInput('amount')
        .markFixedInput('count')
        .markOutput('price')
        .setHandler(function (inputFetcher, outputFetcher) {
            var amount = inputFetcher('amount');
            var count = inputFetcher('count');
            var price = outputFetcher('price');
            price.setOutputValue(amount / count);
        })
})

// caltor.select('price').setInputValue(2);
// caltor.select('count').setInputValue(3);
// caltor.select('amount').setInputValue(9);
// caltor.select('count').setInputValue(4);
// caltor.select('amount').setInputValue(0);