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

    </style>
    <div class="content">
      
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
    return ['prop1', 'prop2', 'prop3'];
  }

  //React to attributes
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
  }

}

window.customElements.define('u-template', UTemplate);