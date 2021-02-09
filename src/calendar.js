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
  `

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
         <h2 @click="${(z) => this.EditCustomDate()}">${this._setDateTitle()} </h2>
         <h2><input id ="customDate" maxlength="8" placeholder="ddmmyyyy" @dblclick="${(b) => this.EditCustomDate()}" @keydown = "${(e) => this.setDate(e)}"></h2>
         
        </div><!-- end of year class -->

        
       
        

        <div class = "month">

         <i  class= "arrow left" @click="${(a) => this.GoToPrevMonth()}"></i> 
         <h2>${this.months[this.month]} ~ ${this.year}</h2>
         <i class= "arrow right" @click="${(e) => this.GoToNextMonth()}"></i> 
        
        </div><!-- end of month class -->

      </div><!-- end of top class -->

      <div class = "bottom">

        <table class = "days_table">
          ${this._renderCalendar()}
        </table>

      </div> <!-- end of bottom class -->
      
    </div><!-- end of calendar info class -->
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

    //sets the minimum year and maximum year of the calendar. 
    this._minYear = this.year - 100;
    this._maxYear = this.year + 100; 

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
    this.numDays = [31, 28, 31,30,31,30,31,31,30,31,30,31];
    
     //Name of rows, that will hold the dates  
     this.tableNames = ['dates A','dates B','dates C','dates D','dates E', 'dates F'];


  }

  /**
   * Follwing functions are setters for 
   */

  set minyear(year){
    this._minYear = year; 
    this._render();
  }

  set maxyear(year){
    this._maxYear = year; 
    this._render();
  }

  set _selecteddate(date){
    this.selecteddate = date; 
    this._render();
  }





/**
 * Following function changes the edit button and edits the chosen datee. 
 */
  EditCustomDate(){
    this.display = !this.display; 

    
    let customeedit = this.shadowRoot.querySelector(`.calendar-info .top .year input`);
    let datebanner = this.shadowRoot.querySelector(`.calendar-info .top .year h2`);
    
    if(this.display){
      customeedit.style.display = 'inline';
      datebanner.style.display = 'none';
      
    }
    else{
      customeedit.style.display = 'none';
      datebanner.style.display = 'inline';
      
    }
    

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

  // isCharacterALetter(char) {
  //   return (/[a-zA-Z]/).test(char);
  // }

  /**
   * Function to set the custome date after enter has been pressed
   * Keycode for numbers is from 48:57
   */
  setDate(event){
    if(event.keyCode == 13){
      //gets the value on the input field of the date has been submitted; 
      let inputvalue = this.shadowRoot.getElementById("customDate").value; 
      let custdate = inputvalue[0].toString() + inputvalue[1].toString();
      let custmonth = inputvalue[2].toString() + inputvalue[3].toString();
      let custyear = inputvalue[4].toString() + inputvalue[5].toString() + inputvalue[6].toString() + inputvalue[7].toString();

      //condition to make sure the month and year are within range. 
      if( (/[a-zA-Z]/).test(custyear) || (/[a-zA-Z]/).test(custmonth) || (/[a-zA-Z]/).test(custdate)){
        alert("Please enter numbers ONLY");
      }
      else if(custmonth > 12 || custmonth <= 0 ){
        alert('Please enter a valid month number from 1 to 12');
      }
      else if(custyear > this._maxYear || custyear < this._minYear){
        alert(`Please enter a valid year from ${this._minYear} to ${this._maxYear}`);
      }
      else{
        //Sets the custom dates to the appropriate variables and updates the calendar view accordingly. 
        this.selecteddate = custdate;
        this.selectedmonth = custmonth - 1;
        this.selectedyear = custyear;
        this.year = custyear; 
        this.month = custmonth - 1; 
        this.date = custdate; 
        this.getDaysinMonth();
        this._render();
      }
      
    }
    else{
      console.log("Doesnt work"); 
    }
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
        
      }//inner for loop ends 

    }//end of outter for loop to load dates

    this._render();


    //Waits for all dates to be added into the month and then executes the code below 
    //setTimeout(() => {
    var currentday = this.shadowRoot.querySelector(`.days_table .dates #_${this.selecteddate}_${this.selectedmonth}_${this.selectedyear}`);
    if(currentday != null){
      currentday.setAttribute("selected", "true");
    }
    
  }

  /**
   * Function to set the flag of dates belonging to the next month 
   */
  nextMonthFlag(fill){
    if(this.month == 11 && fill.month == 0){
      return true; 
    }
    else if(fill.month == this.month + 1){
      return true;
    }
    return false; 
  
  }

  /**
   * Function to set the flag of dates belonging to the previous month 
   */
  prevMonthFlag(fill){
    if(this.month == 0 && fill.month == 11){
      return true; 
    }
    else if(fill.month == this.month - 1){
      
      return true; 
  
    }
    return false; 

  }

  /**
   * Function to set the flag false or true depending on the current render of the calendar. 
  //  */
  highlightFlag(fill){
    //checks to se
    if(this.selectedmonth == fill.month && this.selectedyear == fill.year && this.selecteddate == fill.date){
      return true; 
    }
    else{
      return false; 
    }
    
  }

  /**
   * Following function highlights the selceted values. 
   */
  highlightSelected(fill){
    //Updates the selected variables accordingly. 
    this.selecteddate = fill.date;
    this.selectedmonth = fill.month;
    this.selectedyear = fill.year; 
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
        <td id="_${fill.date}_${fill.month}_${fill.year}" month="${fill.month}" ?selected = "${this.highlightFlag(fill)}" ?nextmonth ="${this.nextMonthFlag(fill)}"  
        ?prevmonth="${this.prevMonthFlag(fill)}" @click="${ (b) => this.highlightSelected(fill)}"> ${fill.date} </td>`) : ''} 
    </tr>`)}

    `
  }


  /**
   * Function that changes to the next month 
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
   * Function that changes to the previous month 
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

