(function() {
  "use strict";

  let words = Array.from(document.getElementsByClassName("chunkify"));
  words.forEach(word => new Chunkify(word));

  /**
   * Chunkify() is the main constructor method
   *
   * @param object el
   * @return bool false if no word to chunkify
   */
  function Chunkify(el) {
    var w = {};
    w.el = el;
    w.word = (w.el.dataset.map||w.el.innerHTML).trim();
    w.map = {};
    // class added to chunks wrapped in parenthesis
    w.parenthesisedClass = "chunkify__chunk--";
    w.parenthesisedClass += (w.el.dataset.parenthesisedClass||"parenthesised");
    // ensure word has been provided
    if (! w.word.length) return;
    // map chunks from the word
    mapWord();
    // generate HTML and initialise
    initWord();

    /**
     * initWord() iterates the `map` object to generate HTML for each chunk
     *
     * @return void
     */
    function initWord() {
      w.el.innerHTML = "";
      for (let i in w.map) {
        let chunk = generateChunk(i);
        if (w.map[ i ].raw.match(/\[|\]/g))
          chunk.classList.add(w.parenthesisedClass);
        w.el.append(chunk);
        w.map[ i ].el = chunk;
      }
    }

    /**
     * generateChunk() generates HTML for each chunk
     *
     * @param int i - the index of the chunk in the map
     * @return object span
     */
    function generateChunk(i) {
      let span = document.createElement("SPAN");
      span.className = "chunkify__chunk";
      span.dataset.index = i;
      span.innerHTML = (w.map[ i ].chunk === " " ? "&nbsp;" : w.map[ i ].chunk);
      return span;
    }


    /**
     * mapWord() parses the map provided (either by `data-map` or `innerHTML`)
     * into chunks
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
          "chunk" : chunk.replace(/\[|\]/g, ""),
          "raw"   : chunk
        };
        sliceMap.shift();
      }
    }
  }
})();
