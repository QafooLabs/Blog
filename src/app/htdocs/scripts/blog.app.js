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
        $( window ).comments();
        $( window ).user();
        $( '.navbar' ).markCurrent( {
            "main":       "nav-home",
            "createPost": "nav-create",
            "user":       "nav-user"
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

        $( window ).bind( "route:user", app.initViewLogin );
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

        $( window ).bind( "postUpdated", function() {
            History.pushState( null, null, "/" );
        } );
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
     * Initialize main blog posts view of application
     *
     * @param Event event
     * @param Request request
     */
    App.prototype.initMain = function( event, request ) {
        $( window ).dispatch( "listPosts", '#content', 'updateContents', function ( data ) {
            return {
                template: "post-list.mustache",
                viewData: {
                    posts: $.map( data.rows, function( value ) {
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
    App.prototype.initCreatePost = function( event, request ) {
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
     * Initialize blog post view of the application
     *
     * @param Event event
     * @param Request request
     */
    App.prototype.initViewPost = function( event, request ) {
        $( window ).dispatch( "showPost", '#content', 'updateContents', function ( data ) {
            return {
                template: "post-show.mustache",
                viewData: data,
                success:  function() {
                    $( "#comment-create" ).dispatch( "submit", window, "commentCreate", function () {
                        return Lounge.utils.formToObject( "#comment-create" );
                    }, null, true );
                }
            }
        } );

        $( window ).trigger( "postLoad", [request.url.params.match] );
    };

    /**
     * Initialize user login / register view of the application
     *
     * @param Event event
     * @param Request request
     */
    App.prototype.initViewLogin = function( event, request ) {
        $( window ).dispatch( "statusLoggedOut", '#content', 'updateContents', function ( data ) {
            return {
                template: 'login.mustache',
                viewData: data.userCtx,
                success:  function() {
                    $( "#login" ).dispatch( "submit", window, "login", function ( data ) {
                        return Lounge.utils.formToObject( "#login" );
                    }, null, true );

                    $( "#register" ).dispatch( "submit", window, "register", function ( data ) {
                        return Lounge.utils.formToObject( "#register" );
                    }, null, true );
                }
            }
        } );

        $( window ).dispatch( "statusLoggedIn", '#content', 'updateContents', function ( data ) {
            return {
                template: 'logout.mustache',
                viewData: data.userCtx,
                success:  function() {
                    $( "#userLogout" ).unbind( "click" );
                    $( "#userLogout" ).dispatch( "click", window, "logout", null, null, true );
                }
            }
        } );

        $( window ).dispatch( "statusLoggedIn", window, 'postSetAuthor', function ( data ) {
            return data.userCtx;
        } );

        $( window ).trigger( "checkLogin" );
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
                regexp: /^\/post\/([a-f0-9]+)$/ },
            {   name:   "user",
                regexp: /^\/user$/ },
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
