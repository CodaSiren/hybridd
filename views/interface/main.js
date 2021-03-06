// generates json login package
//
// (c)2016 metasync r&d / internet of coins

viewname = 'interface';
viewtarget = '#hy_frame > .main';

fs = require('fs');
lzma = require('../../lib/crypto/lz-string');

function addscript(file) {
  output = '<script>';
  output += fs.readFileSync(file);
  output += '</script>';
  return output;
}

function addsvg(file,index) {
  return 'svg["'+index+'"]=\''+String(fs.readFileSync(file)).replace(/\n/g," ")+'\';';
}

hy_content = ''; // variable to hold package content

// CSS
hy_content += '<style>';
hy_content += fs.readFileSync('./css/spinner.css');		// Spinner for loading screens in CSS
hy_content += fs.readFileSync('./css/clipboard.css');		// CLipboard transitions
// DEPRECATED: already included in login -> hy_content += fs.readFileSync('./css/purecss.css');		// PureCSS
hy_content += fs.readFileSync('./css/modal.css');		// CSS based modal boxes
hy_content += fs.readFileSync('./css/base.css');		// custom styling for Internet of Coins, base (mobile)
hy_content += fs.readFileSync('./css/600up.css');		// custom styling for Internet of Coins, tablet portrait
hy_content += fs.readFileSync('./css/900up.css');		// custom styling for Internet of Coins, tablet landscape
hy_content += fs.readFileSync('./css/1200up.css');		// custom styling for Internet of Coins, desktop
hy_content += fs.readFileSync('./css/1800up.css');		// custom styling for Internet of Coins, big desktop
hy_content += '</style>';

// JS
hy_content += addscript('../../lib/crypto/urlbase64.js');	    // URL safe base 64 encoding
hy_content += addscript('../../lib/crypto/decimal-light.js');	// arbitrary length decimals
hy_content += addscript('../../lib/crypto/hex2dec.js');	      // arbitrary length decimals
hy_content += addscript('../../lib/crypto/proof.js');	        // proof-of-work library

hy_content += '<script>';
hy_content += fs.readFileSync('./js/globalobjects.js');	// global objects/functions
hy_content += fs.readFileSync('./js/utils.js');
hy_content += "\n"+'pass_args = {};';
hy_content += 'init.interface = function(args) {';
hy_content += 'pass_args = args;';							        // pass args along DOM to toplevel buttons
hy_content += fs.readFileSync('./js/topmenu.js');			  // responsive top menu
hy_content += fs.readFileSync('./js/ychan.js');
hy_content += fs.readFileSync('./js/zchan.js');
hy_content += fs.readFileSync('./js/hybriddcall.js');		// autonomous calls to hybridd
hy_content += fs.readFileSync('./js/deterministic.js');
hy_content += fs.readFileSync('./js/assetInitialization.js');
hy_content += fs.readFileSync('./js/valuations.js');
hy_content += fs.readFileSync('./interface.js');	      // finally, take action
hy_content += '}'+"\n";
hy_content += '</script>';

hy_content += addscript('./js/sha256.js');          // fast SHA256 hashing
hy_content += addscript('./js/modal.js');           // pretty modal boxes
hy_content += addscript('./js/clipboard.js');       // copy-to-clipboard functionality
hy_content += addscript('./js/qrcode.js');          // create QR-code functionality
hy_content += addscript('./js/storage.js');         // browser-side storage (localforage)
hy_content += addscript('./js/transaction.js');     // deterministic transaction generator

// SVG
hy_content += '<script>';
hy_content += 'svg={};';
hy_content += fs.readFileSync('./../files/svg/black.js');
hy_content += addsvg('./svg/cogs.svg','cogs');
hy_content += addsvg('./svg/user.svg','user');
hy_content += addsvg('./svg/advanced.svg','advanced');
hy_content += addsvg('./svg/circle.svg','circle');
hy_content += addsvg('./svg/actions.svg','actions');
hy_content += addsvg('./svg/edit.svg','edit');
hy_content += addsvg('./svg/star.svg','star');
hy_content += addsvg('./svg/add.svg','add');
hy_content += addsvg('./svg/remove.svg','remove');
hy_content += addsvg('./svg/logout-alt.svg','logout-alt');
hy_content += addsvg('./svg/chevron-right.svg','chevron-right');

hy_content += addsvg('./svg/dashboard.svg','dashboard');
hy_content += addsvg('./svg/dashboard-o.svg','dashboard-o');
hy_content += addsvg('./svg/assets.svg','assets');
hy_content += addsvg('./svg/assets-o.svg','assets-o');
hy_content += addsvg('./svg/trade.svg','trade');
hy_content += addsvg('./svg/trade-o.svg','trade-o');
hy_content += addsvg('./svg/chat.svg','chat');
hy_content += addsvg('./svg/chat-o.svg','chat-o');
hy_content += addsvg('./svg/apps.svg','apps');
hy_content += addsvg('./svg/apps-o.svg','apps-o');
hy_content += addsvg('./svg/other.svg','other');
hy_content += addsvg('./svg/other-o.svg','other-o');
hy_content += addsvg('./svg/logout.svg','logout');
hy_content += addsvg('./svg/logout-o.svg','logout-o');

hy_content += addsvg('./svg/twitter.svg','twitter');
hy_content += addsvg('./svg/telegram.svg','telegram');
hy_content += addsvg('./svg/slack.svg','slack');
hy_content += addsvg('./svg/riot.svg','riot');
hy_content += addsvg('./svg/bitcointalk.svg','bitcointalk');

hy_content += 'document.querySelector("#logout-icon").innerHTML = svg[\'logout-o\'];';
hy_content += addsvg('./svg/send.svg','send');
hy_content += addsvg('./svg/receive.svg','receive');
hy_content += '</script>';

// load in the page elements *after* Javascript insertion
hy_content += fs.readFileSync('./'+viewname+'.html');

// encode hy_content using LZMA (file testing shows URL-safe coding uses 10% less kB)
lzma_result = lzma.compressToEncodedURIComponent(hy_content);

// sign LZMA string using server pubkey (or central package signing key?)


// put it all in json key-values
hy_json = { 'info' : 'compressed view', 'target':viewtarget, 'pack' : lzma_result };

// create login.json, use LastModified flag of server for caching???)
fs.writeFileSync('../'+viewname+'.json',JSON.stringify(hy_json));
