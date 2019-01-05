// Initial array of stocks
const stocks = ['FB', 'AAPL', 'TSLA', 'GOOG'];

// Function for displaying stock buttons initally when page loads
const render = function () {
  // Deleting the stocks prior to adding new stocks
  $('#buttons-view').empty();
  // Looping through the array of stocks to render initial buttons
  for (let i = 0; i < stocks.length; i++) {
    // Then dynamicaly generating buttons for each stock in the array
    const newButton = $('<button>');
    // Adding a class of stock-btn to our button
    newButton.addClass('stock-btn');
    newButton.addClass('btn btn-primary');
    newButton.addClass('btn-dark');
    // Adding a data-attribute with the stock name to access the value later
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

// displaystockInfo function displays stock info as a table when stock btns get pressed (#buttons-view)
const displayStockInfo = function () {

  // Grab the stock symbol from the button clicked and add it to the queryURL using keyword this
  const stock = $(this).attr('data-name');
  
  //Keyword this = <button class="stock-btn btn btn-primary btn-dark" data-name="TSLA">TSLA</button>
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,logo,news&range=1m&last=10&filter=symbol,companyName,latestPrice,headline,source,url`;

  // Creating an AJAX call for the specific stock button being clicked
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    $('.stockNewsDump').empty();
    //Use response to create const for items in the object
    const companyName = response.quote.companyName;
    const stockSymbol = response.quote.symbol;
    const stockPrice = response.quote.latestPrice;
    const logo = response.logo.url;

    const nameHolder = $('#stocks-table').html(`
    <tr>
      <td class="font-family"><img src="${logo}" /></td>
      <td class="font-family">${companyName}</td>
      <td class="font-family">${stockSymbol}</td>
      <td class="font-family">$${stockPrice}USD</td>
    </tr>)`);
  $('.stocks').append(nameHolder);
    // const companyNews = response.news[0].headline;
    // const companyNews = response.news[0].url;
    for(let i = 0; i < response.news.length; i++){
      const newsHeadline = response.news[i].headline;
      const newsUrl = response.news[i].url;
      const newsSource = response.news[i].source
     
      // $('.stockNewsDump').append( `<a href="${newsUrl}" target="blank"><div class="newsbox"><h3>${newsHeadline}</h3><p>${newsSource}</p></div></a>`
      // );

      $('.stockNewsDump').append(`<div class="card">
      <div class="card-header">
        ${stock} News
      </div>
      <div class="card-body">
        <h5 class="card-title">News Source: ${newsSource}</h5>
        <p class="card-text">${newsHeadline}</p>
        <a href="${newsUrl}" target="_blank" class="btn btn-secondary">Read Article</a>
      </div>
    </div>`)
      
    }
      
    
  });
}
//This listener allows stock info to be appended to table when stock btn is pushed
//Buttons-view id div on line 7 and .stock-btn is class created on line 13
$('#buttons-view').on('click', '.stock-btn', displayStockInfo);


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
    //Loop through array of objects returned by AJAX
    for (let i = 0; i < validationList.length; i++) {
      //IF USER input uppercase strictly equal to stock symbol in AJAX return
      if (stockUC === responseTwo[i].symbol) {
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
      } else if( ($('.clear').removeClass('hide')) === true && ($('h2').removeClass('hide')) === true) {
        $('.clear').addClass('hide');
        $('h2').addClass('hide');
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
  const stockInput = $('#search-input').val().trim().toLowerCase();
  //URL for all data symbols on IEX trading
  const apiSymbols = 'https://api.iextrading.com/1.0/ref-data/symbols';
  //AJAX Call
  $.ajax({
    url: apiSymbols,
    method: 'GET'
  }).then(function (responseFour) {
    // const validationListTwo = responseFour;
    //Loop through array of objects returned by AJAX
    for (let i = 0; i < responseFour.length; i++) {
      //IF USER input uppercase strictly equal to stock symbol in AJAX return
      const currStock = responseFour[i].name.toLowerCase();
      if (currStock.match(stockInput)) {
        let stockSym = responseFour[i].symbol;
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
    }
  };
  });
}
$('#search-stock').on('click', searchStock);