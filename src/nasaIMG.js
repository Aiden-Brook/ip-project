import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/accent-card/accent-card.js';

export class nasaIMG extends LitElement{
    
    constructor(){
        super();
        this.view = 'card';
        this.image = [];
        this.loadData = false;
        this.page = 1;
    }

    static getProperties(){
        return{
            view: {type:String, reflect: true},
            images: {type: Array},
            loadData: {type: Boolean, reflect: true, attribute: 'load-data',},
            page: {type: Number, reflect: true}
        }
    }

    updated(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
          if (propName === 'loadData' && this[propName]) {
            this.getData();
          }
          // when dates changes, fire an event for others to react to if they wish
          else if (propName === 'images') {
            this.dispatchEvent(
              new CustomEvent('results-changed', {
                detail: {
                  value: this.images,
                },
              })
            );
          }
        });
      }

      getData(){
          fetch(`https://images-api.nasa.gov/search?q=${this.name}&media_type=image&page=${this.page}`)
          .then(resp => {
            if (resp.ok) {
              return resp.json();
            }
            return false;
          })
          .then(data => {
            this.images = [];
            for (let i = 0; i < data.collections.items.length; i++) {
                const eventInfo = {
                  name: data.collections.items[i].title,
                  description: data.collections.items[i].description,
                  page: data.collections.items[i].page,
                  photographer: data.collections.items[i].photographer,
                  secCreator: data.collections.items[i].secondary_creator,
                };
                this.data.push(eventInfo);
            }

          });
      }

      resetData(){
          this.images = [];
          this.loadData = false;
      }

      static get styles() {
        return css`
          :host {
            display: block;
            border: 2px solid black;
            min-height: 100px;
          }
          :host([view='list']) ul {
            margin: 20px;
          }
        `;
      }

      render(){
        return html`
            ${this.view === 'list'
            ? html`
              <ul>
                ${this.images.map(
                  item => html`
                    <li>
                      ${item.image} - ${item.name} - ${item.description} ${item.photographer}
                      - ${item.secCreator}
                    </li>
                  `
                )}
              </ul>
              `
        : html`
            ${this.images.map(
              item => html`
                <accent-card image-src="${item.image}" accent-color="light-blue" style="max-width:600px;">
                <div slot="heading">${item.name}</div>
                <div slot="content">${item.description}</div>
                </accent-card>
              `
            )}
          `}
    `;
  }

}
customElements.define('nasa-image-search', nasaIMG);