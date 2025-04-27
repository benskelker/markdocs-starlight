/**
  * ScriptName: postBuildFixSec.js
  * By: Shlomo Sagir, "Tech-Tav Documentation, Ltd."
  * Copyright 2017 (All rights reserved)
  * Command Line: cscript.exe postBuildFixSec.js //Nologo PathToOutputFolder
  **/

var terms = [
  {
    "find":/<head>/g,
    "replace":"<head>\r\n        <script>if(location.href!=encodeURI(decodeURI(location.href)))location.href=encodeURI(decodeURI(location.href));</script>"
  }
];

var debugMode = false;
var logFile = "";
var logLevel = 1;
var sExt = "htm", iExt = sExt.length;
var sError = WScript.ScriptName + "::Error: ";
var fso = new ActiveXObject("Scripting.FileSystemObject");
var wsh = new ActiveXObject("WScript.Shell");
var oArgs = WScript.Arguments;
var sFolder = (oArgs.length===1) ? oArgs(0) : null;

if (!/^\w:\\/.test(sFolder)) {
  sFolder = wsh.currentDirectory +
    ((sFolder.substr(0,1)==="\\") ? "" : "\\") +
    sFolder;
}

lfh = fso.CreateTextFile(sFolder + "\\postBuildFixSec.log.txt", true);
log('sFolder:: ', sFolder);
if (sFolder) {
  log(WScript.ScriptName + ":: Started");
  log("Folder::" + sFolder);
  processFolder(sFolder, false);
  processFolder(sFolder + "\\Content", true);
  log(WScript.ScriptName + ":: Finished");
} else
log(sError + "Missing Parameter - You must specify the path to the topics folder in the Projects Content folder");
lfh.Close();

function processFolder(sFolder, deep) {
  var f, fc, fn;
  var fn;

  if (!fso.FolderExists(sFolder) || !(f = fso.GetFolder(sFolder))) {
      log(sError + "Unable to open topics folders");
      return;
  }

  if (deep) {
    for (fc = new Enumerator(f.SubFolders); !fc.atEnd(); fc.moveNext()) {
        processFolder(sFolder + "\\" + fc.item().name, deep);
    }
  }

  for (fc = new Enumerator(f.files); !fc.atEnd(); fc.moveNext()) {
      fn = fc.item().name;
      if (fn.substr(fn.length-iExt, iExt)===sExt) {
          writeHTM(sFolder + "\\" + fn, processHTM(sFolder + "\\" + fn));
      }
  }
}

function processHTM(sFilename) {
  var s = t = readHTM(sFilename);
  for (var i=0;i<terms.length;i++) {
      s = s.replace(terms[i].find,terms[i].replace);
  }
  return {"html": s, "writeReq": s!==t};
  }

  function readHTM(sFilename) {
  var ForReading = 1;
  var fh = fso.OpenTextFile(sFilename, ForReading);
  var s = fh.ReadAll();

  fh.Close();

  return s;
  }

  function writeHTM(sFilename, result) {
  var fh;

  log("  " + sFilename + " [" + (result.writeReq ? "Modified" : "Unchanged") + ']');
  if (!result.writeReq) return;

  if (debugMode) {
      log(WScript.ScriptName + "::\n[" + sFilename + "]:\n" + result.html + "\n", 2);
      return;
  }

  if (fso.FileExists(sFilename)) {
      fh = fso.GetFile(sFilename);
      fh.Delete();
  }

  fh = fso.CreateTextFile(sFilename, true);
  fh.Write(result.html);
  fh.Close();
}

function log(sMessage, iLevel) {
  var l = iLevel || 1;
  if (logLevel >= l) {
    WScript.Echo(sMessage);
    lfh.WriteLine(sMessage);
  }
}