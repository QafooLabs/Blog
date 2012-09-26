/**
 * Watch handling
 *
 * Licensed under AGPL3
 */
;( function( $ ) {
    $.fn.posts = function()
    {
        var list, load, create, update, remove, removeAttachment;

        list = function( e, data )
        {
            Lounge.utils.queryApi(
                "/_design/app/_view/posts?include_docs=true",
                function( posts, textStatus, request ) {
                    $( e.target ).trigger( "listWatches", [posts] );
                }
            );
        };

        load = function( e, data )
        {
            Lounge.utils.queryApi(
                "/" + data,
                function( post, textStatus, request ) {
                    $( e.target ).trigger( "showWatch", [post] );
                }
            );
        };

        create = function( e, data )
        {
            var now = new Date(),
                post = {
                    type:      "post",
                    edited:    now.getTime(),
                    number:    parseInt( data.number, 10 ),
                    value:     parseInt( data.value, 10 ),
                    material:  data.material,
                    features:  data.features,
                    gravure:   data.gravure,
                    hinged:    data.hinged ? true : false,
                    precision: data.precision,
                    producer:  data.producer,
                    build:     parseInt( data.build, 10 )
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

        update = function( e, data )
        {
            var now = new Date(),
                post = {
                    type:         "post",
                    edited:       now.getTime(),
                    _rev:         data._rev,
                    _attachments: data._attachments,
                    number:       parseInt( data.number, 10 ),
                    value:        parseInt( data.value, 10 ),
                    material:     data.material,
                    features:     data.features,
                    gravure:      data.gravure,
                    hinged:       data.hinged ? true : false,
                    precision:    data.precision,
                    producer:     data.producer,
                    build:        parseInt( data.build, 10 )
                };

            // Submit post to database
            Lounge.utils.queryApi(
                "/" + data._id,
                function( data, textStatus, request ) {
                    $( e.target ).trigger( "postUpdated" );
                },
                JSON.stringify( post ),
                "PUT"
            );
        };

        remove = function( e, data )
        {
            Lounge.utils.queryApi(
                "/" + data._id + "?rev=" + data._rev,
                function( data, textStatus, request ) {
                    $( e.target ).trigger( "postUpdated" );
                },
                null,
                "DELETE"
            );
        };

        removeAttachment = function( e, data )
        {
            var id = data.substr( 0, data.indexOf( "/" ) );
            Lounge.utils.queryApi(
                "/" + data,
                function( data, textStatus, request ) {
                    $( e.target ).trigger( "postLoad", [id] );
                },
                null,
                "DELETE"
            );
        };

        return this.each( function()
        {
            $(this).bind( "postList", list );
            $(this).bind( "postCreate", create );
            $(this).bind( "postLoad", load );
            $(this).bind( "postUpdate", update );
            $(this).bind( "postDelete", remove );
            $(this).bind( "postRemoveAttachment", removeAttachment );
        } );
    };
}( jQuery ) );
