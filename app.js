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
  }).then(function(response) {
    //console.log response to test
  console.log(response);
    
    const companyName = response.quote.companyName;
    const stockSymbol = response.quote.symbol;
    const stockPrice = response.quote.latestPrice;
    const companyNews = response.news[0].headline;
    const logo = response.logo.url;

    // Creating a table to be appended displaying stock info

    const nameHolder = $('#stocks-table').html(`
      <tr>
        <td><img src="${logo}" /></td>
        <td>${companyName}</td>
        <td>${stockSymbol}</td>
        <td>${stockPrice}</td>
        <td>${companyNews}</td>
      </tr>)`);
   
    $('.stocks').append(nameHolder);
  });

}

// Function for displaying stock buttons initally when page loads
const render = function () {
  // Deleting the stocks prior to adding new stocks
  // (this is necessary otherwise you will have repeat buttons)
  $('#buttons-view').empty();
  // Looping through the array of stocks
  for (let i = 0; i < stocks.length; i++) {
    // Then dynamicaly generating buttons for each stock in the array
    const newButton = $('<button>'); 
    // Adding a class of stock-btn to our button
    newButton.addClass('stock-btn');  
    // Adding a data-attribute
    newButton.attr('data-name', stocks[i]);  
    // Providing the initial button text
    newButton.text(stocks[i]); 
    // Adding the button to the buttons-view div
    $('#buttons-view').append(newButton);
  }
}

// This function handles events where one button is clicked
// const addButton = function(event) {

//   // event.preventDefault() prevents the form from trying to submit itself.
//   // We're using a form so that the user can hit enter instead of clicking the button if they want
//   event.preventDefault();

//   // This line will grab the text from the input box
//   const stock = $('#stock-input').val().trim();
  
//   // The stock from the textbox is then added to our array
//   stocks.push(stock);

//   // Deletes the contents of the input
//   $('#stock-input').val('');

//   // calling render which handles the processing of our stock array
//   render();
// }

// // Even listener for #add-stock button
// $('#add-stock').on('click', addButton);

//This listener allows stock info to be appended when stock btn is pushed
$('#buttons-view').on('click', '.stock-btn', displayStockInfo); 

// Calling the renderButtons function to display the intial buttons
render();

const validateSymbol = function(event){
  event.preventDefault();
  const stock = $('#stock-input').val().trim();
  const stockUC = stock.toUpperCase();
  const apiSymbols = 'https://api.iextrading.com/1.0/ref-data/symbols';
  $.ajax({
    url: apiSymbols,
    method: 'GET'
  }).then(function (responseTwo) {
      const validationList = responseTwo;
   for(let i = 0; i < validationList.length; i++){
     if(stockUC === responseTwo[i].symbol){
       console.log(stock);
       stocks.push(stockUC);
       let newButtonHTML = $(`<button class="new-stock-btn" val="${stockUC}">${stockUC}
       </button>&nbsp;`); 
       newButtonHTML.on('click', displayStockInfo);
       $('#buttons-view').append(newButtonHTML);
       render();
       return;
     }else{
       $('#stock-input').val('');
     }
   }
  });
};
$('#add-stock').on('click', validateSymbol);

