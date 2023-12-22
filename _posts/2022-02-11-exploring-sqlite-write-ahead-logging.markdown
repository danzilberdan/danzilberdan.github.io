---
layout: post
title:  "Exploring Write Ahead Logging in SQLite"
date:   2023-12-22 12:08:00 +0200
categories: jekyll update
---
<blockquote>SQLite is the most used database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inside countless other applications that people use every day.</blockquote>
In this post, I aim to delve deeply into the mechanisms by which SQLite ensures data validity even in the face of errors, power failures, and various other unforeseen mishaps.

<h1>ACID</h1>
ACID stands for Atomicity, Consistency, Isolation and Durability. These are guarantees set by SQLite that users of an SQLite database can count on.

Operations on the database are grouped to transactions. Atomicity guarantees that each transaction will take effect only if it succeeds completely. If a transaction fails while running, the whole of it will take no effect and the database will be left unchanged. This includes recovery from power failures scenarios without ending up with partial writes.

Durability guarantees that once a transaction has been committed, it will remain so.

Isolation guarantees that concurrent readers and writers will not impact each other. A write operation will not change the data that a running read operation sees.

<h1>Write Ahead Logging</h1>
Write ahead logging (WAL) is one of the journaling modes used by SQLite. It allows SQLite databases to be compliant with ACID while allowing significantly better performance compared to older journaling modes.

SQLite database files are treated as a collection of pages. Each page is made up of exactly the same amount of bytes.

The write ahead log is another SQLite file kept separate from the database file. It includes a chronologically ordered log of updates to certain pages in the database file. Those pages represent the new content that should be set to these pages in the future.

<h4>Example</h4>

Let's look at an example. As you can see, at T0 (initial time), All pages are blue - representing their original content. As time passes, pages are modified. At T1, Page 0, is overriden with new data. At T2, pages 2 and 3 are overriden with new page contents. Notice that the changes are appended one on top of the other to the WAL.

<img src="https://docs.google.com/drawings/d/e/2PACX-1vQi01fFBD3hDG5kV4dGc7WMaGznZ_sBgp0vl-_tNhS5Vy4OmGPpqjJPTfU1BPkTSahiv346lLFIVuZ-/pub?w=1440&amp;h=810">

<h1>Power Loss</h1>
Let's assume a power loss occurs after the WAL has been persisted to the disk. The next time the database will be opened, the WAL file will still be available and the application will start to write the modified pages to the database file again. This way it's guaranteed that committed transactions will not be undone.

If a power loss occurs in the middle of a transaction, the WAL file will contain a partial transaction that was not marked as fully complete. In that case, SQLite will know it should be ignored and the database's atomicity guarantee will be kept.

<h1>Application or Database Error</h1>
Other than power loss, an application can open a transaction and while executing operations, get into an error state. This can be caused by the application's logic or by database constraints for example. Either way, SQLite has the ability to rollback the database's state to the transaction's initial state. This is done by removing the modified pages from the WAL.

<h1>Concurrency</h1>
SQLite is used in a wide range of apps, many of which require concurrent access to the database. SQLite allows concurrent read processes but allows only one write process at a time.

Once a read process starts, SQLite checks for the newest committed page in the WAL. It will keep the index of that page as a marking of a frozen state which the read process will execute on. Whenever SQLite accesses a certain page, it will check the WAL for the newest page data but will ignore WAL entries that were added after the marking. This is done in order for the read process to act on the database as if a snapshot was taken at the exact moment the read process started. If database changes are commited while the read process is running, they will not interfere with the read operation. Thanks to this property, Isolation is preserved while accessing the database concurrently.

<h1>Checkpoints</h1>
Once in a while, A checkpoint will run (by a user or automatically). A checkpoint operation updates the database file with the changes contained in the WAL.

If a checkpoint operation is executed while a read or write operations are running, it will only persist pages until it reaches a marking. The marking signals that a reader process relies on the state that existed when it started. SQLite will not checkpoint further because doing so will override the state that the reader process relies on with newer updates.

<h1>References</h1>
Read <a href="https://sqlite.org/wal.html" target="_blank">SQLite's documentation on WAL</a> for further information and implementation details.
