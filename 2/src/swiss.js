function getColor(color, random) {
   var schemes = {
      "warmsplit": ["#ff0000", "#ffff00", "#ff6600", "#00ffff"],
      "coolsplit": ["#0000ff", "#0099ff", "#00ccff", "#ff3300"],
      "green": ["#003300", "#33cc00", "#99ff99", "#00ff00"],
      "mono": ["#000000", "#ffffff", "#d0d0d0", "#c0c0c0", "#303030", "#808080"],
      "redgreen": ["#ff0000", "#ffffff", "#006600", "#33cc33"],
      "blueorange": ["#00ffff", "#33ffff", "#99ffff", "#ff9900", "#ffff00"],
   };
   var seed = Math.floor(Math.random() * 1000000);
   var random = Alea(seed);
   if (color == "random" || !(color in schemes))
      return "#" + Math.floor(random() * 0xffffff).toString(16);
   return schemes[color][Math.floor(random() * schemes[color].length)];
}