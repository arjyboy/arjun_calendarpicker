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
      .top{
        height: 400px;
        max-width: 350px;
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
      .arrow {
        border: solid black;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
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
          <h2>${this.years[1]}&nbsp; &nbsp; &nbsp;<i  class= "arrow left">
          </i> <i class= "arrow right">
          </i></h2>
          
        </div>

        <div class = "month">
          <h3>${this.months[1]} &nbsp; &nbsp; <i  class= "arrow left">
          </i> <i class= "arrow right">
          </i></h3>
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
    
    

    //Array insitliastion of key values in a calendar using the current day as the reference point. 
    this.years = [this.day.getFullYear(), this.day.getFullYear() + 1, this.day.getFullYear() + 2, this.day.getFullYear() + 3];
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', "July", 'August', 'September', 'October', 'November', 'December'];

    const next_month  = document.querySelector('.month .arrow right');
    const prev_month = document.querySelector('.month .arrow left')
  

  }



  connectedCallback() {
    //Initial render
    this.state = 'content';
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