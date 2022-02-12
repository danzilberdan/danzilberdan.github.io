---
layout: post
title:  "Exploring Write Ahead Logging in SQLite"
date:   2022-02-11 22:51:41 +0200
categories: jekyll update
---

<h1>ACID properties</h1>
SQLite is compliant with ACID in order to guarantee data validity despite errors, power failures, and other mishaps. ACID stands for Atomicity, Consistency, Isolation and Durability.

Atomicity guarantees that each transaction will take effect only if it succeeds completely. If it fails, the whole transaction will take no effect and the database will be left unchanged. As mentioned, this includes power failures and application side errors that can occur while the transaction is running. This means that the database should be able to recover from these scenarios without ending up with partial writes and corruption.

Durability guarantees that once a transaction has been committed, it will remain so.

Isolation guarantees that concurrent readers and writers will not impact each other. A write operation will not change the data that a read operation accesses.

<h1>Write Ahead Logging</h1>
Write ahead logging is one of the journaling modes used by SQLite. It allows SQLite databases to be compliant with ACID while significantly improving on the performance of older journaling modes.

The write ahead log is kept separate from the database. It includes an ordered set of file page updates that should be made to the database in the future.

A database connection can execute a checkpoint. A checkpoint will try to update the database file according to the WAL. This means it will go through the WAL and write some of the pages to the database. Later I will explain which pages can be written and which can't.

Checkpoints are configured by default to occur automatically when the WAL file reaches a threshold size of 1000 pages. Applications can disable automatic checkpoints and run them during idle moments or in a separate thread or process.

<h4>Example</h4>

<img src="https://docs.google.com/drawings/d/e/2PACX-1vQi01fFBD3hDG5kV4dGc7WMaGznZ_sBgp0vl-_tNhS5Vy4OmGPpqjJPTfU1BPkTSahiv346lLFIVuZ-/pub?w=1440&amp;h=810">

As you can see, in T1, an update to page 0 is added to the WAL. Following it, in T2, multiple page changes (2) are appended to the WAL and override the content of page 2 and 3.

<img src="https://docs.google.com/drawings/d/e/2PACX-1vSliv4ZK-C4PIU3-puv8uPc-4hCBBl4f3X1vHkX8mkvrfIIfvUqri9TJm881NrY2tIpPMrKILX6VYGr/pub?w=1440&amp;h=810">

<h1>Power Loss</h1>
Let's assume a power loss occurs after the WAL has been persisted to the disk just after T3. The next time the database will be opened, the wal file will still be available and the application will start to write the modified pages to the database file again. This way it's guaranteed that no committed transactions will not be undone.

If the power loss occurs in the middle of a transaction, write in T3 as an example, the WAL file will contain a partial transaction that was not marked as fully complete. This way SQLite will know it should be ignored which will keep the database Atomic.

<h1>Application or Database Error</h1>
Other than power loss, the application can open a transaction and decide in the middle of it that something is wrong. In addition, some constraints can lead to errors that originate from the database itself. In those cases, SQLite has the ability to rollback the database's state to just before the transaction was started. This is done by removing the modified pages in WAL which are part of the transaction.

<h1>Concurrency</h1>
SQLite is used in a wide range of products, many of which require concurrent access to the database. SQLite allows concurrent read operations to execute concurrently while only one write operation can execute at any point in time.

Once a read operation starts, it checks for the newest committed page in the WAL. It will keep the index of that page as an "end mark". Whenever it will be required to read pages from the database file, it will first check if the WAL contains pages overriding that specific page which also have an index that is lower or equal to the "end mark". If so, the most up to date page will be used instead of the actual file's page. This is done in order for the read operation to act on the database as if a snapshot was taken at the exact moment the read started. If new modified pages are committed, they will not interfere with the read operation because it is locked to the point in time that it started - the "end mark". Thanks to this property, Isolation is preserved while accessing the database concurrently.

If a checkpoint operation is executed while read or write operations are running, the checkpoint will iterate the WAL and checkpoint pages until it reaches an "end mark". It will not checkpoint further because doing so will mean that the reader who uses that "end mark" will start losing page data that will be overridden by newer updates that are not supposed to impact it.

Only one write operation can execute at any point in time. This is done because otherwise, Isolation will not be preserved.

<h1>References</h1>
Read <a href="https://sqlite.org/wal.html" target="_blank">SQLite's documentation on WAL</a> for further information and implementation details.
