var ClipboardJS = null;
var ClipboardStatus = {
  _props: {
    statusDiv: null
  },
  init: function () {
    ClipboardStatus._props.statusDiv = document.createElement("div");
    ClipboardStatus._props.statusDiv.setAttribute("class", "cc-clipboard-status");
    document.body.appendChild(ClipboardStatus._props.statusDiv);
  },
  show: function (text) {
    $(ClipboardStatus._props.statusDiv).text(text).fadeIn();
    setTimeout(function () {
      $(ClipboardStatus._props.statusDiv).fadeOut();
    }, 3000);
  }
};

$(function () {
  var contentString = "/content/";
  var contentIndex = location.href.toLowerCase().indexOf(contentString);
  var prefix = contentIndex !== -1 ? location.href.substring(0, contentIndex + contentString.length) : null;
  requirejs.config({
    paths: {
      'clipboard': prefix + 'resources/_topnav/cc_clipboard.min'
    }
  });
  require(['clipboard'], function (oClipboard) {
    ClipboardJS = oClipboard;
    ClipboardStatus.init();
    createClipboardButtons();
    createAnchors();
  });
});

function extractShellCommand(shellBlock) {
  var blockText = shellBlock.innerText || shellBlock.textContent;
  var blockLines = blockText.split("\n");
  var command = "";

  var includeNextLine = true;

  for (var j = 0; j < blockLines.length; j++) {
    var line = blockLines[j].trim();

    var cmdStart = line.startsWith("$ ");
    var lineBegin = (cmdStart ? 2 : 0);

    var lineBroken = (line.slice(-1) == "\\");
    var lineEnd = (lineBroken ? line.length - 1 : line.length);

    if (cmdStart && command != "") {
      command += " && ";
    }

    if (cmdStart || includeNextLine) {
      command += line.substring(lineBegin, lineEnd);
    }

    includeNextLine = lineBroken;
  }

  return command;
}

function extractIrbCommands(irbBlock) {
  var blockLines = irbBlock.innerText.split("\n");
  var command = "";

  for (var j = 0; j < blockLines.length; j++) {
    var line = blockLines[j];

    if (line.startsWith("irb")) {
      if (command != "") {
        command += "; ";
      }
      command += line.split(" # ")[0].substring(11, line.length);
    }
  }

  return command;
}

function createClipboardButton(block, clipboardText) {
  var btn = document.createElement("button");
  btn.setAttribute("class", "clipboard-button hover-button");
  btn.setAttribute("data-clipboard-text", clipboardText);
  block.parentNode.insertBefore(btn, block);

  var tooltip = document.createElement("span");
  tooltip.setAttribute("class", "tooltip-text arrow_box");
  tooltip.innerHTML = "Copy to clipboard";
  btn.appendChild(tooltip);

  var clipboard = new ClipboardJS(btn);
  clipboard
    .on('success', function (e) {
      ClipboardStatus.show('Copied successfully');
      e.clearSelection();
    })
    .on('error', function (e) {
      ClipboardStatus.show('Unable to copy');
      e.clearSelection();
    });
}

function getClipboardText(block) {
  var codeType = block.getAttribute("data-lang") || block.getAttribute("class");
  if (codeType == "shell") {
    return extractShellCommand(block);
  } else if (codeType == "ruby") {
    if (block.innerText.startsWith("irb")) {
      return extractIrbCommands(block);
    } else {
      return block.innerText || block.textContent;
    }
  } else {
    return block.innerText || block.textContent;
  }
}

function createClipboardButtons() {
  var codeBlocks = document.querySelectorAll("pre code");

  for (var i = 0; i < codeBlocks.length; i++) {
    var block = codeBlocks[i];
    createClipboardButton(block, getClipboardText(block));
  }
}

function updateClipboardButtons() {
  var buttons = document.getElementsByClassName("clipboard-button");

  [].forEach.call(buttons, function (btn) {
    var clipboardText = getClipboardText(btn.nextSibling);
    btn.setAttribute("data-clipboard-text", clipboardText);
  });
}

function createAnchors() {
  var headings = document.getElementsByClassName('col2-content')[0].querySelectorAll('h2,h3');

  for (var i = 0; i < headings.length; i++) {
    var heading = headings[i];
    var text = heading.textContent || headingthis.innerText;
    var id = heading.id || text.toLowerCase().trim().split(' ').join('-');
    var elem = document.createElement('SPAN');

    heading.id = id;
    heading.classList.add('cc-anchor-text');
    elem.id = id;
    elem.className = 'cc-anchor-link';
    elem.textContent = '';
    elem.setAttribute("data-clipboard-text", location.href.replace(location.hash, '') + '#' + id);
    heading.appendChild(elem);

    var tooltip = document.createElement("span");
    tooltip.setAttribute("class", "tooltip-text arrow_box");
    tooltip.innerHTML = "Copy bookmark";
    elem.appendChild(tooltip);

    var clipboard = new ClipboardJS(elem);
    clipboard
      .on('success', function (e) {
        ClipboardStatus.show('Copied successfully');
        e.clearSelection();
      })
      .on('error', function (e) {
        ClipboardStatus.show('Unable to copy');
        e.clearSelection();
      });
  }
}