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
    <style>
      .calendar-info{
        max-width: 500px; 
        height: 450px;
        border-style: solid;
      }
      .top{
        height: 145px;
        max-width: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        background-color: yellow;
      }
      .year, .month{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem 0 1rem;
        
      }
      
      .arrow {
        border: solid #D2544A;;
        border-width: 0 0.2rem 0.2rem 0;
        width: 0.6rem;
        height: 0.6rem;
        display: flex;
        padding: 0.2rem;
      }
      .arrow:hover{
        border: solid black;
        border-width: 0 0.2rem 0.2rem 0;
        cursor: pointer;
      }
      .right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
      }
      .left{
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
      }

      .bottom{
        display: flex;
        justify-content: center;

      }
      .days_table{
        display: flex;
        justify-content: space-between;
        align-items: center;s

      }
      
      

    </style>
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
          <tr>
            <th>${this.daysinweek[0]}</th>
            <th>${this.daysinweek[1]}</th>
            <th>${this.daysinweek[2]}</th>
            <th>${this.daysinweek[3]}</th>
            <th>${this.daysinweek[4]}</th>
            <th>${this.daysinweek[5]}</th>
            <th>${this.daysinweek[6]}</th>
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

    //empty array to load all days in a month
    this.days = []


    
    //Array insitliastion of key values in a calendar using the current day as the reference point. 
    //this.years = [this.year, this.year+1, this.year + 2, this.year + 3];
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.daysinweek = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  }


  //Function to go to the next month 
  GoToNextMonth(){
    this.month++;
    if(this.month > 11){
      this.month = 0;
      this.year++;
    }
    
    this._render();
    
  }

  //Function to go to the previous month
  GoToPrevMonth(){
    this.month--;
    if(this.month < 0){
      this.month = 11;
      this.year--;

    }
    this._render();
    
  }

  //Function to go to the next year.
  GoToNextYear(){
    this.year++;
    this._render();
  }

  //Function to go to the previous year
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


/**
 * .weekdays_end h3{
        display: grid;
        grid-template-columns: repeat(7. 1fr);
        text-align: center;
        display: inline-block;
        padding: 0px 15px 0px 15px;
      }
      
 */