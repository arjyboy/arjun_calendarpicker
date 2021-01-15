import { html, render } from '../node_modules/lit-html/lit-html.js';
/**
 * @desc component template
 */
class Calendar extends HTMLElement {
  /**
     * @desc this is our base template. It sets the basic style such as the element height, width
     * and overall style. Everything happens inside this container
     */
  _template = () => html`
  <style>
    
  </style>
  <div class="container">
    ${this._getStateTemplate()}
  
  </div>
  `;

  /**
   * @desc this template is shown when our component is in an error state
   */
  _templateContentError = () => html`
    Error loading listing:
    ${!this._errorMessage ?
      'An unknown error has occured' :
      `${this._errorMessage}`
    }`;

  /**
   * @desc this template is shown when our component is in a loading state
   */
  _templateContentLoading = () => html`
    Loading
  `;

  /**
   * @desc this template is shown when our component has content to display. 
   * If the view is dependent on route, 
   * get the template from the route
   */
  _templateContent = () => html`
    <div class="content">
      ${this._getRouteTemplate()}
    </div>
  `;


  /**
   * @desc function to load content based on current state
   */
  _getStateTemplate() {
    switch (this._state) {
      case 'content':
        return this._templateContent();
      case 'error':
        return this._templateContentError();
      default:
        return this._templateContentLoading();
    }
  }

  /**
   * @desc draws page based on route
   */
  _getRouteTemplate(){
    return html`
    <style> @import "./src/stylesheet.css";</style>

    <div class="calendar-info">

      <div class = "top">

        <div class="year">

          <h2 class> ${this._setDateTitle()} </h2> 

        </div>

        <div class = "month">

         <i  class= "arrow left" @click="${(a) => this.GoToPrevMonth()}"></i> 
         <h2>${this.months[this.month]} ~ ${this.year}</h2>
         <i class= "arrow right" @click="${(e) => this.GoToNextMonth()}"></i> 
        
        </div>

      </div> 

      <div class = "bottom">

        <table class = "days_table">
          ${this._renderCalendar()}
        </table>

      </div> 
      
    </div>
    `
  }


  /**
   * @desc main render function
   */
  _render() {
    render(this._template(), this._shadowRoot);
  }

  /**
   * @desc changing state global will force a render
   */
  set state(state) {
    this._state = state;
    this._render();
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._state = 'loading';

    //Gets the current full date in the format ( mm , day, time, timezone, year)
    this.fulldate = new Date();

    //Store the day, month and year of the current date in variables 
    this.day = this.fulldate.getDay();
    this.date = this.fulldate.getDate();
    this.month = this.fulldate.getMonth();
    this.year = this.fulldate.getFullYear();

    //Creates a new empty array to fill in the dates of the month 
    this.datesArray = new Array();

    //Select variables that are used to store the current/selected date by the user. 
    this.selectedday = this.day;
    this.selecteddate = this.date; 
    this.selectedmonth = this.month;
    this.selectedyear = this.year; 


    //Array insitliastion of key values in a calendar using the current day as the reference point. 
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.daysinweek = ['Sun','Mon', 'Tues', 'Wed', 'Thu','Fri', 'Sat'];
    this.tableNames = ['dates A','dates B','dates C','dates D','dates E', 'dates F'];
    this.numDays = [31, 28, 31,30,31,30,31,31,30,31,30,31];


  }

  /**
   * Sets the top date for the calendar
   */
  _setDateTitle(){
    let date = this.selecteddate
    //converts the string into an integer, 10 represents the base number to convert the string to 
    let month = parseInt(this.selectedmonth, 10);
    
    
    if(month + 1 < 10){
      month = '0' + (month + 1).toString()
    }
    else{
      month = (month + 1).toString();

    }
    
    return date + ' / ' + month + ' / ' + this.selectedyear
  }

  
  /**
   * Checks to see if the year is a leap year. 
   */
  leapyearCheck(){
    
    //Checks what mod of 4 and then updates the value for feb accordingly 
    if(this.year % 4 == 0){
      this.numDays[1] = 29;
    }
    else{
      this.numDays[1] = 28;
    }
  }

  /**
   * Function that populates the months
   * with the dates and days. 
   */
  getDaysinMonth(){


    //initial variables to declare 
    var firstday = new Date(this.year, this.month, 1);
    let index = firstday.getDay(); 
    let num = 1;
    let month = this.month
    let year = this.year; 

    
    //calls leap year check function
    this.leapyearCheck();

    //for loops that append the date to each row of the month by using a running count. 
    for(let j = 0; j<6; j++){
      this.datesArray[j] = [];
      for(let i = 0; i<7; i++){


        //getting the first day of the month
        var nextday = new Date(year, month, num-index)
        var Year = nextday.getFullYear().toString();
        var Month = nextday.getMonth().toString();
        
        //checks to see if the number is single digit, and modifies it accordingly.
        if( num - index > 0 && num - index < 10 ){
          var date = '0' + nextday.getDate().toString();

        }
        else{
          date = nextday.getDate().toString();
        }
        
        
        this.datesArray[j][i]= {date: date,month: Month, year: Year};
        num = num + 1

        //checks to see if the count has reached the end of the month and then resets it. 
        if(num > this.numDays[this.month]){
          month = month + 1;
          num = 1; 
        }
        
      }//inner for loop

    }//end of for loop to load dates
    
    //var today = this.datesArray.find(t =>this.datesArray.date == this.date);

    //this.highlightRemove();


  }

  /**
   * Following function removes the highlighted date when the month is changed,
   * and puts the highlight back once 
   */
  highlightRemove(){
    let currentDate = this.shadowRoot.querySelector(`.days_table .dates #_${this.selecteddate}_${this.selectedmonth}`)
    let selectedDate = this.shadowRoot.querySelector(`.days_table .dates .selected`);
 
    //falsey check to ensure null references arent being passed through. 
    if(selectedDate != null){

      //checks to see if the two variables match with their selected variables
      if(this.month != this.selectedmonth || this.year != this.selectedyear && selectedDate.classList.contains("selected")){
        console.log("if");
        selectedDate.removeAttribute("class");
      }
      else{
        console.log("else");
        currentDate.classList.add("selected");

      }
      console.log(currentDate);
      console.log(selectedDate);
      
    }
    else{
      console.log("NULL is occuring");
    }

  }

  /**
   * Following function highlights the selceted value when pressed 
   */
  highlightSelected(fill){

    let dates = this.shadowRoot.querySelector(`.days_table .dates .selected`);
    let selected = this.shadowRoot.querySelector(`.days_table .dates #_${fill.date}_${fill.month}`);
    
    if(dates != null && dates.classList.contains("selected")){
      dates.style.removeProperty = 'background-color';
      dates.removeAttribute("class");
    }
    

    //Updates the selected variables accordingly. 
    this.selecteddate = fill.date;
    this.selectedmonth =  fill.month;
    this.selectedyear = fill.year; 
    
    selected.classList.add("selected");

    console.log(dates);
    console.log(selected);

    
    this._render(); 

  }
  
  /**
   * The calendar date function that fills 
   * all the appropriate days in.
   * 
   */
  _renderCalendar(){
    return html`

    <tr class = "days">
      ${this.daysinweek.map( (day) => html`<th> ${day} </th>`)}
    </tr>
    
    

    ${this.tableNames.map ( (name, i) => html `
    <tr class = "${name}">${this.datesArray[i] ? 
      this.datesArray[i].map( (fill) => html`
        <td id="_${fill.date}_${fill.month}" month="${fill.month}" @click="${ (b) => this.highlightSelected(fill)}"> ${fill.date} </td>`) : ''} 
    </tr>`)}

    `
  }


  /**
   * Function that goes to the next month 
   */
  GoToNextMonth(){
    this.month++;
    if(this.month > 11){
      this.month = 0;
      this.year++;
    }
    this.getDaysinMonth();
    this._render();
  }

  /**
   * Function that goes to the previous month 
   */
  GoToPrevMonth(){
    this.month--;
    if(this.month < 0){
      this.month = 11;
      this.year--;

    }
    this.getDaysinMonth();
    this._render();
    
  }

  connectedCallback() {
    //Initial render
    this.getDaysinMonth();
    this.state = 'content';

  }

  //Listen for these attributes
  static get observedAttributes() {
    return ['.month', '.year', '.arrow'];
  }

  //React to attributes
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
  }

}
window.customElements.define('calendar-info', Calendar);

