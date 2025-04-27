/**
 * ScriptName: genSitemap.js
 * By: Shlomo Sagir, "Tech-Tav Documentation, Ltd."
 * Copyright 2018 (All rights reserved)
 * Command Line: cscript.exe //Nologo genSitemap.js PathToOutputFolder
 **/

var logFile = "";
var logLevel = false;
var sError = WScript.ScriptName + "::Error: ";
var fso = new ActiveXObject("Scripting.FileSystemObject");
var wsh = new ActiveXObject("WScript.Shell");
var oArgs = WScript.Arguments;
var sFolder = null;

var coveo = {
  initialized: false,
  products: {
    'AAM-CP': "Credential Providers",
    'AAM-DAP': "Conjur Secrets Provider Enterprise",
    'Alero': "Remote Access",
    'CEM': "Cloud Entitlements Manager",
    'EPM': "Endpoint Privilege Manager (SaaS)",
    'EPM-onprem': "Endpoint Privilege Manager (On-prem)",
    'Idaptive': "Identity",
    'PrivCloud': "Privilege Cloud",
    'PAS': "Privileged Access Security",
    'PTA': "Privileged Threat Analytics",
	'SWS': "Secure Web Sessions",
	'DPA': "Dynamic Privileged Access"
    },
  template:
    "        <coveo:metadata>\r\n" +
    "            <title>VAR_TITLE</title>\r\n" +
    "            <topic_type>VAR_TYPE</topic_type>\r\n" +
    "            <lang>VAR_LANG</lang>\r\n" +
    "            <version>VAR_VERSION</version>\r\n" +
    "            <modifiedDate>VAR_DATE</modifiedDate>\r\n" +
    "            <product>VAR_PRODUCT</product>\r\n" +
    "            <component>VAR_COMPONENT</component>\r\n" +
    "        </coveo:metadata>"
};
var sCover;

if (oArgs.length === 1) {
  sFolder = oArgs(0);
} else {
  log(sError + "You must specify the path to the sitemap file");
}

lfh = fso.CreateTextFile(sFolder + "\\genSitemap.log.txt", true);
log('sFolder:: ', sFolder);
if (sFolder) {
  log(WScript.ScriptName + ":: Started");
  log("CurrentPath:: " + fso.GetAbsolutePathName("."));
  log("Sitemap:: " + sFolder + "\\Sitemap.xml");
  processTocFile(sFolder + "\\Sitemap.xml");
} else
lfh.Close();

function processTocFile(sFilename) {
  log("sFilename:: " + sFilename);
  var sXml = readHTM(sFilename);
  var aXml = sXml.split('\r\n');
  log('aXml:: '+aXml.length);
  var aDel = [];
  var sTopic, sTopicFile;
  for (var i = 0; i < aXml.length; i++) {
    if (/^<urlset/.test(aXml[i])) {
      aXml[i] = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:coveo="https://www.coveo.com/schemas/metadata">'
    }
    if (/<\/loc>$/.test(aXml[i])) {
      var data = aXml[i].match(/OnlineHelp\/(.+?)\/(.+?)\/(.+?)\/(.+)<\/loc>$/);
      if (!coveo.initialized) {
        coveo.template = coveo.template.replace('VAR_PRODUCT', coveo.products[data[1]]);
        coveo.template = coveo.template.replace('VAR_VERSION', data[2]);
        coveo.template = coveo.template.replace('VAR_LANG', data[3]);
        coveo.initialized = true;
      }
      if ((!/\.htm<\/loc>$/.test(aXml[i])) && (!/\.html<\/loc>$/.test(aXml[i])))
      {
        //log('REQ DEL:: ' + i + ':' + ':' + aDel.length + aXml[i]);
        aDel.push(i);
      } else {
        sCoveo = coveo.template;
        sTopicFile = sFolder + "\\" + data[4].replace(/\//g, '\\');
        log('sTopicFile::'+sTopicFile);
        sTopic = readHTM(sTopicFile);
        
        sCoveo = sCoveo.replace('VAR_TITLE', getData(sTopic, /<h\d>(?:<a name=".+?"><\/a>)?(.+?)<\/h\d>/));
        sCoveo = sCoveo.replace('VAR_TYPE', getData(sTopic, /<meta name="TopicType" content="(.+?)" \/>/));
        sCoveo = sCoveo.replace('VAR_DATE', getData(sTopic, /<meta name="ModifiedDate" content="(.+?)" \/>/));
        sCoveo = sCoveo.replace('VAR_COMPONENT', getData(sTopic, /<meta name="Component" content="(.+?)" \/>/));
        aXml.splice(i+1, 0, sCoveo);
      }
    }
  }
  var iDel = aDel.length;
  for (var j = 0; j < iDel; j++) {
    var d = aDel.pop() - 1;
    //log('DEL:: ' + j + ':' + d + ':' + aXml.length + ':' + aXml[d+1]);
    aXml.splice(d, 3);
  }
  log("ARRAY::\n" + aXml.join('\r\n'));
  writeHTM(sFilename, aXml.join('\r\n'));
}

function getData(sText, re) {
  return re.test(sText) ? sText.match(re)[1] : "";
}

function readHTM(sFilename) {
  var ForReading = 1;
  var rv;
  
  try {
	var fh = fso.OpenTextFile(sFilename, ForReading);
	rv = fh.ReadAll();
	fh.Close();
  } catch(err) {
	rv = "";
	log("readHTML::FAILED:"+sFilename);
  }
  
  return rv;
}

function writeHTM(sFilename, sXml) {
  var fh;

  if (fso.FileExists(sFilename)) {
    fh = fso.GetFile(sFilename);
    fh.Delete();
  }

  fh = fso.CreateTextFile(sFilename, true);
  fh.Write(sXml);
  fh.Close();
}

function log(sMessage, iVerbose) {
  iVerbose = iVerbose || true;
  if (logLevel >= iVerbose) WScript.Echo(sMessage);
  lfh.WriteLine(sMessage);
}