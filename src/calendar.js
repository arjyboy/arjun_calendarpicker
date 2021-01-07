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


          <h2> ${this.date} / ${this.month + 1} / ${this.year} </h2> 
          
          
        </div>


        <div class = "month">

         <i  class= "arrow left" @click="${(a) => this.GoToPrevMonth()}"></i> 
         <h2>${this.months[this.month]}</h2>
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
    this.day = new Date();

    this.date = this.day.getDate();
    this.month = this.day.getMonth();
    this.year = this.day.getFullYear();

  
    //Selected day
    this.selectedday = this.date;
    this.selectedmonth = this.month;

    //Array insitliastion of key values in a calendar using the current day as the reference point. 
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.daysinweek = [ 'Sun','Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.numDays = [31, 28, 31,30,31,30,31,31,30,31,30,31];


  }

  _renderCalendar(){
    return html`
    <tr class = "days">
      <td>Sun</td>
      <td>Mon</td>
      <td>Tues</td>
      <td>Wed</td>
      <td>Thu</td>
      <td>Fri</td>
      <td>Sat</td>
    </tr>

    <tr class = "dates A">
      <td>01</td>
      <td>02</td>
      <td>03</td>
      <td>04</td>
      <td>05</td>
      <td>06</td>
      <td>07</td>
    </tr>

    <tr class = "dates B">
      <td>08</td>
      <td>09</td>
      <td>10</td>
      <td>11</td>
      <td>12</td>
      <td>13</td>
      <td>14</td>
    </tr>

    <tr class = "dates C">
      <td>15</td>
      <td>16</td>
      <td>17</td>
      <td>18</td>
      <td>19</td>
      <td>20</td>
      <td>21</td>
    </tr>

    <tr class = "dates D">
      <td>22</td>
      <td>23</td>
      <td>24</td>
      <td>25</td>
      <td>26</td>
      <td>27</td>
      <td>28</td>
    </tr>

    <tr class = "dates E">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>

    `
  }

  /**
   * Function that populates the dates table, 
   */
  getDaysinMonth(){
    //Checks to see if leap year and updates the date array accordingly
    if(this.year % 4 == 0){
      this.numDays[1] = 29;
    }
    else{
      this.numDays[1] = 28;
    }

    //variables to select the appropriate rows for each dataset 
    let days = this.shadowRoot.querySelector('.days_table .days');
    let dates = this.shadowRoot.querySelectorAll('.days_table .dates');
    let code = ['A','B','C','D','E'];
 

    //for loop to fill the top line with days of the week
    for(let a = 0; a<this.daysinweek.length; a++){
      let day = this.shadowRoot.querySelector('.days_table .days td')
      day.innerHTML = '';
      day.textContent = this.daysinweek[a];
      days.appendChild(day);
    }

    //for loop that fills the numbers according to the amonut of days in a particular month 
    let num = 0;
    for(let j =0; j<5; j++){
      for(let i = 0; i<7; i++){
        let date = this.shadowRoot.querySelector(`.days_table .dates.${code[j]} td`)
        date.innerHTML = '';
        num = num + 1;

        //Checks to see if the count has reached the max amount of days and then resets the count. 
        if(num > this.numDays[this.month]){
          num = 1; 
        }

        //arranging the format of the first 9 numbers
        if(num < 10){
          date.textContent =  '0' + num.toString();
        }
        else{
          date.textContent = num.toString();
        }
        //adds the number value to the list.
        dates[j].appendChild(date);

      }

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
 */
