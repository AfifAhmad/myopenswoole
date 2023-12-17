const webpack = require('webpack');
const path = require('path');

const port = process.env.PORT || 3000;

let files = [
    {
        input : './account/login.js',
        output : 'account/login.js'
    }
];

var Modules = [];
files.forEach(function(file){
    Modules.push({
        mode: 'development',
        entry: file.input,
        output: {
            library: 'Main',
            path : path.join(__dirname ,  '../static/myassets/js/react'),
            filename: ""+file.output
        },  
        module: {
            // exclude node_modules
            rules: [
                {
                    test: /\.(js|jsx)$/,         // <-- added `|jsx` here
                    exclude: /node_modules/,
                    use: ["babel-loader"],
                },
            ],
        },
        // pass all js files through Babel
        resolve: {
            extensions: ["*", ".js", ".jsx"],    // <-- added `.jsx` here
        },
    })
});
module.exports = Modules;