// Initial array of stocks
const stocks = ['FB', 'AAPL', 'TSLA', 'GOOG'];
// displaystockInfo function displays stock info as a table when stock btns get pressed (#buttons-view)
const displayStockInfo = function () {

  // Grab the stock symbol from the button clicked and add it to the queryURL
  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,logo,news&range=1m&last=10&filter=symbol,companyName,latestPrice,headline,source,url`;

  // Creating an AJAX call for the specific stock button being clicked
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    //console.log response to test
    console.log(response);

    //Use response to create const for items in the object
    const companyName = response.quote.companyName;
    const stockSymbol = response.quote.symbol;
    const stockPrice = response.quote.latestPrice;
    const logo = response.logo.url;
    // const companyNews = response.news[0].headline;
    const companyNews = response.news[0].url;

    // Creating a table to be appended displaying stock info

    const nameHolder = $('#stocks-table').html(`
      <tr>
        <td><img src="${logo}" /></td>
        <td>${companyName}</td>
        <td>${stockSymbol}</td>
        <td>${stockPrice}</td>
        <td><a class='anchor'href='${companyNews}'>Click for news!</a></td>
      </tr>)`);

    $('.stocks').append(nameHolder);
  });

}
//This listener allows stock info to be appended when stock btn is pushed
$('#buttons-view').on('click', '.stock-btn', displayStockInfo);

// Function for displaying stock buttons initally when page loads
const render = function () {
  // Deleting the stocks prior to adding new stocks
  // (this is necessary otherwise you will have repeat buttons)
  $('#buttons-view').empty();
  // Looping through the array of stocks to render initial buttons
  for (let i = 0; i < stocks.length; i++) {
    // Then dynamicaly generating buttons for each stock in the array
    const newButton = $('<button>');
    // Adding a class of stock-btn to our button
    newButton.addClass('stock-btn');
    newButton.addClass('btn btn-primary');
    newButton.addClass('btn-dark');
    // Adding a data-attribute
    newButton.attr('data-name', stocks[i]);
    // Providing the initial button text
    newButton.text(stocks[i]);
    // Adding the button to the buttons-view div
    $('#buttons-view').append(newButton);
    $('.clear').addClass('hide');
    $('h2').addClass('hide');
  }
}
// Calling the renderButtons function to display the intial buttons
render();



//This function appends new stock buttons when you enter them
const validateSymbol = function (event) {
  //preventDefault prevents
  event.preventDefault();
  //Variable stock assigned stock input id
  const stock = $('#stock-input').val().trim();
  //stock input will be uppercase
  const stockUC = stock.toUpperCase();
  //URL for all data symbols on IEX trading
  const apiSymbols = 'https://api.iextrading.com/1.0/ref-data/symbols';

  //AJAX Call
  $.ajax({
    url: apiSymbols,
    method: 'GET'
  }).then(function (responseTwo) {
    const validationList = responseTwo;
    console.log(responseTwo);
    //Loop through array of objects returned by AJAX
    for (let i = 0; i < validationList.length; i++) {
      //IF USER input uppercase strictly equal to stock symbol in AJAX return
      if (stockUC === responseTwo[i].symbol) {
        console.log(stock);
        //Push item in array
        stocks.push(stockUC);
        //Dynamically generated stock buttons
        let newButtonHTML = $(`<button class="new-stock-btn btn btn-primary" val="${stockUC}">${stockUC}
       </button>&nbsp;`);
        //Event Listener for newly generated buttons
        newButtonHTML.on('click', displayStockInfo);
        //Append newly generated buttons to buttons-view div
        $('#buttons-view').append(newButtonHTML);
       
        render();
        // return;
      } else if( ($('.clear').removeClass('hide')) === true && ($('h2').removeClass('hide')) === true) {
        $('.clear').addClass('hide');
        $('h2').addClass('hide');
        // $('#stock-input').val('');

      }else{
        $('.clear').removeClass('hide');
        $('h2').removeClass('hide');
        $('#stock-input').val('');
      }
    }
  });
};
$('#add-stock').on('click', validateSymbol);


//Add to favorite function
const addFavorite = function () {
  const stock = $('#favorite-input').val();
  const stockUC = stock.toUpperCase();
  const logoURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,logo,news&range=1m&last=10&filter=symbol,companyName,latestPrice,headline,source,url`;
  $.ajax({
    url: logoURL,
    method: 'GET'
  }).then(function (responseThree) {
    const loGo = responseThree.logo.url;
    const companyNAME = responseThree.quote.companyName;
    const stockSymbol = responseThree.quote.symbol;
    if (stock.length >= 1 && stockUC === stockSymbol) {
      $('.favorite-stocks').append(`<div class="card" style="width: 18rem; float: left; opacity: 0.6;">
      <img src='${loGo}' alt='stock-pic'>
  <div class="card-body">
  <h5 class="card-title">${companyNAME}</h5>
    <button class="new-stock-btn btn btn-dark" val="${stockSymbol}">${stockSymbol}
      </button>&nbsp;
  </div>
</div>`);
      $('h2').removeClass('hide');
      $('.clear').removeClass('hide');
      $('#favorite-input').val('');
    } else {
      $('#favorite-input').val('');
    }
  });
}
$('.favorite').on('click', addFavorite);

const clear = function () {
  $('#buttons-view').empty();
  $('.favorite-stocks').empty();
  $('h2').addClass('hide');
  $('.clear').addClass('hide');
}
$('.clear').on('click', clear);

//Search for a stock symbol by entering company name

const searchStock = function (event) {
  //preventDefault prevents
  event.preventDefault();
  //Variable stock assigned stock input id
  const stockInput = $('#search-input').val().trim();



  //URL for all data symbols on IEX trading
  const apiSymbols = 'https://api.iextrading.com/1.0/ref-data/symbols';

  //AJAX Call
  $.ajax({
    url: apiSymbols,
    method: 'GET'
  }).then(function (responseFour) {
    // const validationListTwo = responseFour;
    console.log(responseFour);
    //Loop through array of objects returned by AJAX
    for (let i = 0; i < responseFour.length; i++) {
      //IF USER input uppercase strictly equal to stock symbol in AJAX return
      if (stockInput === responseFour[i].name) {
        // console.log('hello');
        //Push item in array
        console.log(responseFour[i].name);
        let stockSym = responseFour[i].symbol;
        // searchResult.push(responseFour[i].symbol);
        //Dynamically generated stock buttons
        let searchResultHTML = $(`<div class="card" style="width: 18rem; float: left;">
        <div class="card-body">
          <h5 class="card-title">Stock Symbol for ${stockInput}</h5>
          <p class="card-text">${stockSym}</p>
        </div>
      </div>`);


        //Append newly generated buttons to buttons-view div
        $('.search-result').append(searchResultHTML);
        render();
        // return true;
      } else if (( ($('.clear').removeClass('hide')) === true && ($('h2').removeClass('hide')) === true)) {
        $('.clear').addClass('hide');
        $('h2').addClass('hide');
      

        // alert('Please enter a valid company name');
        // return false;
      }else{
        $('.clear').removeClass('hide');
        $('h2').removeClass('hide');
        // $('#search-input').val('');
    }
  };
  });
}
$('#search-stock').on('click', searchStock);