class SearchControl {

  map: any | undefined;
  container: HTMLElement | undefined;
  callback: any | undefined;

  constructor(callback: any) {
    this.callback = callback;
  }

  onAdd(map: any) {

    this.map = map;

    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

    const img = document.createElement('img');
    img.id = 'search-button'
    img.src = `./img/search.svg`;
    img.alt = '検索';

    img.addEventListener('click', () => {
      this.callback();
    });

    this.container.appendChild(img);

    return this.container;

  }

  onRemove() {

    if (this.container && this.container.parentNode) {

      this.container.parentNode.removeChild(this.container);
      this.container = undefined;

    }

  }
}

export default SearchControl;