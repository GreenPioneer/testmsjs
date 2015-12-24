#Theming/Styling

##Overview
We've set up this framework to automatically aggregate, compile and reference all styling files likes css, scss and less. You can use any of the styling syntax. We don't care. We made it easy for you to get going and style it out. Although we prefer usage of scss.

We wanted this mean framework to be UI framework agnostic. Meaning anyone should be able to choose different UI frameworks that suits their cup of tea and needs. We've used bootstrap as an example. Frameworks like bootstrap, zurb foundation and material interchangeable. The mean framework is not dependent on them.

##Global.styles.scss
This is the file where most of the magic will happen. This is where you will import framework styles, import custom variables override UI framework variables and define sitewide styles to create your custome theme.

##Module specific styling
In each module you can include a .scss file. This is where you can define module specific styles so that you can easily debug and change styles in development.

##Environment based compiling
As you get to a solid code base. We want some optimized code and file size. Setting the mean framework into a production state will compile and minify all the styling files.

For development module.style files will be compliled and referenced independently. Making it easy debug and find where the styling code is.