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
    w.word = w.el.dataset.map||null;
    w.map = {};
    // ensure word has been provided
    if (w.word === null) {
      console.warn("HiddenChunks: `data-map` must be provided");
      return;
    }
    mapWord();
    generateWord();
    // bind and expose methods to the word
    //   usage: `document.getElementById('hiddenchunks').show();`
    w.el.show = __show.bind(w.el);
    w.el.hide = __hide.bind(w.el);


    function __show() {
      console.log('show', w.map);
    }

    function __hide() {
      console.log('hide', w.map);
    }

    function generateWord() {
      w.el.innerHTML = "";
      for (let i in w.map) {
        let chunk = generateChunk(w.map[ i ].chunk, w.map[ i ].hide);
        w.map[ i ].el = chunk;
        w.el.append(chunk);
      }
    }

    function generateChunk(chunk, hide) {
      let span = document.createElement("SPAN");
      span.className = "wordart__char"+(hide ? " wordart__char--hidden": "");
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
          "chunk": chunk.replace(/\[|\]/g, ""),
          "hide": !!chunk.match(/\[|\]/g)
        };
        sliceMap.shift();
      }
    }
  }
})();
