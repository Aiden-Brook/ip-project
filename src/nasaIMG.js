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
                  image: data.collections.items[i].links[0].href,
                  name: data.collections.items[i].data[0].title,
                  description: data.collections.items[i].data[0].description,
                  photographer: data.collections.items[i].data[0].photographer,
                  secCreator: data.collections.items[i].data[0].secondary_creator,
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

      render() {
        return html`
          <div slot="page">
            <label for="Page">Page :</label>
            <input type="number" id="Page" />
          </div>
          ${this.view === 'list'
            ? html`
                <ul>
                  ${this.images.map(
                    item => html`
                      <li>
                        ${item.image} - ${item.page} - ${item.description} - ${item.name}
                        - ${item.photographer} - ${item.secCreator}
                      </li>
                    `
                  )}
                </ul>
              `
            : html`
                ${this.images.map(
                  item => html`
                    <accent-card image-src="${item.image}"> </accent-card>
                    <div slot="heading">${item.name}</div>
                    <div slot="content">${item.description}</div>
                    photographer="${item.photographer}"
                    secondary_creator="${item.secCreator}"
                  `
                )}
              `}
        `;
      }

}
customElements.define('nasa-image-search', nasaIMG);