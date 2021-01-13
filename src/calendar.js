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


    this.selectedday = this.day;
    this.selecteddate = this.date; 
    this.selectedmonth = this.month;
    this.selectedyear = this.year; 


    //Array insitliastion of key values in a calendar using the current day as the reference point. 
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.daysinweek = [ 'Sun','Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.tableNames = ['dates A','dates B','dates C','dates D','dates E'];
    this.numDays = [31, 28, 31,30,31,30,31,31,30,31,30,31];


  }

  /**
   * Sets the top date for the calendar
   */
  _setDateTitle(){
    let date = this.selecteddate
    let month = this.selectedmonth;
    
    if(this.selectedmonth + 1 < 10){
      month = '0'+ (this.selectedmonth + 1).toString();
    }
    else{
      month = (this.selectedmonth + 1).toString();

    }
    // let currentDate = this.shadowRoot.querySelector(`.days_table .dates #_${this.selecteddate}`);
    // currentDate.classList.add("selected");
    // console.log(currentDate);
    
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
    
    //intial variable to check 
    let num = 1;
    
    //calls leap year check function
    this.leapyearCheck();

    //for loops that append the date to each row of the month by using a running count. 
    for(let j =0; j<5; j++){
      this.datesArray[j] = [];
      for(let i = 0; i<7; i++){
        //checks to see if the number is single digit, and modify it accordingly.
        if(num < 10 ){
          var place = '0' + num.toString();
        }
        else{
          place = num.toString();
        }
        
        this.datesArray[j][i]= place;
        
        num = num + 1; 

        if(num > this.numDays[this.month]){
          num = 1; 
        }
        
      }

    }

    
    let currentDate = this.shadowRoot.querySelector(`.days_table .dates #_${this.selecteddate}`)
    if(currentDate != null){
      if(this.month != this.selectedmonth){
        
        currentDate.removeAttribute("class");
      }
      else{
        currentDate.classList.add("selected");
      }

    }
    
    
  }

  /**
   * Following function highlights the selceted value when pressed 
   */
  highlightSelected(fill){

    let selected = this.shadowRoot.querySelector(`.days_table .dates #_${fill}`);
    let date = this.shadowRoot.querySelector(`.days_table .dates .selected`);


    if(date != null && date.classList.contains("selected")){
      date.style.removeProperty = 'background-color';
      date.removeAttribute("class");
    }
    
    //Updates the selected variables to 
    this.selectedmonth =  this.month;
    this.selectedyear = this.year; 
    this.selecteddate = fill; 
    
    selected.classList.add("selected");
    this._render(); 

  }
  
  /**
   * The calendar date function that fills 
   * all the appropriate days in.
   */
  _renderCalendar(){
    return html`
    
    <tr class = "days">
      ${this.daysinweek.map( (day) => html`<th> ${day} </th>`)}
    </tr>

    ${this.tableNames.map ( (name, i) => html `
    <tr class = "${name}">${this.datesArray[i] ? 
      this.datesArray[i].map( (fill) => html`
        <td id="_${fill}" @click="${ (b) => this.highlightSelected(fill)}"> ${fill} </td>`) : ''} 
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

/**
 * 
 * 
 * 
 * THE FOLLOWING CODE IS A LINKED LIST IMPLEMENTATION OF THE CALENDAR FUNCTION
 *  getDaysinMonth(){

    //displays calendar after one of the arrows have been pressed 
    let visibile = this.shadowRoot.querySelector('.bottom');
    visibile.style.visibility = 'visible';

    //variables to select the appropriate rows for each dataset 
    let days = this.shadowRoot.querySelector('.days_table .days');
    let dates = this.shadowRoot.querySelectorAll('.days_table .dates');
    let code = ['A','B','C','D','E'];
    let num = 0;

    //calls leap year check function 
    this.leapyearCheck();

    //for loop to fill the top line with days of the week
    for(let a = 0; a<this.daysinweek.length; a++){
      let day = this.shadowRoot.querySelector('.days_table .days td')
      day.innerHTML = '';
      day.textContent = this.daysinweek[a];
      days.appendChild(day);
    }

    for(let j =0; j<5; j++){
      for(let i = 0; i<7; i++){
        let date = this.shadowRoot.querySelector(`.days_table .dates.${code[j]} td`)
        date.innerHTML = '';
        
        
        
        num = num + 1;

                
        //listens for when a number is clicked and then changes the date at the top accordingly. 
        date.addEventListener('click', (e) =>{
          this.selected = this.shadowRoot.querySelector('.days_table .dates .selected');

          if(this.selected != null || date.classList.contains('selected')){
            this.selected.style.removeProperty = 'background-color';
            this.selected.classList.remove('selected');

          }
          
          this.selecteddate = date.innerHTML;
          this.selectedmonth = this.month;
          this.selectedyear = this.year;

          
          date.classList.add("selected");
          this._render();

        });

        //Checks to see if the count has reached the max amount of days and then resets the count. 
        if(num > this.numDays[this.month]){
          num = 1; 
        }

      
        //arranging the format of the first 9 numbers
        //then updates the string of the particular date. 
        if(num < 10){
          date.textContent =  '0' + num.toString();
        }
        else{
          date.textContent = num.toString();
        }
        //adds the string value to the list. 
        dates[j].appendChild(date);

      }

    }

    //falsey check 
    if(this.selected != null){
      if(this.month != this.selectedmonth){
        this.selected.style.removeProperty = 'background-color';
        this.selected.classList.remove('selected');
        
      }
      else{
        this.selected.style.addProperty = 'background-color';
        this.selected.classList.add('selected');

      }
    }
  }
    
*/