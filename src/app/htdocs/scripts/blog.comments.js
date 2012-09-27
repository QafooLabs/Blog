/**
 * Comment handling
 *
 * Licensed under AGPL3
 */
;( function( $ ) {
    $.fn.comments = function()
    {
        var create;

        create = function( e, data )
        {
            var now = new Date(),
                comment = {
                    type:      "comment",
                    path:      JSON.parse( data.parent ) || [],
                    post:      data.post,
                    edited:    now.getTime(),
                    comment:   data.comment,
                    author:    data.name
                };

            // Submit comment to database
            $.ajax( {
                type: "POST",
                url: "/api/",
                success: function( comments, textStatus, request ) {
                    $( e.target ).trigger( "postUpdated" );
                },
                error: function( request, textStatus, error ) {
                    var result = JSON.parse( request.responseText );
                    alert( "Error: " + result.reason );
                    throw( result );
                },
                dataType: "json",
                data: JSON.stringify( comment ),
                contentType: "application/json",
            } );
        };

        return this.each( function()
        {
            $(this).bind( "commentCreate", create );
        } );
    };
}( jQuery ) );
