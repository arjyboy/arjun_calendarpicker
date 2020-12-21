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
        max-width: 350px; 
        height: 400px;
        border-style: solid;
        
      }
      .top{
        height: 145px;
        max-width: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        background-color: green;
      }
      .year{
        text-align: center;
        background-color: red;
      }
      .year:hover{
        background-color: #CE329F;
      }
      .month{
        background-color: yellow; 
        text-align: center;
        
      }
      .month:hover{
        background-color: #B3DD0F;
      }
      .arrow {
        border: solid black;
        border-width: 0 3px 3px 0;
        width: 10px;
        height: 10px;
        display: inline-block;
        padding: 3px;
      }
      .arrow:hover{
        background-color: blue;
      }
      .right {
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
      }
      .left{
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
      }
      

    </style>
    <div class="calendar-info">

      <div class = "top">

        <div class="year">
          <h2>${this.year}&nbsp; &nbsp; &nbsp;<i  class= "arrow left">
          </i> <i class= "arrow right">
          </i></h2>
          
        </div>

        <div class = "month">
          <h2>${this.months[this.month]} &nbsp; &nbsp; <i  class= "arrow left">
          </i> <i class= "arrow right">
          </i></h2>
        </div>

      </div>

      <div class = "bottom">

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

    
    //Array insitliastion of key values in a calendar using the current day as the reference point. 
    //this.years = [this.year, this.year+1, this.year + 2, this.year + 3];
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', "July", 'August', 'September', 'October', 'November', 'December'];



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

  connectedCallback() {
    //Initial render
    this.state = 'content';

    let nextmonth = this.shadowRoot.querySelector('.month .arrow.right');
    let prevmonth = this.shadowRoot.querySelector('.month .arrow.left');
    nextmonth.addEventListener('click', () => this.GoToNextMonth());
    prevmonth.addEventListener('click', () => this.GoToPrevMonth());
  }

  //Listen for these attributes
  static get observedAttributes() {
    return ['prop1', 'prop2', 'prop3'];
  }

  //React to attributes
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
  }

}

window.customElements.define('calendar-info', Calendar);