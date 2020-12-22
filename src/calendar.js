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
   * @desc this template is shown when our component has content to display. If the view is dependent on route, 
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

          
          <i  class= "arrow left" @click="${(b) => this.GoToPrevYear()}"></i> 
          <h2>${this.year}</h2> 
          <i class= "arrow right" @click="${(c) => this.GoToNextYear()}" ></i>
          
          
        </div>


        <div class = "month">

         <i  class= "arrow left" @click="${(a) => this.GoToPrevMonth()}"></i> 
         <h2>${this.months[this.month]}</h2>
         <i class= "arrow right" @click="${(e) => this.GoToNextMonth()}"></i> 
        
        </div>

        

      </div> 

      <div class = "bottom">

        <table class = "days_table">
          <tr class = "days">
            <th>${this.daysinweek[0]}</th>
            <th>${this.daysinweek[1]}</th>
            <th>${this.daysinweek[2]}</th>
            <th>${this.daysinweek[3]}</th>
            <th>${this.daysinweek[4]}</th>
            <th>${this.daysinweek[5]}</th>
            <th>${this.daysinweek[6]}</th>
          </tr>

          <tr class = "dates">
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
          </tr>

        </table>

        
        
        
        

        <div class = "daysinMonth"></div>
          
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
    this.day = new Date();
    this.month = this.day.getMonth();
    this.year = this.day.getFullYear();

    //Selected date

    let selectedday = this.day;
    let selectedmonth = this.month;
    let selectedyear = this.year;


    //Array insitliastion of key values in a calendar using the current day as the reference point. 
    //this.years = [this.year, this.year+1, this.year + 2, this.year + 3];
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.daysinweek = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.numDays = [31, 28, 31,30,31,30,31,31,30,31,30,31];


  
    
  }

  /**
   * Function that populates the dates 
   */
  getDaysinMonth(){
    //set the current date to the first date of that month. 
    let firstdate = this.day.setDate(1);

    // Grab the first day of that same date
    let firstday = this.day.getDay();
    let month = this.day.getMonth();
    
    //Checks to see if leap year 
    if(this.year % 4 != 0){
      this.numDays[1] = 29;
    }

    /**Iterate through the for loop according to the number of 
     * 
     */

     const tr = this.shadowRoot().getAttribute();
    for(let i = 0; i <= this.numDays[month]; i++){
      


    }

   
    




  
    
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
    this._render();
    
  }

  /**
   * Function that goes to the next year
   */
  GoToNextYear(){
    this.year++;
    this._render();
  }

  /**
   * Function that goes to the previous year
   */
  GoToPrevYear(){
    this.year--;
    this._render();
  }


  connectedCallback() {
    //Initial render
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
