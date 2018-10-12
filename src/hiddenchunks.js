(function() {
  "use strict";

  let words = Array.from(document.getElementsByClassName("hiddenchunks"));
  words.forEach(word => new HiddenChunks(word));

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

    function generateWord() {
      w.el.innerHTML = "";
      for (let i in w.map) {
        w.el.append(generateChunk(w.map[ i ].chunk, w.map[ i ].hidden));
      }
    }

    function generateChunk(chunk, hidden) {
      let span = document.createElement("SPAN");
      span.className = "wordart__char"+(hidden ? " wordart__char--hidden": "");
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
          "hidden": !!chunk.match(/\[|\]/g)
        };
        sliceMap.shift();
      }
    }
  }
})();
