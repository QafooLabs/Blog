/*global jQuery: false, Lounge: false, Blog: false, parseURL: false */

// Globally available variables
var History;

jQuery().ready(function() {
    "use strict";

    // Initilialize application
    var app    = new Blog.App(),
        router = new Lounge.Router( [
            {   name:   "main",
                regexp: /^\/$/ },
            {   name:   "createPost",
                regexp: /^\/post\/create$/ },
            {   name:   "viewPost",
                regexp: /^\/post\/(.*)$/ },
            {   name:   "404",
                regexp: /./ }
    ] );

    // Start application from currently clicked / used URL
    (function( window ) {
        History = window.History;

        // Bind to StateChange Event
        History.Adapter.bind( window, 'statechange', function () {
            var State = History.getState();
            router.route( parseURL( location.href ) );
        });

        jQuery( window ).trigger( "statechange" );
        jQuery( window ).trigger( "contentLoaded", "body" );

    }( window ) );
} );
