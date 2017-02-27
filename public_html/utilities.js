var printHTML = function(fname, node) {
  var request = new XMLHttpRequest();
  request.open('GET', fname, true);
  request.onreadystatechange = function() {
    if (request.readyState !== 4) {
      return 0;
    }

    if (request.status === 200) {
      node.innerHTML = request.responseText;
    }
    else {
      console.log("printMarkdown status:", request.status);
      return 1;
    }
  }
  request.send();
}


var printMarkdown = function(fname, node) {
  var request = new XMLHttpRequest();
  request.open('GET', fname, true);
  request.onreadystatechange = function() {
    if (request.readyState !== 4) {
      return 0;
    }

    if (request.status === 200) {
      node.innerHTML = markdown.toHTML(request.responseText);
    }
    else {
      console.log("printMarkdown status:", request.status);
      return 1;
    }
  }
  request.send();
}

var printCSV = function (fname, node) {
  var request = new XMLHttpRequest();
  request.open('GET', fname, true);
  request.onreadystatechange = function() {
    if (request.readyState !== 4) {
      return 0;
    }

    if (request.status === 200) {
      node.innerHTML = "";

      //build the search bar
      var div = document.createElement("DIV");
      div.className = "ui action input";
      var input = document.createElement("INPUT");
      input.id = "searchInput";
      input.type = "text";
      input.placeholder = "Search...";
      div.appendChild(input);
      var button = document.createElement("BUTTON");
      button.id = "searchButton";
      button.className = "ui button";
      button.innerHTML = "Search";
      button.onclick = searchTable;
      div.appendChild(button);

      var table = parseCSVToTable(request.responseText, ';');
      table.id = "table";
      table.className = "ui celled table unstackable";

      var scrollable = document.createElement("DIV");
      scrollable.className = "scrollable";

      scrollable.appendChild(table);
      node.appendChild(div);
      node.appendChild(scrollable);

      var sorter = tsorter.create("table");
    }
    else {
      console.log("printCSV status:", request.status);
      return 1;
    }
  }
  request.send();
}

var parseCSVToTable = function(csvText, delim) {
  //split
  var allLines = csvText.split(/\r\n|\n/);

  //error fix
  if (allLines[allLines.length -1] == '') {
    allLines.pop();
  }

  //convert into an array of usable lines
  var lines = [];
  while(allLines.length) {
    lines.push(allLines.shift().split(delim));
  }

  //finally, parse lines into a table
  var table = document.createElement("table");
  var tbody = table.createTBody(-1);

  for (var i = 0; i < lines.length; i++) {
    //insert th objects
    if (i == 0) {
      var thead = table.createTHead(-1);
      var row = thead.insertRow(0);
      for (var j = 0; j < lines[i].length; j++) {
        var cell = document.createElement("TH");
        cell.innerHTML = lines[i][j];
        row.appendChild(cell);
      }
    }

    //insert td objects
    if (i != 0) {
      var row = tbody.insertRow(-1);
      for (var j = 0; j < lines[i].length; j++) {
        var cell = row.insertCell(-1);
        cell.appendChild(document.createTextNode(lines[i][j]));
      }
    }
  }

  //return the table element
  return table;
}

function searchTable() {
  var input = document.getElementById("searchInput");
  var table = document.getElementById("table");

  var filter = input.value.toUpperCase();
  var trows = table.getElementsByTagName("tr");

  for (var i = 1; i < trows.length; i++) {
    var tds = trows[i].cells;
    trows[i].style.display = "none";
    for (var j = 0; j < tds.length; j++) {
      if (tds[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
        trows[i].style.display = "";
      }
    }
  }
}
