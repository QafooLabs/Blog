====
Blog
====

Simple CouchApp Blog.

System configuration
====================

The following lines are required in ``/etc/couchdb/local.ini``::

    blog:5984 = /blog/_design/app/_rewrite

Then you can request the uploaded website at: http://blog:5984/

Also add the host ``blog`` to the ``/etc/hosts`` file::
    
    127.0.0.1   blog

Pushing the app
===============

To ppush the application into CouchDB, use the ``push`` script, which is
available in the ``src/`` directory. The scripts accepts the database URL as a
first parameter and the path to the application as a second parameter.
Example::

    ./push http:://user:pass@localhost:5984/blog app/

Since sane default values are assumed for most parts of the URL in most cases
the following thing should also work::

    ./push /blog app/


..
   Local Variables:
   mode: rst
   fill-column: 79
   End: 
   vim: et syn=rst tw=79
