/**
 * Post handling
 *
 * Licensed under AGPL3
 */
;( function( $ ) {
    $.fn.posts = function()
    {
        var list, load, create, setAuthor, user;

        list = function( e, data )
        {
            $.ajax( {
                type: null, // @TODO: Add
                url: null, // @TODO: Add
                success: function( posts, textStatus, request ) {
                    $( e.target ).trigger( "listPosts", [posts] );
                },
                error: function( request, textStatus, error ) {
                    console.log( request );
                    var result = JSON.parse( request.responseText );
                    alert( "Error: " + result.reason );
                    throw( result );
                },
                dataType: "json",
                contentType: "application/json",
            } );
        };

        load = function( e, data )
        {
            $.ajax( {
                type: null, // @TODO: Add
                url: null, // @TODO: Add
                success: function( post, textStatus, request ) {
                    $( e.target ).trigger( "showPost", [{post: post}] );
                },
                error: function( request, textStatus, error ) {
                    var result = JSON.parse( request.responseText );
                    alert( "Error: " + result.reason );
                    throw( result );
                },
                dataType: "json",
                contentType: "application/json",
            } );
        };

        create = function( e, data )
        {
            var now = new Date(),
                post = {
                    type:      "post",
                    author:    user,
                    edited:    now.getTime(),
                    title:     data.title,
                    abstract:  data.abstract,
                    text:      data.text
                };

            // Submit post to database
            $.ajax( {
                type: null, // @TODO: Add
                url: null, // @TODO: Add
                success: function( comments, textStatus, request ) {
                    $( e.target ).trigger( "postUpdated" );
                },
                error: function( request, textStatus, error ) {
                    var result = JSON.parse( request.responseText );
                    alert( "Error: " + result.reason );
                    throw( result );
                },
                dataType: "json",
                data: JSON.stringify( post ),
                contentType: "application/json",
            } );
        };

        setAuthor = function( e, data )
        {
            user = data.name;
        };

        return this.each( function()
        {
            $(this).bind( "postList", list );
            $(this).bind( "postCreate", create );
            $(this).bind( "postLoad", load );
            $(this).bind( "postSetAuthor", setAuthor );
        } );
    };
}( jQuery ) );
