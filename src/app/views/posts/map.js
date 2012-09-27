function ( doc ) {
    if ( doc.type === "post" ) {
        emit( doc.edited, null );
    }
}
