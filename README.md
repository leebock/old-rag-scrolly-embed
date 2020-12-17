# scroll-driven-3d

This sample application demonstrates scrolling as a means of navigating an ArcGIS 3D web scene.

https://leebock.github.io/scroll-driven-3d/

## Deployment

The primary file types in this repo are **html**, **css**, and **javascript**.  To deploy, simply copy the folder to a web server directory.

## Notes for developers

* This is a simple [JAMstack](https://jamstack.org/) project, consisting only of vanilla javascript (no frameworks)

* The *html*, *css*, and *javascript* files in this project do not require build scripts.  Source files can be edited and re-deployed with modifications.

	* Note: *Css* developers have an alternative to working with the css code directly. If you're familiar with [Sass](https://sass-lang.com/) (which we use for convenience in developing our css), you can work with the *scss* source files provided (in the *scss* folder).
	
	* Once you have installed Sass, use this command to watch and re-compile the scss file into css:
	
	          *sass --watch scss\main.scss:css\main.css*

