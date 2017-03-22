//global markdown object and configuration
var markdown = window.markdownit()
  //configure for semantic-style visibility controls
  .use(window.markdownitContainer, 'mobileOnly', {
    validate: function(params) {
      return params.trim().match(/^mobileOnly$/);
    },
    render: function (tokens, idx) {
      if (tokens[idx].nesting === 1) {
        //opening tag
        return '<div class="mobileOnly">';
      } else {
        // closing tag
        return '</div>';
      }
    }
  });

//PARAM: fname = file to load with an ajax requesti
//PARAM: node = DOM node to store the resulting data
function printHTML(fname, node) {
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
      console.log("printHTML status:", request.status);
      return 1;
    }
  }
  request.send();
}

//PARAM: fname = file to load with an ajax request
//PARAM: node = DOM node to store the resulting data
function printMarkdown(fname, node) {
  var request = new XMLHttpRequest();
  request.open('GET', fname, true);
  request.onreadystatechange = function() {
    if (request.readyState !== 4) {
      return 0;
    }

    if (request.status === 200) {
      node.innerHTML = markdown.render(request.responseText);
    }
    else {
      console.log("printMarkdown status:", request.status);
      return 1;
    }
  }
  request.send();
}

//PARAM: fname = file to load with an ajax request
//PARAM: node = DOM node to store the resulting data
function printCSV(fname, node) {
  var request = new XMLHttpRequest();
  request.open('GET', fname, true);
  request.onreadystatechange = function() {
    if (request.readyState !== 4) {
      return 0;
    }

    if (request.status === 200) {
      node.innerHTML = "";

      var table = parseCSVToTable(request.responseText, ';');
      table.id = "table";
      table.className = "ui celled table unstackable";

      var scrollable = document.createElement("DIV");
      scrollable.className = "scrollable";

      scrollable.appendChild(table);
      node.appendChild(buildSearchBar(searchTable, "table"));
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

//PARAM: csvText = CSV text to be parsed, with delim as the delimiter
//PARAM: delim = delimiter of csvText
function parseCSVToTable(csvText, delim) {
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

//PARAM: searchCallback = function to call on search
//  ARG: inputValue = text to search for
//  ARG: callbackArg (optional) = callbackArg passed to buildSearchBar
//PARAM: callbackArg (optional) = passed to searchCallback as 2nd arg
function buildSearchBar(searchCallback, callbackArg) {
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
  button.onclick = () => { searchCallback(input.value, callbackArg); };
  div.appendChild(button);
  return div;
}

//PARAM: searchText = text to search for
//PARAM: tableID = id of table to search
function searchTable(searchText, tableID) {
  var table = document.getElementById(tableID);

  var filter = searchText.toUpperCase();
  var tRows = table.getElementsByTagName("tr");

  for (var i = 1; i < tRows.length; i++) {
    var tdArray = tRows[i].cells;
    tRows[i].style.display = "none";
    for (var j = 0; j < tdArray.length; j++) {
      if (tdArray[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
        tRows[i].style.display = "";
      }
    }
  }
}
