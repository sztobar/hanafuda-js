function changeTheme (darkcolor, lightcolor) {
	var tabs = document.getElementsByTagName("nav")[0].getElementsByTagName("ul")[0].getElementsByTagName("li");
	//tabs = tabs.getElementsByTagName("ul")[0].getElementsByTagName("li");
	//console.log('rgba(' + lightcolor + ')');
	for (var i = 0; i < tabs.length; ++i) {
		tabs[i].style.backgroundColor = 'rgb(' + lightcolor + ')';
		tabs[i].style.borderColor = 'rgb(' + lightcolor + ')';
	}

	var head = document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	var declarations = document.createTextNode('nav li:not(#this):hover {'
		+ 'background-image: -moz-linear-gradient(bottom,  rgba(' + lightcolor + ', 1) 50%,rgba(255, 255, 255, 0.5) 100%);'
		+ 'background-image: -webkit-gradient(linear, left bottom, left top, color-stop(50%,rgba(' + lightcolor + ', 1)), color-stop(100%,rgba(255, 255, 255, 1)));'
		+ 'background-image: -webkit-linear-gradient(bottom,  rgba(' + lightcolor + ', 1) 50%,rgba(255, 255, 255, 0.5) 100%);'
		+ 'background-image: -o-linear-gradient(bottom,  rgba(' + lightcolor + ', 1) 50%,rgba(255, 255, 255, 0.5) 100%);'
		+ 'background-image: -ms-linear-gradient(bottom,  rgba(' + lightcolor + ', 1) 50%,rgba(255, 255, 255, 0.5) 100%);'
		+ 'background-image: linear-gradient(to top,  rgba(' + lightcolor + ', 1) 50%,rgba(255, 255, 255, 0.5) 100%);'
		+ '}');
	
	style.type = 'text/css';

	if (style.styleSheet) {
  		style.styleSheet.cssText = declarations.nodeValue;
	} else {
		  style.appendChild(declarations);
	}

	head.appendChild(style);
	
	var frame = document.getElementById("frame");
	frame.style.backgroundImage = '-moz-linear-gradient(top,  rgba(' + darkcolor + ', 1) 0%, rgba(255, 255, 255, 1) 30px)';
	frame.style.backgroundImage = '-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(' + darkcolor + ', 1)), color-stop(30px,rgba(255, 255, 255, 1)))';
	frame.style.backgroundImage = '-webkit-linear-gradient(top,  rgba(' + darkcolor + ', 1) 0%,rgba(255, 255, 255, 1) 30px)';
	frame.style.backgroundImage = '-o-linear-gradient(top,  rgba(' + darkcolor + ', 1) 0%,rgba(255, 255, 255, 1) 30px)';
	frame.style.backgroundImage = '-ms-linear-gradient(top,  rgba(' + darkcolor + ', 1) 0%,rgba(255, 255, 255, 1) 30px)';
	frame.style.backgroundImage = 'linear-gradient(to bottom,  rgba(' + darkcolor + ', 1) 0%,rgba(255, 255, 255, 1) 30px)';

	var thistab = document.getElementById("this");
	thistab.style.backgroundColor = 'rgba(' + darkcolor + ', 1)';
	thistab.style.border = 'solid rgba(' + darkcolor + ', 1) 3px';
	thistab.style.borderBottom = 'none';

	var main = document.getElementById("main");
	main.style.borderLeft = '3px solid rgb(' + darkcolor + ')';
	main.style.borderRight = '3px solid rgb(' + darkcolor + ')';
	main.style.borderBottom = 'none';
	
	var bot = document.getElementById("whole");
	bot.style.borderBottom = '3px solid rgb(' + darkcolor + ')';
};