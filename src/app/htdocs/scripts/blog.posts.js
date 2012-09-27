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
            Lounge.utils.queryApi(
                "/_design/app/_view/posts?include_docs=true&descending=true",
                function( posts, textStatus, request ) {
                    $( e.target ).trigger( "listPosts", [posts] );
                }
            );
        };

        load = function( e, data )
        {
            Lounge.utils.queryApi(
                "/" + data,
                function( post, textStatus, request ) {
                    Lounge.utils.queryApi(
                        "/_design/app/_view/comments?" + 
                            encodeURI( "startkey=[\"" + data + "\"]" ) + "&" +
                            encodeURI( "endkey=[\"" + data + "\",{}]" ) + "&" +
                            "include_docs=true",
                        function( comments, textStatus, request ) {
                            $( e.target ).trigger( "showPost", [{post: post, comments: comments.rows}] );
                        }
                    );
                }
            );
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
            Lounge.utils.queryApi(
                "/",
                function( data, textStatus, request ) {
                    $( e.target ).trigger( "postUpdated" );
                },
                JSON.stringify( post ),
                "POST"
            );
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
