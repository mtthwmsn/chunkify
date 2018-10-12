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

    function present(showHidden) {
      for (let i in w.map) if (w.map[ i ].hide === true) {
        if (showHidden === true) {
          w.map[ i ].el.classList.remove("hiddenchunks__chunk--hidden");
          w.map[ i ].isHidden = false;
        }
        else {
          w.map[ i ].el.classList.add("hiddenchunks__chunk--hidden");
          w.map[ i ].isHidden = true;
        }
      }
      w.el.dispatchEvent(w.onChange);
    }

    function __show(callback) {
      present(true);
      if (typeof callback === "function") {
        callback(w);
      }
    }

    function __hide(callback) {
      present(false);
      if (typeof callback === "function") {
        callback(w);
      }
    }

    function initWord() {
      w.el.innerHTML = "";
      for (let i in w.map) {
        let chunk = generateChunk(w.map[ i ].chunk);
        w.map[ i ].el = chunk;
        w.el.append(chunk);
      }
      // present word with hidden chunks
      present(false);
    }

    function generateChunk(chunk) {
      let span = document.createElement("SPAN");
      span.className = "hiddenchunks__chunk";
      span.innerHTML = (chunk === " " ? "&nbsp;" : chunk);
      return span;
    }

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
