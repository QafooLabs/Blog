/**
 * Comment handling
 *
 * Licensed under AGPL3
 */
;( function( $ ) {
    $.fn.comments = function()
    {
        var list, load, create, update, remove, removeAttachment;

        list = function( e, data )
        {
            Lounge.utils.queryApi(
                "/_design/app/_view/comments?include_docs=true",
                function( comments, textStatus, request ) {
                    $( e.target ).trigger( "listComments", [comments] );
                }
            );
        };

        load = function( e, data )
        {
            Lounge.utils.queryApi(
                "/" + data,
                function( comment, textStatus, request ) {
                    $( e.target ).trigger( "showComment", [comment] );
                }
            );
        };

        create = function( e, data )
        {
            var now = new Date(),
                comment = {
                    type:      "comment",
                    post:      data.post,
                    edited:    now.getTime(),
                    comment:   data.comment,
                    author:    data.name
                };

            // Submit comment to database
            Lounge.utils.queryApi(
                "/",
                function( data, textStatus, request ) {
                    $( e.target ).trigger( "postUpdated" );
                },
                JSON.stringify( comment ),
                "POST"
            );
        };

        return this.each( function()
        {
            $(this).bind( "commentList", list );
            $(this).bind( "commentCreate", create );
            $(this).bind( "commentLoad", load );
        } );
    };
}( jQuery ) );
