function ( doc ) {
    if ( doc.type === "comment" ) {
        var path = [doc.post].concat( doc.path );
        path.push( doc._id );
        emit( path, null );
    }
}
