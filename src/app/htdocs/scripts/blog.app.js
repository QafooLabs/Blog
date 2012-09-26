/**
 * Basic application dispatching configuration
 *
 * Licensed under AGPL3
 */
(function( global ) {

    var App = function() {
        var app = this;

        $( '#content' ).templating();
        $( window ).posts();
        $( '.navbar' ).markCurrent( {
            "main":     "nav-home",
            "create":   "nav-create"
        } );

        // General content handling
        $( window ).bind( "contentLoaded", function ( e, target ) {
            $( target ).find( "a" ).not( "[href^=\"http\"]" ).bind( "click", function() {
                History.pushState( null, null, $(this).attr( "href" ) );
                return false;
            } );
        } );

        $( window ).bind( "route", app.initAppBase );

        $( window ).bind( "route:404", app.showNotFound );
        $( window ).bind( "route:main", app.initMain );
        $( window ).bind( "route:createPost", app.initCreatePost );
        $( window ).bind( "route:viewPost", app.initViewPost );
    };

    /**
     * Initialize general application configuration
     *
     * @param Event event
     * @param Request request
     */
    App.prototype.initAppBase = function( event, request ) {

        // Reset all singals on "startup"
        $( $.fn.dispatch.sources ).unbind( ".dispatcher" );
        $.fn.dispatch.sources = [];

        // Mark current selected tab as selected
        $( '.navbar' ).trigger( "markCurrentLink", [request.matched] );

        // Show application initilization screen
        $( '#content' ).trigger( 'updateContents', [{template: 'initialize.mustache' }] );
    };

    /**
     * Show not found result for unmatched routes
     *
     * @param Event event
     * @param Request request
     */
    App.prototype.showNotFound = function( event, request ) {
        $( '#content' ).trigger( 'updateContents', [{template: "404.mustache"}] );
    };

    /**
     * Initialize main tweet view of application
     *
     * @param Event event
     * @param Request request
     */
    App.prototype.initMain = function( event, request ) {
        $( window ).dispatch( "listPosts", '#content', 'updateContents', function ( data ) {
            return {
                template: "post-list.mustache",
                viewData: {
                    post: $.map( data.rows, function( value ) {
                        var post = value.doc;
                        post.formattedTime = Lounge.utils.formatTime( post.edited );
                        return post;
                    } )
                }
            }
        } );

        $( window ).trigger( "postList" );
    };

    /**
     * Initialize accounts view of the application
     *
     * @param Event event
     * @param Request request
     */
    App.prototype.initCreate = function( event, request ) {
        $( '#content' ).trigger( 'updateContents', [{
            template: "post-create.mustache",
            success:  function() {
                $( "#post-create" ).dispatch( "submit", window, "postCreate", function () {
                    return Lounge.utils.formToObject( "#post-create" );
                }, null, true );
            }
        }] );
    };

    /**
     * Initialize accounts view of the application
     *
     * @param Event event
     * @param Request request
     */
    App.prototype.initView = function( event, request ) {
        $( window ).dispatch( "showPost", '#content', 'updateContents', function ( data ) {
            if ( data._attachments ) {
                data._attachments = $.map( data._attachments, function( value, key ) {
                    value.name = key;
                    return value;
                } );
            }

            return {
                template: "post-show.mustache",
                viewData: data
            }
        } );

        $( window ).trigger( "postLoad", [request.url.params.match] );
    };

    // Exports
    global.Blog = global.Blog || {};
    global.Blog.App = App;

})(this);

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
