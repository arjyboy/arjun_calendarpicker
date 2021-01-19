import { html, render } from '../node_modules/lit-html/lit-html.js';

class CalendarSlider extends HTMLElement{
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
        .content{
          display: flex; 
          
        }
        ._year,._month,._date{
          display: flex;
          padding: 1rem 0 1rem 1rem;
          border: groove;
          border-width: 1rem 0 1rem 0;
          justify-content: space-between; 
          align-items: center;
            
        }
        h2{
          padding: 20px;
        }
        .arrow{
           
          color: black; 
          border: solid;
          border-width: 1rem 1rem 0 0;
          width: 1rem;
          height: 1rem;
            
        }
        .arrow.top{
          transform: rotate(-45deg);
        }
        .arrow.bottom{
          transform: rotate(135deg);
        }
        .arrow:hover{
          color: red; 
        }
        

    </style>
    <div class="content">
        
        <div class = "_date">
            <i class = "arrow top"></i>
            <h2>Date</h2>
            <i class = "arrow bottom"></i>
        </div>

        <div class="_month">
            <i class = "arrow top"></i>
            <h2> Month </h2>
            <i class = "arrow bottom"></i>
        </div>

        <div class = "_year">
            <i class = "arrow top"></i>
            <h2>Year</h2> 
            <i class = "arrow bottom"></i>
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
  }

  connectedCallback() {
    //Initial render
    this.state = 'content';
  }

  //Listen for these attributes
  static get observedAttributes() {
    return ['.left', '.middle', '.right'];
  }

  //React to attributes
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
  }


}

window.customElements.define('calendar-slider', CalendarSlider);

