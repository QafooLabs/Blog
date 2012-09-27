function ( doc ) {
    if ( doc.type === "comment" ) {
        emit( [doc.post, doc.edited], null );
    }
}
