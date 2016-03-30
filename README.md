Angularoid
==========

A word of warning
-----------------

This project is not production ready.

Motivation
----------

This module aims to improve the interoperability between AngularJS 1.0 and CommonJS Modules
and reduce the amount of boilerplate code that you have to write.

Export modules like you would normally and angularoid will determine the type of the file by
its name. Assign the function to module.exports and name the file
`\*.controller|service|factory|...|.js`. Angularoid will then create one entry file that you
can require in your app.

Usage
-----

angularoid --source [source folder] --dest [destination folder] --entry [entry file for including]
in your app.

Features
--------

* No more angular.module boilerplate when you already have a module system.
* Dependency injection is made minification safe.
* No need to require all files manually.
* Simplified testing with CommonJS modules.
* Angular is automatically required at the beginning of the sourced files.
