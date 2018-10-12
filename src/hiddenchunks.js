(function() {
  "use strict";

  let words = Array.from(document.getElementsByClassName("hiddenchunks"));
  words.forEach(word => new HiddenChunks(word));

  /**
   * HiddenChunks() is the main constructor method
   *
   * @param object el
   * @return bool false if `data-map` is not defined
   */
  function HiddenChunks(el) {
    var w = {};
    w.el = el;
    w.word = (w.el.dataset.map||w.el.innerHTML).trim();
    w.map = {};
    w.showHiddenChunks;
    // ensure word has been provided
    if (! w.word.length) return;
    // create a new event for `change` of progress bar
    w.onChange = new Event("change");
    // map chunks from the word
    mapWord();
    // generate HTML and initialise
    initWord();
    // bind and expose methods to the word
    //   usage: `document.getElementById('hiddenchunks').show();`
    w.el.show = __show.bind(w.el);
    w.el.hide = __hide.bind(w.el);

    /**
     * present() shows or hides hidden chunks depending on value of `showHidden`
     *
     * @param showHiddenChunks bool
     * @return void
     */
    function present(showHiddenChunks) {
      if (showHiddenChunks === w.showHiddenChunks) return;
      w.showHiddenChunks = showHiddenChunks;
      for (let i in w.map) if (w.map[ i ].hide === true) {
        w.map[ i ].isHidden = !w.showHiddenChunks;
        if (w.showHiddenChunks === true)
          w.map[ i ].el.classList.remove("hiddenchunks__chunk--hidden");
        else
          w.map[ i ].el.classList.add("hiddenchunks__chunk--hidden");
      }
      w.el.dispatchEvent(w.onChange);
    }

    /**
     * __show() is the method exposed to the element to show hidden chunks
     *
     * @param fn callback
     * @return void
     */
    function __show(callback) {
      present(true);
      if (typeof callback === "function") {
        callback(w);
      }
    }

    /**
     * __hide() is the method exposed to the element to hide hidden chunks
     *
     * @param fn callback
     * @return void
     */
    function __hide(callback) {
      present(false);
      if (typeof callback === "function") {
        callback(w);
      }
    }

    /**
     * initWord() iterates the `map` object to generate HTML for each chunk
     *
     * @return void
     */
    function initWord() {
      w.el.innerHTML = "";
      for (let i in w.map) {
        let chunk = generateChunk(i);
        w.map[ i ].el = chunk;
        w.el.append(chunk);
      }
      // present word with hidden chunks
      present(false);
    }

    /**
     * generateChunk() generates HTML for each chunk
     *
     * @param int i - the index of the chunk in the map
     * @return object span
     */
    function generateChunk(i) {
      let span = document.createElement("SPAN");
      span.className = "hiddenchunks__chunk hiddenchunks__chunk-index-"+i;
      span.innerHTML = (w.map[ i ].chunk === " " ? "&nbsp;" : w.map[ i ].chunk);
      return span;
    }


    /**
     * mapWord() parses the map provided (either by `data-map` or `innerHTML`)
     * and splits into chunks with a prop to say if the chunk should be hidden
     *
     * @param object chunk
     * @return object span
     */
    function mapWord() {
      let m, r = /(\[.*?\])/g, sliceMap = [0];
      while ((m = r.exec(w.word)) !== null) {
        sliceMap.push(m.index, (m.index + m[0].length));
      }
      sliceMap.push(w.word.length);
      sliceMap = sliceMap.filter((i, x, a) => { return a.indexOf(i) === x; });

      while (sliceMap.length > 1) {
        let chunk = w.word.substring(sliceMap[0], sliceMap[1]);
        w.map[ Object.keys(w.map).length ] = {
          "chunk"    : chunk.replace(/\[|\]/g, ""),
          "hide"     : !!chunk.match(/\[|\]/g)
        };
        sliceMap.shift();
      }
    }
  }
})();
